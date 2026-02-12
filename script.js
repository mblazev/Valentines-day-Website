// ====== Customize these ======
const CONFIG = {
  herName: "Iva",
  dateLabel: "February 14",
  planText: "dinner+ski date?",
  timeText: "9:00 AM",
  noteText: "Wear something comfy & pretty (optional)",
  noMessages: [
    "Are you suuuure? 😭",
    "Okay but like… think again 😅",
    "That button is kinda suspicious… 👀",
    "I’m gonna pretend I didn’t see that 😌",
    "Plot twist: you meant YES 💖",
    "Your finger slipped. Try again 😇",
    "No is temporarily out of service 🛠️",
  ],
};
// ============================

const herNameEl = document.getElementById("herName");
const dateLabelEl = document.getElementById("dateLabel");
const planEl = document.getElementById("planText");
const timeEl = document.getElementById("timeText");
const noteEl = document.getElementById("noteText");

herNameEl.textContent = CONFIG.herName;
dateLabelEl.textContent = CONFIG.dateLabel;
planEl.textContent = CONFIG.planText;
timeEl.textContent = CONFIG.timeText;
noteEl.textContent = CONFIG.noteText;

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const tinyHint = document.getElementById("tinyHint");
const success = document.getElementById("success");
const confettiBtn = document.getElementById("confettiBtn");

let noCount = 0;

// Make "No" button dodge the cursor/tap a bit
function moveNoButton() {
  const btnRect = noBtn.getBoundingClientRect();
  const pad = 12;

  // Compute movement bounds inside viewport
  const maxX = window.innerWidth - btnRect.width - pad;
  const maxY = window.innerHeight - btnRect.height - pad;

  const x = Math.max(pad, Math.floor(Math.random() * maxX));
  const y = Math.max(pad, Math.floor(Math.random() * maxY));

  // Use translate + fixed positioning for reliable movement
  noBtn.style.position = "fixed";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
  noBtn.style.transform = `translate(${x}px, ${y}px)`;

  // Make it slightly smaller over time (still readable)
  const scale = Math.max(0.72, 1 - noCount * 0.06);
  noBtn.style.scale = `${scale}`;
}

function updateHint() {
  const msg = CONFIG.noMessages[noCount % CONFIG.noMessages.length];
  tinyHint.textContent = msg;
}

function showSuccess() {
  success.hidden = false;
  // Scroll into view nicely on mobile
  success.scrollIntoView({ behavior: "smooth", block: "start" });
  burstConfetti();
}

yesBtn.addEventListener("click", showSuccess);

// For desktop: dodge on hover; for mobile: dodge on touch
noBtn.addEventListener("mouseenter", () => {
  noCount++;
  updateHint();
  moveNoButton();
});
noBtn.addEventListener("click", () => {
  noCount++;
  updateHint();
  moveNoButton();
});

// -------- Confetti (no libraries) --------
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const rect = success.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * devicePixelRatio);
  canvas.height = Math.floor(rect.height * devicePixelRatio);
}
window.addEventListener("resize", resizeCanvas);

let confetti = [];
let animId = null;

function makePiece() {
  const w = canvas.width, h = canvas.height;
  const x = Math.random() * w;
  const y = -20 * devicePixelRatio;
  const r = (6 + Math.random() * 10) * devicePixelRatio;
  const vx = (-2 + Math.random() * 4) * devicePixelRatio;
  const vy = (3 + Math.random() * 6) * devicePixelRatio;
  const spin = (-0.2 + Math.random() * 0.4);
  const hue = Math.floor(330 + Math.random() * 40); // pink-ish range
  return { x, y, r, vx, vy, a: Math.random() * Math.PI, spin, hue };
}

function burstConfetti() {
  resizeCanvas();
  confetti = [];
  for (let i = 0; i < 160; i++) confetti.push(makePiece());
  if (animId) cancelAnimationFrame(animId);
  animate();
}

function animate() {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  for (const p of confetti) {
    p.x += p.vx;
    p.y += p.vy;
    p.a += p.spin;

    // gravity + drift
    p.vy += 0.06 * devicePixelRatio;
    p.vx *= 0.99;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.a);

    // confetti rectangles
    ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, 0.9)`;
    const rw = p.r * 1.3;
    const rh = p.r * 0.6;
    ctx.fillRect(-rw / 2, -rh / 2, rw, rh);
    ctx.restore();
  }

  // remove off-screen
  confetti = confetti.filter(p => p.y < h + 60 * devicePixelRatio);

  if (confetti.length > 0) {
    animId = requestAnimationFrame(animate);
  } else {
    ctx.clearRect(0, 0, w, h);
    animId = null;
  }
}

confettiBtn.addEventListener("click", burstConfetti);
