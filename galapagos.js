/* Live evolutionary-art widget — richer genome→image.
   B&W, horizontal mirror, deeper trees, domain warping, multi-channel
   composition, smooth crossfades between generations. */
(() => {
  const cvs = document.getElementById("gal");
  if (!cvs) return;
  const W = cvs.width, H = cvs.height;

  // Higher eval resolution (half-width mirrored → full 240)
  const RW = 120, RH = 320;
  const FW = RW * 2;

  // Two offscreen buffers for crossfade between generations
  const mk = () => { const c = document.createElement("canvas"); c.width = FW; c.height = RH; return c; };
  const bufA = mk(), bufB = mk();
  let curBuf = bufA, nextBuf = bufB;
  let curCtx = curBuf.getContext("2d"), nextCtx = nextBuf.getContext("2d");
  const ctx = cvs.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // ---------- grammar ----------
  const TERMS = ["x", "y", "r", "th", "c"];
  const UN = ["sin", "cos", "abs", "neg", "sq", "tanh", "gauss", "ridge", "frac", "pow3"];
  const BIN = ["add", "sub", "mul", "avg", "max", "min", "hyp"];
  const TERN = ["mix", "warp"];

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];

  // Deeper trees, lower early-terminate probability
  const MAX_DEPTH = 8;
  const TERM_P = 0.08;

  function grow(depth) {
    if (depth <= 0 || Math.random() < TERM_P) {
      const t = pick(TERMS);
      if (t === "c") return { op: "c", v: rand(-1.6, 1.6) };
      return { op: t };
    }
    const r = Math.random();
    if (r < 0.26) return { op: pick(UN),  a: grow(depth - 1), k: rand(0.6, 4.5) };
    if (r < 0.88) return { op: pick(BIN), a: grow(depth - 1), b: grow(depth - 1) };
    return { op: pick(TERN), a: grow(depth - 1), b: grow(depth - 1), c: grow(depth - 1), k: rand(0.4, 2.2) };
  }

  // Pseudo-noise (value-noise-ish): smooth hash-based lattice
  function hash2(ix, iy) {
    let h = (ix * 374761393) ^ (iy * 668265263);
    h = (h ^ (h >>> 13)) * 1274126177;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295 * 2 - 1;
  }
  const smooth = t => t*t*(3 - 2*t);
  function vnoise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const a = hash2(ix,   iy);
    const b = hash2(ix+1, iy);
    const c = hash2(ix,   iy+1);
    const d = hash2(ix+1, iy+1);
    const u = smooth(fx), v = smooth(fy);
    return (a*(1-u) + b*u) * (1-v) + (c*(1-u) + d*u) * v;
  }

  function ev(n, x, y, r, th) {
    switch (n.op) {
      case "x": return x;
      case "y": return y;
      case "r": return r;
      case "th": return Math.sin(th * 2);
      case "c": return n.v;
      case "sin":  return Math.sin(ev(n.a,x,y,r,th) * n.k);
      case "cos":  return Math.cos(ev(n.a,x,y,r,th) * n.k);
      case "abs":  return Math.abs(ev(n.a,x,y,r,th)) * 2 - 1;
      case "neg":  return -ev(n.a,x,y,r,th);
      case "sq":   { const v = ev(n.a,x,y,r,th); return v*v*2 - 1; }
      case "tanh": return Math.tanh(ev(n.a,x,y,r,th) * n.k);
      case "gauss":{ const v = ev(n.a,x,y,r,th); return Math.exp(-v*v*2) * 2 - 1; }
      case "ridge":return 1 - 2*Math.abs(ev(n.a,x,y,r,th));
      case "frac": { const v = ev(n.a,x,y,r,th) * n.k; return (v - Math.floor(v)) * 2 - 1; }
      case "pow3": { const v = ev(n.a,x,y,r,th); return v*v*v; }
      case "add": return (ev(n.a,x,y,r,th) + ev(n.b,x,y,r,th)) * 0.5;
      case "sub": return (ev(n.a,x,y,r,th) - ev(n.b,x,y,r,th)) * 0.5;
      case "mul": return ev(n.a,x,y,r,th) * ev(n.b,x,y,r,th);
      case "avg": return (ev(n.a,x,y,r,th) + ev(n.b,x,y,r,th)) * 0.5;
      case "max": return Math.max(ev(n.a,x,y,r,th), ev(n.b,x,y,r,th));
      case "min": return Math.min(ev(n.a,x,y,r,th), ev(n.b,x,y,r,th));
      case "hyp": { const a = ev(n.a,x,y,r,th), b = ev(n.b,x,y,r,th); return Math.tanh(Math.sqrt(a*a+b*b)) * 2 - 1; }
      case "mix": { const t = (ev(n.c,x,y,r,th)+1)*0.5; return ev(n.a,x,y,r,th)*(1-t) + ev(n.b,x,y,r,th)*t; }
      case "warp": {
        // domain-warp: offset (x,y) by two child fields before eval
        const dx = ev(n.a, x, y, r, th) * n.k;
        const dy = ev(n.b, x, y, r, th) * n.k;
        const x2 = x + dx, y2 = y + dy;
        const r2 = Math.sqrt(x2*x2 + y2*y2), th2 = Math.atan2(y2, x2);
        return ev(n.c, x2, y2, r2, th2);
      }
    }
    return 0;
  }

  // Multi-channel compose: 2–3 trees, blended
  function genome() {
    const nTrees = 2 + (Math.random() < 0.5 ? 0 : 1);
    const trees = [];
    for (let i = 0; i < nTrees; i++) trees.push(grow(MAX_DEPTH - (i === 0 ? 0 : 2)));
    const mixer = pick(["avg", "mul", "max", "min", "hyp"]);
    const postK = rand(1.1, 2.4);
    const noiseK = rand(0.0, 0.25); // subtle detail layer
    const noiseFreq = rand(3, 8);
    return { trees, mixer, postK, noiseK, noiseFreq };
  }

  function compose(g, x, y, r, th) {
    let v;
    if (g.trees.length === 1) v = ev(g.trees[0], x, y, r, th);
    else {
      const a = ev(g.trees[0], x, y, r, th);
      const b = ev(g.trees[1], x, y, r, th);
      const c = g.trees[2] ? ev(g.trees[2], x, y, r, th) : 0;
      switch (g.mixer) {
        case "avg": v = (a + b + (g.trees[2] ? c : 0)) / (g.trees[2] ? 3 : 2); break;
        case "mul": v = a * b * (g.trees[2] ? (c*0.5+0.5) : 1); break;
        case "max": v = Math.max(a, b, g.trees[2] ? c : -2); break;
        case "min": v = Math.min(a, b, g.trees[2] ? c :  2); break;
        case "hyp": v = Math.tanh(Math.sqrt(a*a + b*b + (g.trees[2]?c*c:0))) * 2 - 1; break;
        default:    v = a;
      }
    }
    if (g.noiseK > 0) v += vnoise(x * g.noiseFreq, y * g.noiseFreq) * g.noiseK;
    v = Math.sin(v * g.postK);
    return (v + 1) * 0.5;
  }

  // ---- viability gate: ~256 samples vs 38k px paint, <1% cost ----
  function viability(g) {
    const N = 16;
    let sum = 0, sumSq = 0, minV = Infinity, maxV = -Infinity;
    for (let j = 0; j < N; j++) {
      const yn = (j / (N - 1)) * 2 - 1;
      for (let i = 0; i < N; i++) {
        const xn = (i / (N - 1)) * 2 - 1;
        const rn = Math.sqrt(xn*xn + yn*yn);
        const th = Math.atan2(yn, xn);
        const v = compose(g, xn, yn, rn, th);
        if (!isFinite(v)) return false;
        if (v < minV) minV = v;
        if (v > maxV) maxV = v;
        sum += v; sumSq += v*v;
      }
    }
    const n = N * N;
    const mean = sum / n;
    const variance = Math.max(0, sumSq / n - mean * mean);
    const range = maxV - minV;
    return range > 0.22 && variance > 0.008;
  }

  function viableGenome(maxTries = 40) {
    for (let i = 0; i < maxTries; i++) {
      const g = genome();
      if (viability(g)) return g;
    }
    return genome();
  }

  function paint(octx, g) {
    const img = octx.createImageData(FW, RH);
    for (let py = 0; py < RH; py++) {
      const yn = (py / (RH - 1)) * 2 - 1;
      for (let px = 0; px < RW; px++) {
        // left half: x in [-1, 0]; right half mirrored
        const xn = (px / (RW - 1)) - 1;
        const rn = Math.sqrt(xn*xn + yn*yn);
        const th = Math.atan2(yn, xn);
        let v = compose(g, xn, yn, rn, th);
        v = Math.max(0, Math.min(1, v));
        const gv = (v * 255) | 0;
        const iL = (py * FW + px) * 4;
        img.data[iL]   = gv; img.data[iL+1] = gv; img.data[iL+2] = gv; img.data[iL+3] = 255;
        const iR = (py * FW + (FW - 1 - px)) * 4;
        img.data[iR]   = gv; img.data[iR+1] = gv; img.data[iR+2] = gv; img.data[iR+3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
  }

  // Render current buffer to screen with alpha blend against next buffer
  function blit(alpha) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.drawImage(curBuf, 0, 0, FW, RH, 0, 0, W, H);
    if (alpha > 0) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(nextBuf, 0, 0, FW, RH, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }

  // ---- lifecycle: paint first genome, then evolve on a long, slow cycle ----
  let busy = false;

  function prepareNext() {
    paint(nextCtx, viableGenome());
  }

  function crossfade(durationMs) {
    if (busy) return;
    busy = true;
    const t0 = performance.now();
    const ease = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2; // in-out quad
    function step(now) {
      const t = Math.min(1, (now - t0) / durationMs);
      blit(ease(t));
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        // promote next → current
        [curBuf, nextBuf] = [nextBuf, curBuf];
        [curCtx, nextCtx] = [nextCtx, curCtx];
        blit(0);
        busy = false;
      }
    }
    requestAnimationFrame(step);
  }

  // initial frame
  paint(curCtx, viableGenome());
  blit(0);

  // rolling evolution: prepare next frame, then cross-fade over ~3s, hold ~15s
  const HOLD_MS = 15000;
  const FADE_MS = 3000;
  function loop() {
    prepareNext();
    crossfade(FADE_MS);
    setTimeout(loop, HOLD_MS + FADE_MS);
  }
  setTimeout(loop, HOLD_MS);

  // manual reroll: immediate (but still smooth)
  const btn = document.getElementById("galReroll");
  if (btn) btn.addEventListener("click", () => {
    if (busy) return;
    prepareNext();
    crossfade(1400);
  });
})();
