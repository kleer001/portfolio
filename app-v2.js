/* ARCAN_9022 · Index — v2 app logic (spec-mapped) */

// Minimal state — no repo filter/search/drawer in this version; cards are authored inline.
function tickClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const pad = n => String(n).padStart(2, "0");
  const d = new Date();
  el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
setInterval(tickClock, 30000); tickClock();

function setupScrollSpy() {
  const ids = [...document.querySelectorAll(".nav-dot")].map(a => a.getAttribute("href").slice(1));
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const links = [...document.querySelectorAll(".nav-dot")];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(s => io.observe(s));
}

document.addEventListener("keydown", e => {
  if (e.target.matches("input, textarea")) return;
  const k = parseInt(e.key, 10);
  if (!isNaN(k) && k >= 1 && k <= 5) {
    const n = document.querySelector(`.nav-dot[data-k="${k}"]`);
    if (n) n.click();
  }
});

// ------- Tweaks -------
const ACCENTS = {
  navy:  { ink: "#1a3a6b", ink2: "#2c6fb5" },
  ocean: { ink: "#2c6fb5", ink2: "#4c95d8" },
  slate: { ink: "#445a7a", ink2: "#6a86ab" },
  teal:  { ink: "#1f5e5e", ink2: "#2f8686" },
  ink:   { ink: "#0e1b33", ink2: "#2c3f66" }
};
function applyState(s) {
  const a = ACCENTS[s.accent] || ACCENTS.ink;
  const r = document.documentElement.style;
  r.setProperty("--ink", a.ink);
  r.setProperty("--ink-2", a.ink2);
  r.setProperty("--dx", s.density);
  document.body.dataset.serif = s.serif ? "1" : "0";
  document.body.dataset.paper = s.paper ? "1" : "0";

  document.querySelectorAll(".sw").forEach(b => b.classList.toggle("active", b.dataset.accent === s.accent));
  const $ = id => document.getElementById(id);
  if ($("twDensity")) $("twDensity").value = s.density;
  if ($("twSerif"))   $("twSerif").checked = s.serif;
  if ($("twPaper"))   $("twPaper").checked = s.paper;
}
let STATE = { ...TWEAK_DEFAULTS };
function updateState(patch) {
  STATE = { ...STATE, ...patch };
  applyState(STATE);
  window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
}
function setupTweaksUI() {
  document.querySelectorAll(".sw").forEach(b => b.addEventListener("click", () => updateState({ accent: b.dataset.accent })));
  document.getElementById("twDensity").addEventListener("input", e => updateState({ density: parseFloat(e.target.value) }));
  document.getElementById("twSerif").addEventListener("change",  e => updateState({ serif:  e.target.checked }));
  document.getElementById("twPaper").addEventListener("change",  e => updateState({ paper:  e.target.checked }));
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
