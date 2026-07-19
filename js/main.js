// Umpire80 press-and-hold cake + confetti + optional CTA (no auto-redirect)

const btn = document.getElementById("cakeButton");
const progressFill = document.getElementById("progressFill");
const holdHint = document.getElementById("holdHint");
const afterMessage = document.getElementById("afterMessage");

const ctaPanel = document.getElementById("ctaPanel");
const goLinkBtn = document.getElementById("goLinkBtn");
const noBtn = document.getElementById("noBtn");

const canvas = document.getElementById("confetti");
const ctx = canvas?.getContext("2d");

const CHANGE_URL = window.CHANGE_URL || "https://example.com";

// How long to hold (ms)
const HOLD_MS = 1700;
// Progress update interval
const TICK_MS = 16;

let holding = false;
let triggered = false;
let startTime = 0;
let tickId = null;

// ---------- Hold / Trigger ----------
function resetHoldUI() {
  holding = false;
  if (tickId) clearInterval(tickId);
  tickId = null;

  if (progressFill) progressFill.style.transform = "scaleX(0)";
  if (holdHint) holdHint.textContent = "Press & hold…";
  // If user releases before unlocking, hide CTA again
  if (ctaPanel && !triggered) ctaPanel.classList.remove("show");
}

function triggerUnlock() {
  if (triggered) return;
  triggered = true;
  holding = false;

  if (holdHint) holdHint.textContent = "Unlocked! 🎉";
  if (afterMessage) afterMessage.classList.add("show");

  // Reveal the user's choice (no forced redirect)
  if (ctaPanel) ctaPanel.classList.add("show");
  if (goLinkBtn) {
    goLinkBtn.href = CHANGE_URL;
    goLinkBtn.setAttribute("aria-label", "Open Change.org page");
  }

  startConfetti(220);

  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
}

function startHold() {
  if (!btn || triggered) return;

  holding = true;
  startTime = performance.now();

  if (progressFill) progressFill.style.transform = "scaleX(0)";
  if (holdHint) holdHint.textContent = "Keep holding…";

  tickId = setInterval(() => {
    if (!holding) return;

    const elapsed = performance.now() - startTime;
    const p = Math.max(0, Math.min(1, elapsed / HOLD_MS));

    if (progressFill) progressFill.style.transform = `scaleX(${p})`;

    if (p >= 1) {
      clearInterval(tickId);
      tickId = null;
      triggerUnlock();
    }
  }, TICK_MS);
}

// Pointer events cover mouse + touch
if (btn) {
  btn.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    btn.setPointerCapture?.(e.pointerId);
    startHold();
  });

  btn.addEventListener("pointerup", resetHoldUI);
  btn.addEventListener("pointercancel", resetHoldUI);
  btn.addEventListener("pointerleave", resetHoldUI);

  // Keyboard accessibility
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerUnlock();
    }
  });
}

// If user clicks “No thanks”, just hide the CTA (doesn’t break the page)
if (noBtn) {
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (ctaPanel) ctaPanel.classList.remove("show");
  });
}

// ---------- Confetti ----------
let W = 0, H = 0;
function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = Math.floor(window.innerWidth * dpr);
  H = Math.floor(window.innerHeight * dpr);

  if (canvas) {
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }
}
window.addEventListener("resize", resize);
resize();

const colors = ["#FF4D6D", "#FFD166", "#06D6A0", "#4DA3FF", "#B388FF", "#FFFFFF"];
let particles = [];
let anim = false;

function startConfetti(count) {
  if (!canvas || !ctx) return;

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduce) return;

  const dpr = window.devicePixelRatio || 1;
  const cx = W * 0.5;
  const cy = H * 0.25;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 18 * dpr,
      vy: (Math.random() - 0.8) * 16 * dpr,
      g: 0.45 * dpr,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      w: (6 + Math.random() * 10) * dpr,
      h: (4 + Math.random() * 10) * dpr,
      life: 70 + Math.floor(Math.random() * 40),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  if (!anim) {
    anim = true;
    requestAnimationFrame(tick);
  }
}

function tick() {
  ctx.clearRect(0, 0, W, H);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life--;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();

    if (p.life <= 0) particles.splice(i, 1);
  }

  if (particles.length > 0) requestAnimationFrame(tick);
  else anim = false;
}
