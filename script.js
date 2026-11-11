/* =========================================================
   Gabrielės kvietimas 💌
   Formspree endpointą įklijuok žemiau esančioje eilutėje.
   ========================================================= */
const FORMSPREE_ENDPOINT = ""; // pvz. "https://formspree.io/f/abcdwxyz"

const DATES = {
  "2026-11-28": {
    long: "2026 m. lapkričio 28 d., šeštadienis",
    short: "Lapkričio 28 d.",
  },
  "2026-11-29": {
    long: "2026 m. lapkričio 29 d., sekmadienis",
    short: "Lapkričio 29 d.",
  },
};

/* ---------- Būsenos ---------- */
let selectedDate = "";
let questionAnswered = false;

/* ---------- Elementai ---------- */
const envelope = document.getElementById("envelope");
const screens = document.querySelectorAll(".screen");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const noNote = document.getElementById("noNote");
const dateInputs = document.querySelectorAll('input[name="date"]');
const btnConfirm = document.getElementById("btnConfirm");
const doneText = document.getElementById("doneText");
const sendError = document.getElementById("sendError");

/* ---------- Ekranų perjungimas ---------- */
function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
}

/* ---------- Fonas: plaukiojančios širdelės ---------- */
function createFloatingHearts() {
  const layer = document.getElementById("hearts");
  const glyphs = ["♥", "♡", "❤"];
  const colors = ["#e84a7f", "#f48cb1", "#d64175", "#ff9fbe"];
  const count = 22;

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = glyphs[i % glyphs.length];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${10 + Math.random() * 22}px`;
    heart.style.color = colors[i % colors.length];
    heart.style.animationDuration = `${14 + Math.random() * 16}s`;
    heart.style.animationDelay = `-${Math.random() * 28}s`;
    heart.style.setProperty("--o", (0.1 + Math.random() * 0.28).toFixed(2));
    layer.appendChild(heart);
  }
}

/* ---------- Konfeti / širdelių lietus ---------- */
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
const palette = ["#e84a7f", "#f06a9b", "#ff8fb3", "#ffb3c9", "#d63b6f", "#ffd166", "#fff1f6"];
let particles = [];
let animating = false;
let lastFrame = 0;
let W = 0;
let H = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawHeart(context, size) {
  const s = size;
  context.beginPath();
  context.moveTo(0, s * 0.32);
  context.bezierCurveTo(0, 0.05 * s, -s * 0.5, 0.05 * s, -s * 0.5, 0.34 * s);
  context.bezierCurveTo(-s * 0.5, 0.66 * s, -s * 0.1, 0.84 * s, 0, s * 0.98);
  context.bezierCurveTo(s * 0.1, 0.84 * s, s * 0.5, 0.66 * s, s * 0.5, 0.34 * s);
  context.bezierCurveTo(s * 0.5, 0.05 * s, 0, 0.05 * s, 0, s * 0.32);
  context.closePath();
  context.fill();
}

function spawnBurst(amount = 150, originX = W / 2, originY = H * 0.55) {
  const heartCount = Math.round(amount * 0.6);

  for (let i = 0; i < amount; i += 1) {
    const isHeart = i < heartCount;
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;

    particles.push({
      x: originX + (Math.random() - 0.5) * 70,
      y: originY + (Math.random() - 0.5) * 50,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      gravity: 0.16 + Math.random() * 0.08,
      size: isHeart ? 10 + Math.random() * 14 : 6 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      color: palette[Math.floor(Math.random() * palette.length)],
      shape: isHeart ? "heart" : "confetti",
      life: 1,
      decay: 0.006 + Math.random() * 0.006,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.04,
    });
  }

  if (!animating) {
    animating = true;
    lastFrame = performance.now();
    requestAnimationFrame(tick);
  }
}

function tick(now) {
  const delta = Math.min(2.5, (now - lastFrame) / 16.67 || 1);
  lastFrame = now;
  ctx.clearRect(0, 0, W, H);

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.sway += p.swaySpeed * delta;
    p.x += (p.vx + Math.sin(p.sway) * 0.5) * delta;
    p.y += p.vy * delta;
    p.vy += p.gravity * delta;
    p.vx *= 0.995;
    p.rotation += p.rotationSpeed * delta;
    p.life -= p.decay * delta;

    if (p.life <= 0 || p.y > H + 80) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.min(1, p.life * 1.6);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;

    if (p.shape === "heart") {
      drawHeart(ctx, p.size);
    } else {
      ctx.fillRect(-p.size / 2, -p.size * 0.28, p.size, p.size * 0.56);
    }

    ctx.restore();
  }

  if (particles.length > 0) {
    requestAnimationFrame(tick);
  } else {
    animating = false;
    ctx.clearRect(0, 0, W, H);
  }
}

/* ---------- Voko atidarymas ---------- */
function openEnvelope() {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");

  const rect = envelope.getBoundingClientRect();
  spawnBurst(70, rect.left + rect.width / 2, rect.top + rect.height * 0.55);

  window.setTimeout(() => {
    showScreen("screen-question");
    questionReadyAt = performance.now() + 800;
  }, 1050);
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openEnvelope();
  }
});

/* ---------- „Ne“ mygtukas, kuris bėga ---------- */
const noTexts = [
  "Ne",
  "Tikrai ne?",
  "Pagalvok dar…",
  "Ne ne ne",
  "Nespėsi 😄",
  "Bėgu!",
  "Neįmanoma 🙈",
];

let dodges = 0;
let lastDodge = 0;
let noDodgeActive = false;
let questionReadyAt = 0;

function makeNoFixed() {
  const rect = btnNo.getBoundingClientRect();
  btnNo.style.left = `${rect.left}px`;
  btnNo.style.top = `${rect.top}px`;
  btnNo.classList.add("loose");
  noDodgeActive = true;
}

function dodgeNoButton() {
  const now = performance.now();
  if (now < questionReadyAt) return;
  if (now - lastDodge < 260) return;
  lastDodge = now;

  if (!noDodgeActive) makeNoFixed();

  dodges += 1;

  if (dodges >= 7) {
    btnNo.classList.add("gone");
    window.setTimeout(() => btnNo.remove(), 400);
    noNote.hidden = false;
    requestAnimationFrame(() => noNote.classList.add("show"));
    return;
  }

  btnNo.textContent = noTexts[Math.min(dodges, noTexts.length - 1)];

  const yesRect = btnYes.getBoundingClientRect();
  const width = btnNo.offsetWidth;
  const height = btnNo.offsetHeight;
  const pad = 14;
  const maxX = Math.max(pad, window.innerWidth - width - pad);
  const maxY = Math.max(pad, window.innerHeight - height - pad);
  const currentLeft = parseFloat(btnNo.style.left) || 0;
  const currentTop = parseFloat(btnNo.style.top) || 0;

  let x = pad;
  let y = pad;

  for (let attempt = 0; attempt < 24; attempt += 1) {
    x = pad + Math.random() * (maxX - pad);
    y = pad + Math.random() * (maxY - pad);

    const farEnough = Math.hypot(x - currentLeft, y - currentTop) > Math.min(190, window.innerWidth * 0.38);
    const overYes =
      x < yesRect.right + 16 &&
      x + width > yesRect.left - 16 &&
      y < yesRect.bottom + 16 &&
      y + height > yesRect.top - 16;

    if (farEnough && !overYes) break;
  }

  btnNo.style.left = `${x}px`;
  btnNo.style.top = `${y}px`;
  btnNo.style.transform = `rotate(${(Math.random() * 30 - 15).toFixed(1)}deg) scale(${Math.max(
    0.62,
    1 - dodges * 0.055
  ).toFixed(2)})`;

  btnYes.style.transform = `scale(${Math.min(1.16, 1 + dodges * 0.025)})`;
}

btnNo.addEventListener("pointerenter", dodgeNoButton);
btnNo.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  dodgeNoButton();
});
btnNo.addEventListener("click", (event) => {
  event.preventDefault();
  dodgeNoButton();
});
btnNo.addEventListener("focus", dodgeNoButton);

/* ---------- „Taip“ ---------- */
btnYes.addEventListener("click", () => {
  if (questionAnswered) return;
  questionAnswered = true;

  spawnBurst(190);
  btnYes.textContent = "Taip! 💖";

  window.setTimeout(() => {
    showScreen("screen-dates");
  }, 1150);
});

/* ---------- Datos pasirinkimas ---------- */
dateInputs.forEach((input) => {
  input.addEventListener("change", () => {
    selectedDate = input.value;
    btnConfirm.disabled = false;
  });
});

function sendChoice(dateKey) {
  if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes("XXXX")) {
    console.warn("Formspree endpointas dar nesukonfigūruotas (script.js).");
    return Promise.resolve({ ok: false, skipped: true });
  }

  const selected = DATES[dateKey];

  return fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `Gabrielė pasirinko ${selected ? selected.short : dateKey} 💗`,
      date_label: selected ? selected.long : dateKey,
      date_iso: dateKey,
      source: "Kvietimo svetainė",
      _gotcha: "",
    }),
  })
    .then((response) => ({ ok: response.ok, status: response.status }))
    .catch((error) => ({ ok: false, error }));
}

btnConfirm.addEventListener("click", async () => {
  if (!selectedDate || btnConfirm.disabled) return;

  const dateKey = selectedDate;
  btnConfirm.disabled = true;
  btnConfirm.textContent = "Siunčiama…";
  sendError.hidden = true;

  try {
    localStorage.setItem("gabriele-pasirinkta-data", dateKey);
  } catch (error) {
    /* localStorage gali būti išjungtas – tai netrukdo */
  }

  const result = await sendChoice(dateKey);
  const label = DATES[dateKey].short;

  doneText.textContent = `${label} jau pažymėta mano kalendoriuje.`;

  if (!result.ok) {
    sendError.textContent =
      "Nepavyko išsiųsti automatiškai 😔 Parašyk Kajui žinutę, kad pasirinkai šią dieną.";
    sendError.hidden = false;
  }

  showScreen("screen-done");
  window.setTimeout(() => spawnBurst(230), 120);
});

/* ---------- Inicializacija ---------- */
resizeCanvas();
createFloatingHearts();
window.addEventListener("resize", resizeCanvas);
