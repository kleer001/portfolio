/* portfolio v3 — app logic */

function tickClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const pad = n => String(n).padStart(2, "0");
  const d = new Date();
  el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
setInterval(tickClock, 30000); tickClock();

// ---- scroll spy (nav + key plan) ----
function setupScrollSpy() {
  const ids = [...document.querySelectorAll(".nav-dot")].map(a => a.getAttribute("href").slice(1));
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

  const navLinks = [...document.querySelectorAll(".nav-dot")];
  const kpLinks  = [...document.querySelectorAll(".kp-sheet")];

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
      // key plan: match by data-ref (nav uses sheet codes like "A-01")
      const ref = e.target.dataset.screenLabel?.split(" ")[0] || id;
      kpLinks.forEach(k => k.classList.toggle("is-active",
        k.getAttribute("href") === "#" + id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(s => io.observe(s));
}

// ---- keyboard shortcuts (1-5 jump to section) ----
document.addEventListener("keydown", e => {
  if (e.target.matches("input, textarea")) return;
  const k = parseInt(e.key, 10);
  if (!isNaN(k) && k >= 1 && k <= 5) {
    const n = document.querySelector(`.nav-dot[data-k="${k}"]`);
    if (n) n.click();
  }
});

// ---- accent palettes ----
const ACCENTS = {
  navy:  { ink: "#1a3a6b", ink2: "#2c6fb5" },
  ocean: { ink: "#2c6fb5", ink2: "#4c95d8" },
  slate: { ink: "#445a7a", ink2: "#6a86ab" },
  teal:  { ink: "#1f5e5e", ink2: "#2f8686" },
  ink:   { ink: "#0e1b33", ink2: "#2c3f66" }
};

function applyState(s) {
  const a = ACCENTS[s.accent] || ACCENTS.navy;
  const r = document.documentElement.style;
  r.setProperty("--ink",  a.ink);
  r.setProperty("--ink-2", a.ink2);
  r.setProperty("--dx", s.density);

  document.body.dataset.serif = s.serif ? "1" : "0";
  document.body.dataset.paper = s.paper ? "1" : "0";

  const app = document.getElementById("app");
  if (app) {
    app.dataset.grid  = s.grid  ? "1" : "0";
    app.dataset.annot = s.annot ? "1" : "0";
  }

  document.querySelectorAll(".sw").forEach(b =>
    b.classList.toggle("active", b.dataset.accent === s.accent));

  const $ = id => document.getElementById(id);
  if ($("twDensity")) $("twDensity").value = s.density;
  if ($("twSerif"))   $("twSerif").checked  = s.serif;
  if ($("twPaper"))   $("twPaper").checked  = s.paper;
  if ($("twGrid"))    $("twGrid").checked   = s.grid;
  if ($("twAnnot"))   $("twAnnot").checked  = s.annot;
}

let STATE = { ...TWEAK_DEFAULTS };

function updateState(patch) {
  STATE = { ...STATE, ...patch };
  applyState(STATE);
  window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
}

function setupTweaksUI() {
  document.querySelectorAll(".sw").forEach(b =>
    b.addEventListener("click", () => updateState({ accent: b.dataset.accent })));

  document.getElementById("twDensity").addEventListener("input",  e => updateState({ density: parseFloat(e.target.value) }));
  document.getElementById("twSerif").addEventListener("change",   e => updateState({ serif:  e.target.checked }));
  document.getElementById("twPaper").addEventListener("change",   e => updateState({ paper:  e.target.checked }));
  document.getElementById("twGrid").addEventListener("change",    e => updateState({ grid:   e.target.checked }));
  document.getElementById("twAnnot").addEventListener("change",   e => updateState({ annot:  e.target.checked }));

  document.getElementById("twClose").addEventListener("click", () => {
    document.getElementById("tweaks").hidden = true;
    window.parent.postMessage({ type: "__deactivate_edit_mode" }, "*");
  });
}

window.addEventListener("message", e => {
  const t = e.data && e.data.type;
  if (t === "__activate_edit_mode")   document.getElementById("tweaks").hidden = false;
  if (t === "__deactivate_edit_mode") document.getElementById("tweaks").hidden = true;
});
window.parent.postMessage({ type: "__edit_mode_available" }, "*");

applyState(STATE);
setupScrollSpy();
setupTweaksUI();
setupBgCanvas();

function setupBgCanvas() {
  const src = document.getElementById("gal");
  const bg  = document.getElementById("gal-bg");
  if (!src || !bg) return;
  const bgCtx = bg.getContext("2d");

  function resize() {
    bg.width  = window.innerWidth;
    bg.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function sync() {
    const bw = bg.width, bh = bg.height;
    const sw = src.width, sh = src.height;
    // cover: scale up to fill viewport, centred
    const scale = Math.max(bw / sw, bh / sh);
    const dw = sw * scale, dh = sh * scale;
    bgCtx.drawImage(src, (bw - dw) / 2, (bh - dh) / 2, dw, dh);
    requestAnimationFrame(sync);
  }
  requestAnimationFrame(sync);
}
