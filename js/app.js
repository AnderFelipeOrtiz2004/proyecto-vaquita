const pet = document.getElementById("pet");
const phone = document.querySelector(".phone");
const noteTime = document.getElementById("note-time");
const noteHello = document.getElementById("note-hello");
const noteText = document.getElementById("note-text");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const NOTES = {
  morning: {
    hello: "buenos días",
    lines: [
      "Hoy es un buen día para empezar algo increíble.",
      "Que tu mañana esté llena de calma y sonrisas.",
      "Hoy es un lienzo en blanco. Haz de él una obra maestra.",
      "Que tu café esté caliente y tu ánimo aún más.",
      "Cada amanecer es una nueva oportunidad.",
      "Despierta y sonríe, el mundo te espera.",
      "Que este día te regale mil razones para sonreír.",
      "Sonríe, algo bonito puede estar por llegar.",
      "Un nuevo día comienza… hazlo especial.",
      "Que tu café sea dulce y tu día aún más bonito.",
      "Empieza el día agradeciendo y termina sonriendo.",
      "Despierta con ilusión, cada amanecer es nuevo.",
      "Hoy es un nuevo capítulo. Escribe algo increíble.",
      "Que el sol de hoy ilumine tu camino.",
      "Despierta con una sonrisa y afronta el día con alegría.",
      "Hoy huele a café y a posibilidades.",
    ],
  },
  afternoon: {
    hello: "buenas tardes",
    lines: [
      "Que la alegría y la tranquilidad te acompañen.",
      "Confía en ti y disfruta cada momento.",
      "Que nada apague tu entusiasmo.",
      "Espero que hoy encuentres razones para sonreír.",
      "Que cada paso te acerque a tus sueños.",
      "Hoy puede convertirse en un gran día.",
      "Empieza creyendo en ti. Todo será más sencillo.",
      "Que este día esté lleno de oportunidades.",
      "Disfruta de cada pequeño momento.",
      "Que tu tarde te traiga calma y sonrisas.",
    ],
  },
  dawn: {
    hello: "buenos días",
    lines: [
      "El cielo se pinta de naranja. Empieza despacio.",
      "La madrugada es suave. Respira y sonríe.",
      "Un nuevo día se asoma, cálido y quieto.",
      "Que este amanecer te encuentre en calma.",
    ],
  },
  dusk: {
    hello: "buenas tardes",
    lines: [
      "El sol se va de naranja. Afloja el día.",
      "Que el atardecer te deje el corazón ligero.",
      "La tarde se apaga despacio. Todo está bien.",
      "Mira el cielo: hoy también se pone bonito.",
    ],
  },
  night: {
    hello: "buenas noches",
    lines: [
      "Que las estrellas guíen tus sueños.",
      "Que el silencio de la noche te dé calma.",
      "Cada noche es una pausa para renacer.",
      "Cierra los ojos con gratitud.",
      "Que descanses. Mañana será un gran día.",
      "Que la luna te arrulle con su magia.",
      "Dulces sueños. Hasta mañana.",
      "Que la noche te envuelva en calma.",
      "Que tus sueños sean bonitos y el descanso suave.",
      "Cierra los ojos, respira y suelta el día.",
    ],
  },
};

function dayNumber(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

function periodFor(date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 7) {
    return "dawn";
  }
  if (hour >= 17 && hour < 19) {
    return "dusk";
  }
  if (hour >= 19 || hour < 5) {
    return "night";
  }
  if (hour >= 12) {
    return "afternoon";
  }
  return "morning";
}

function pickLine(list, date) {
  return list[dayNumber(date) % list.length];
}

function syncScene() {
  const now = new Date();
  const period = periodFor(now);
  const pack = NOTES[period];
  const night = period === "night";
  const dusk = period === "dawn" || period === "dusk";

  phone.classList.toggle("is-night", night);
  phone.classList.toggle("is-dusk", dusk);
  if (themeMeta) {
    themeMeta.setAttribute("content", night ? "#1c2436" : dusk ? "#e08a4c" : "#7fb36a");
  }
  noteTime.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  noteHello.textContent = pack.hello;
  noteText.textContent = pickLine(pack.lines, now);
  renderMail();
  maybeShowGift();
  updateRest();
}

const FRAMES = [
  "sprites/frame-1.png",
  "sprites/frame-2.png",
  "sprites/frame-3.png",
];
const BLINK_SLEEPY = "sprites/sleep-blink.png";
const DREAM = [
  "sprites/dream-00.png",
  "sprites/dream-01.png",
  "sprites/dream-02.png",
];
const LOVE = [
  "sprites/love-00.png",
  "sprites/love-01.png",
  "sprites/love-02.png",
  "sprites/love-03.png",
  "sprites/love-04.png",
  "sprites/love-05.png",
  "sprites/love-06.png",
];
const DIRTY = {
  idle: "sprites/dirty-1.png",
  blink: "sprites/dirty-2.png",
  nod: "sprites/dirty-3.png",
  dream: [
    "sprites/dirty-dream-00.png",
    "sprites/dirty-dream-01.png",
    "sprites/dirty-dream-02.png",
  ],
  love: [
    "sprites/dirty-love-00.png",
    "sprites/dirty-love-01.png",
    "sprites/dirty-love-02.png",
    "sprites/dirty-love-03.png",
    "sprites/dirty-love-04.png",
  ],
  back: "sprites/dirty-back.png",
};
const TICK_MS = 5 * 60 * 1000;

const needs = {
  thirst: {
    frames: 23,
    key: "vani-thirst",
    label: "Sed",
    btn: document.getElementById("drink-btn"),
    icon: document.getElementById("drink-icon"),
    src: (level) => `sprites/drink-${String(level).padStart(2, "0")}.png`,
  },
  hunger: {
    frames: 22,
    key: "vani-hunger",
    label: "Hambre",
    btn: document.getElementById("food-btn"),
    icon: document.getElementById("food-icon"),
    src: (level) => `sprites/food-${String(level).padStart(2, "0")}.png`,
  },
  clean: {
    frames: 20,
    key: "vani-clean",
    label: "Baño",
    btn: document.getElementById("bath-btn"),
    icon: document.getElementById("bath-icon"),
    src: (level) => `sprites/sponge-${String(level).padStart(2, "0")}.png`,
  },
  bored: {
    frames: 23,
    key: "vani-bored",
    label: "Aburrimiento",
    btn: document.getElementById("play-btn"),
    icon: document.getElementById("play-icon"),
    src: (level) => `sprites/game-${String(level).padStart(2, "0")}.png?v=75`,
  },
};

const BACK = "sprites/back.png";

[...FRAMES, BLINK_SLEEPY, ...DREAM, ...LOVE, DIRTY.idle, DIRTY.blink, DIRTY.nod, ...DIRTY.dream, ...DIRTY.love, DIRTY.back, BACK].forEach((src) => {
  const img = new Image();
  img.src = src;
});

function isDirty() {
  const state = loadNeed(needs.clean);
  return state.level >= Math.ceil((needs.clean.frames - 1) / 2);
}

function look(kind) {
  if (isDirty()) {
    if (kind === "blink" || kind === "sleepy") {
      return DIRTY.blink;
    }
    if (kind === "nod") {
      return DIRTY.nod;
    }
    return DIRTY.idle;
  }
  if (kind === "blink") {
    return FRAMES[1];
  }
  if (kind === "sleepy") {
    return BLINK_SLEEPY;
  }
  if (kind === "nod") {
    return FRAMES[2];
  }
  return FRAMES[0];
}

function applyLook(kind) {
  pet.src = look(kind || "idle");
}

Object.values(needs).forEach((need) => {
  for (let i = 0; i < need.frames; i += 1) {
    const img = new Image();
    img.src = need.src(i);
  }
});

function show(index) {
  if (asleep) {
    return;
  }
  if (index === 1) {
    applyLook("blink");
    return;
  }
  if (index === 2) {
    applyLook("nod");
    return;
  }
  applyLook("idle");
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

let acting = false;
let asleep = false;
let napping = false;
let petting = false;
let dreamTimer = 0;
let dreamDelay = 0;
let dreamIndex = 0;

function boredState() {
  return loadNeed(needs.bored);
}

function isBored() {
  return boredState().level >= Math.ceil((needs.bored.frames - 1) / 2);
}

function easeBoredom(amount) {
  const state = loadNeed(needs.bored);
  if (state.level <= 0) {
    renderNeed(needs.bored, state.level);
    return 0;
  }
  const before = state.level;
  state.level = Math.max(0, state.level - amount);
  saveNeed(needs.bored, state);
  renderNeed(needs.bored, state.level);
  const gained = before - state.level;
  if (gained > 0) {
    spawnPopup(needs.bored.btn, `+${gained}`);
  }
  return gained;
}

function isNightNow() {
  return periodFor(new Date()) === "night";
}

const NAP_MS = 30 * 1000;
let lastInteract = Date.now();

function markAwake(force) {
  if (asleep && isBored() && !force) {
    return;
  }
  lastInteract = Date.now();
  if (asleep && !petting) {
    stopDream();
  }
}

function shouldSleep() {
  return Date.now() - lastInteract >= NAP_MS || isBored();
}

function idleMs() {
  return Date.now() - lastInteract;
}

function isDrowsy() {
  if (asleep || shouldSleep()) {
    return false;
  }
  const hour = new Date().getHours();
  return idleMs() >= 15000 || boredState().level >= 6 || hour === 18;
}

async function caress() {
  if (petting || (asleep && isBored())) {
    return;
  }
  petting = true;
  markAwake();
  if (asleep) {
    window.clearTimeout(dreamDelay);
    window.clearInterval(dreamTimer);
    dreamDelay = 0;
    dreamTimer = 0;
    asleep = false;
  }
  acting = true;
  const hearts = isDirty() ? DIRTY.love : LOVE;
  for (const src of hearts) {
    pet.src = src;
    await wait(220);
  }
  petting = false;
  acting = false;
  if (!asleep) {
    applyLook("idle");
  }
}

function startDream() {
  if (asleep || petting) {
    return;
  }
  asleep = true;
  acting = true;
  dreamIndex = 0;
  const sequence = [0, 1, 2, 1];
  const dreams = isDirty() ? DIRTY.dream : DREAM;
  const tick = () => {
    if (petting || !asleep) {
      return;
    }
    pet.src = dreams[sequence[dreamIndex % sequence.length]];
    dreamIndex += 1;
  };
  applyLook("sleepy");
  dreamDelay = window.setTimeout(() => {
    dreamDelay = 0;
    if (!asleep || petting) {
      return;
    }
    tick();
    dreamTimer = window.setInterval(tick, 1300);
  }, 500);
}

function stopDream() {
  if (dreamDelay) {
    window.clearTimeout(dreamDelay);
    dreamDelay = 0;
  }
  if (dreamTimer) {
    window.clearInterval(dreamTimer);
    dreamTimer = 0;
  }
  asleep = false;
  acting = false;
  dreamIndex = 0;
  applyLook("idle");
}

function updateRest() {
  if (petting || playing) {
    return;
  }
  if (shouldSleep()) {
    startDream();
    return;
  }
  if (asleep) {
    stopDream();
  }
}

async function blink() {
  if (asleep || petting) {
    return;
  }
  applyLook(isDrowsy() ? "sleepy" : "blink");
  await wait(isDrowsy() ? 460 : 240);
  if (!asleep && !petting) {
    applyLook("idle");
  }
}

async function nod() {
  if (asleep || petting) {
    return;
  }
  show(2);
  await wait(isDrowsy() ? 780 : 580);
  if (!asleep && !petting) {
    show(0);
  }
}

async function act(kind) {
  if (acting || asleep || petting || playing) {
    return;
  }
  acting = true;
  if (kind === "nod") {
    await nod();
  } else {
    await blink();
  }
  if (!asleep && !petting) {
    show(0);
  }
  acting = false;
}

function scheduleIdleMove() {
  const drowsy = isDrowsy();
  const waitMs = drowsy ? 2800 + Math.random() * 2800 : 5200 + Math.random() * 4800;
  window.setTimeout(async () => {
    if (!asleep && !petting && !playing) {
      await act(Math.random() < (drowsy ? 0.5 : 0.38) ? "nod" : "blink");
    }
    scheduleIdleMove();
  }, waitMs);
}

function migrateBoredom() {
  if (localStorage.getItem("vani-bored")) {
    return;
  }
  try {
    const old = JSON.parse(localStorage.getItem("vani-sleep") || "null");
    if (!old || typeof old.level !== "number") {
      return;
    }
    const mapped = Math.min(22, Math.round((old.level / 11) * 22));
    localStorage.setItem(
      "vani-bored",
      JSON.stringify({
        level: mapped,
        lastTick: typeof old.lastTick === "number" ? old.lastTick : Date.now(),
      }),
    );
  } catch {
    /* ignore leftover sleep meter */
  }
}

migrateBoredom();

function loadNeed(need) {
  const now = Date.now();
  let data;
  try {
    data = JSON.parse(localStorage.getItem(need.key) || "null");
  } catch {
    data = null;
  }

  if (!data || typeof data.lastTick !== "number") {
    data = { level: 0, lastTick: now };
  }

  const steps = Math.max(0, Math.floor((now - data.lastTick) / TICK_MS));
  const level = Math.min(need.frames - 1, (data.level || 0) + steps);
  const lastTick = data.lastTick + steps * TICK_MS;
  const next = { level, lastTick };
  localStorage.setItem(need.key, JSON.stringify(next));
  return next;
}

function saveNeed(need, state) {
  localStorage.setItem(need.key, JSON.stringify(state));
}

function renderNeed(need, level) {
  need.icon.src = need.src(level);
  const filled = need.frames - 1 - level;
  if (need === needs.bored) {
    const extra = playing ? "Cerrar juego" : "Juego";
    need.btn.setAttribute("aria-label", `${extra}, ${need.label} ${filled} de ${need.frames - 1}`);
    return;
  }
  need.btn.setAttribute("aria-label", `${need.label} ${filled} de ${need.frames - 1}`);
}

function syncNeeds() {
  let nextWait = TICK_MS;
  Object.values(needs).forEach((need) => {
    const state = loadNeed(need);
    renderNeed(need, state.level);
    nextWait = Math.min(nextWait, Math.max(1000, TICK_MS - (Date.now() - state.lastTick)));
  });
  if (!asleep && !petting && !acting && !playing) {
    applyLook("idle");
  }
  window.setTimeout(syncNeeds, nextWait);
}

const DROP_VER = "58";
const DROP_FOOD = Array.from({ length: 21 }, (_, i) => `sprites/drop-${String(i).padStart(2, "0")}.png?v=${DROP_VER}`);
const DROP_DRINK = [
  `sprites/drop-21.png?v=${DROP_VER}`,
  `sprites/drop-22.png?v=${DROP_VER}`,
  `sprites/drop-23.png?v=${DROP_VER}`,
  `sprites/drop-24.png?v=${DROP_VER}`,
];

[...DROP_FOOD, ...DROP_DRINK].forEach((src) => {
  const img = new Image();
  img.src = src;
});

function spawnPopup(button, text, extraClass) {
  const plus = document.createElement("span");
  plus.className = extraClass ? `plus-one ${extraClass}` : "plus-one";
  plus.textContent = text;
  const phoneBox = phone.getBoundingClientRect();
  const btnBox = button.getBoundingClientRect();
  plus.style.left = `${btnBox.left - phoneBox.left + btnBox.width / 2}px`;
  plus.style.top = `${btnBox.top - phoneBox.top}px`;
  phone.appendChild(plus);
  plus.addEventListener("animationend", () => plus.remove());
}

function spawnPlusAtPet(text) {
  const plus = document.createElement("span");
  plus.className = "plus-one";
  plus.textContent = text;
  const phoneBox = phone.getBoundingClientRect();
  const petBox = pet.getBoundingClientRect();
  plus.style.left = `${petBox.left - phoneBox.left + petBox.width / 2}px`;
  plus.style.top = `${petBox.top - phoneBox.top + petBox.height * 0.18}px`;
  phone.appendChild(plus);
  plus.addEventListener("animationend", () => plus.remove());
}

function dropTreat(need) {
  const state = loadNeed(need);
  if (state.level <= 0) {
    spawnPopup(need.btn, "MAX!", "plus-max");
    return;
  }

  const pack = need === needs.thirst ? DROP_DRINK : DROP_FOOD;
  const item = document.createElement("img");
  item.className = "drop-item";
  item.src = pack[Math.floor(Math.random() * pack.length)];
  item.alt = "";
  item.draggable = false;

  const phoneBox = phone.getBoundingClientRect();
  const petBox = pet.getBoundingClientRect();
  const signBox = document.querySelector(".sign-board").getBoundingClientRect();
  const startX = petBox.left - phoneBox.left + petBox.width * (0.24 + Math.random() * 0.42) - 26;
  const startY = signBox.bottom - phoneBox.top + 14;
  const fall = Math.max(80, petBox.top - phoneBox.top + petBox.height * 0.28 - startY);
  item.style.left = `${startX}px`;
  item.style.top = `${startY}px`;
  item.style.setProperty("--fall", `${fall}px`);
  phone.appendChild(item);

  let done = false;
  const finish = () => {
    if (done) {
      return;
    }
    done = true;
    item.remove();
    const now = loadNeed(need);
    if (now.level <= 0) {
      return;
    }
    now.level -= 1;
    saveNeed(need, now);
    renderNeed(need, now.level);
    spawnPlusAtPet("+1");
    markAwake();
    if (!asleep && !petting) {
      applyLook("idle");
    }
    act("nod");
  };

  item.addEventListener("animationend", (event) => {
    if (event.animationName === "drop-treat") {
      finish();
    }
  });
  window.setTimeout(finish, 1250);

  window.requestAnimationFrame(() => {
    item.classList.add("is-play");
  });
}

function feed(need) {
  const state = loadNeed(need);
  if (state.level <= 0) {
    spawnPopup(need.btn, "MAX!", "plus-max");
    return;
  }
  state.level -= 1;
  saveNeed(need, state);
  renderNeed(need, state.level);
  spawnPopup(need.btn, "+1");
  markAwake();
  if (!asleep && !petting) {
    applyLook("idle");
  }
  act("nod");
}

const playBtn = document.getElementById("play-btn");
const ballEl = document.getElementById("ball");
const playScoreEl = document.getElementById("play-score");
const playBestEl = document.getElementById("play-best");
const BALL_BEST_KEY = "vani-ball-best";
const BALL_SIZE = 118;
const BALL_R = 55;
const BALL_STEP = 15;

const ballPic = new Image();
ballPic.src = "sprites/ball.png";

let playing = false;
const PLAY_FILL_MS = 3000;
let playFillTimer = 0;
let playRaf = 0;
let playScore = 0;
let playBest = Number(localStorage.getItem(BALL_BEST_KEY) || 0) || 0;
let airborne = false;
let fallen = false;
let heading = false;
let facingBack = false;
let faceHold = 0;
let missTimer = 0;
const ball = { x: 180, y: 160, vx: 0, vy: 0 };

function ballTier() {
  return Math.min(6, Math.floor(playScore / BALL_STEP));
}

function ballGrav() {
  return 0.15 + ballTier() * 0.08;
}

function ballHit() {
  return -7.2 - ballTier() * 1.7;
}

function renderPlayScore() {
  playScoreEl.textContent = String(playScore);
  playBestEl.textContent = `mejor ${playBest}`;
}

function playBounds() {
  const phoneBox = phone.getBoundingClientRect();
  const menuBox = document.querySelector(".menu").getBoundingClientRect();
  return {
    left: BALL_R + 6,
    right: phoneBox.width - BALL_R - 6,
    top: 16,
    floor: menuBox.top - phoneBox.top - 8,
  };
}

function headPoint() {
  const phoneBox = phone.getBoundingClientRect();
  const petBox = pet.getBoundingClientRect();
  return {
    x: petBox.left - phoneBox.left + petBox.width * 0.5,
    y: petBox.top - phoneBox.top + petBox.height * 0.18,
  };
}

function sitOnHead() {
  const head = headPoint();
  ball.x = head.x;
  ball.y = head.y - BALL_R + 14;
  ball.vx = 0;
  ball.vy = 0;
}

function playLook(kind) {
  if (facingBack) {
    pet.src = isDirty() ? DIRTY.back : BACK;
    return;
  }
  applyLook(kind || "idle");
}

function pickFacing() {
  if (faceHold > 0) {
    faceHold -= 1;
    return;
  }
  facingBack = !facingBack;
  faceHold = Math.random() < 0.4 ? 1 : 0;
}

function placeBall() {
  ballEl.style.left = `${ball.x - BALL_SIZE / 2}px`;
  ballEl.style.top = `${ball.y - BALL_SIZE / 2}px`;
}

function spawnPlusAtBall() {
  const plus = document.createElement("span");
  plus.className = "plus-one plus-score";
  plus.textContent = "+1";
  plus.style.left = `${ball.x}px`;
  plus.style.top = `${ball.y - 36}px`;
  phone.appendChild(plus);
  plus.addEventListener("animationend", () => plus.remove());
}

function saveBest() {
  if (playScore > playBest) {
    playBest = playScore;
    localStorage.setItem(BALL_BEST_KEY, String(playBest));
  }
}

function ballCanHead() {
  if (fallen) {
    return false;
  }
  if (!airborne) {
    return true;
  }
  const head = headPoint();
  const box = playBounds();
  if (ball.y + BALL_R >= box.floor - 6) {
    return false;
  }
  const coming = ball.vy >= -5;
  const reach = ball.y + BALL_R >= head.y - 170 && ball.y - BALL_R <= head.y + 90;
  return coming && reach;
}

async function headBall() {
  if (!playing || fallen || heading || !ballCanHead()) {
    return;
  }
  heading = true;
  markAwake(true);
  pickFacing();
  pet.classList.remove("is-head");
  void pet.offsetWidth;
  pet.classList.add("is-head");
  playLook("nod");
  const head = headPoint();
  airborne = true;
  ball.x = head.x;
  ball.y = head.y - BALL_R - 2;
  ball.vx = 0;
  ball.vy = ballHit();
  playScore += 1;
  saveBest();
  renderPlayScore();
  spawnPlusAtBall();
  await wait(120);
  pet.classList.remove("is-head");
  if (playing && !fallen && !petting) {
    playLook("idle");
  }
  heading = false;
}

function missBall() {
  if (fallen) {
    return;
  }
  fallen = true;
  airborne = false;
  ball.vx = 0;
  ball.vy = 0;
  saveBest();
  renderPlayScore();
  facingBack = false;
  faceHold = 0;
  pet.classList.remove("is-head");
  applyLook("idle");
  window.clearTimeout(missTimer);
  missTimer = window.setTimeout(() => {
    ballEl.classList.add("is-gone");
    missTimer = window.setTimeout(() => {
      stopPlay();
    }, 400);
  }, 2200);
}

function stepBall() {
  if (!playing) {
    return;
  }
  if (fallen) {
    placeBall();
    playRaf = window.requestAnimationFrame(stepBall);
    return;
  }
  if (!airborne) {
    sitOnHead();
    placeBall();
    playRaf = window.requestAnimationFrame(stepBall);
    return;
  }

  const box = playBounds();
  const head = headPoint();
  ball.vy += ballGrav();
  ball.vx = 0;
  ball.x = head.x;
  ball.y += ball.vy;

  if (ball.y < box.top + BALL_R) {
    ball.y = box.top + BALL_R;
    ball.vy = Math.abs(ball.vy) * 0.2;
  }

  if (ball.y + BALL_R >= box.floor) {
    ball.y = box.floor - BALL_R;
    missBall();
  }

  placeBall();
  playRaf = window.requestAnimationFrame(stepBall);
}

function startPlayFill() {
  window.clearInterval(playFillTimer);
  playFillTimer = window.setInterval(() => {
    if (playing && !fallen) {
      easeBoredom(1);
    }
  }, PLAY_FILL_MS);
}

function startPlay() {
  playing = true;
  playScore = 0;
  airborne = false;
  fallen = false;
  heading = false;
  facingBack = false;
  faceHold = 1;
  window.clearTimeout(missTimer);
  missTimer = 0;
  phone.classList.add("is-play");
  hideInstallToast(false);
  ballEl.classList.remove("hidden", "is-gone");
  renderPlayScore();
  sitOnHead();
  placeBall();
  markAwake(true);
  stopDream();
  renderNeed(needs.bored, boredState().level);
  pet.classList.remove("is-head");
  applyLook("idle");
  if (playRaf) {
    window.cancelAnimationFrame(playRaf);
  }
  playRaf = window.requestAnimationFrame(stepBall);
  startPlayFill();
  maybeShowGift();
}

function stopPlay() {
  playing = false;
  airborne = false;
  fallen = false;
  heading = false;
  facingBack = false;
  faceHold = 0;
  window.clearTimeout(missTimer);
  missTimer = 0;
  window.clearInterval(playFillTimer);
  playFillTimer = 0;
  phone.classList.remove("is-play");
  pet.classList.remove("is-head");
  ballEl.classList.add("hidden");
  ballEl.classList.remove("is-gone");
  if (playRaf) {
    window.cancelAnimationFrame(playRaf);
    playRaf = 0;
  }
  markAwake(true);
  renderNeed(needs.bored, boredState().level);
  if (!asleep && !petting) {
    applyLook("idle");
  }
}

const mailBtn = document.getElementById("mail-btn");
const mailIcon = document.getElementById("mail-icon");
const letterOverlay = document.getElementById("letter-overlay");
const letterAnim = document.getElementById("letter-anim");
const letterCard = document.getElementById("letter-card");
const letterKicker = document.getElementById("letter-kicker");
const letterTitle = document.getElementById("letter-title");
const letterBody = document.getElementById("letter-body");
const MAIL_KEY = "vani-mail";
const MAIL_VER = "77";
const MAIL = {
  closed: `sprites/mail-00.png?v=${MAIL_VER}`,
  unread: `sprites/mail-01.png?v=${MAIL_VER}`,
  heart: `sprites/mail-02.png?v=${MAIL_VER}`,
  letter: `sprites/mail-03.png?v=${MAIL_VER}`,
  paper: `sprites/mail-04.png?v=${MAIL_VER}`,
  empty: `sprites/mail-05.png?v=${MAIL_VER}`,
};

const MAIL_NOTES = [
  { title: "Buenos días", text: "Despierta despacio. Hoy no tienes que apurarte para merecer cariño: ya lo tienes." },
  { title: "Para ti", text: "Si el día se pone pesado, acuérdate de que hay alguien que se alegra solo de que existas." },
  { title: "Un rato", text: "No hace falta arreglar el mundo hoy. Basta con tomarte un vaso de agua y un respiro." },
  { title: "Cerca", text: "Aunque no esté al lado, te pienso. Eso también es una forma de quedarse." },
  { title: "Suave", text: "Que hoy te trate suave el café, el sol y las personas. Tú ya eres suficiente." },
  { title: "Contigo", text: "Me gusta cómo hablas, cómo te enojas y cómo vuelves. Contigo todo se siente más vivo." },
  { title: "Ánimo", text: "Si hoy no sale perfecto, igual cuenta. Estar aquí ya es un logro bonito." },
  { title: "Mimo", text: "Date el mismo mimo que le darías a alguien que quieres. Hoy te toca a ti." },
  { title: "Calma", text: "No tienes que responderle a todo el mundo. Primero respira. Luego decides." },
  { title: "Bonita", text: "Hay días en los que te ves cansada y aun así se te sale lo bonita. Hoy puede ser uno." },
  { title: "Te veo", text: "Veo cuando haces el esfuerzo aunque nadie aplauda. Yo sí me doy cuenta." },
  { title: "Abrigo", text: "Si te da frío por dentro, ven. Hay un lugar en mí que se llama tu nombre." },
  { title: "Paciencia", text: "No todo se resuelve hoy. Algunas cosas solo piden que no te abandones." },
  { title: "Risa", text: "Ojalá se te escape una risa tonta. De esas que te arreglan un poco la cara." },
  { title: "Cariño", text: "Te quiero en lo fácil y en lo difícil. No es un trato: es una decisión." },
  { title: "Hoy", text: "Hoy puede ser un día corto y igual ser bueno. No le pidas tanto. Pídele paz." },
  { title: "Escucha", text: "Si quieres hablar de más, habla. A mí no me cansas. Me gusta oírte." },
  { title: "Fuerte", text: "No tienes que ser fuerte todo el rato. A veces ser honesta ya es valiente." },
  { title: "Casa", text: "Hay personas que se sienten como casa. Tú eres una de esas, aunque estés lejos." },
  { title: "Luz", text: "Aunque el cielo esté nublado, tú tienes una luz rara. No dejes que te la apaguen." },
  { title: "Gracias", text: "Gracias por quedarte, por escribir, por no irte cuando las cosas se ponen feas." },
  { title: "Despacio", text: "Anda despacio. El día no se gana corriendo. Se gana llegando entera." },
  { title: "Mimo dos", text: "Si nadie te pregunta cómo estás, yo lo hago: ¿cómo está tu corazón hoy?" },
  { title: "Junto", text: "No prometo que todo salga bien. Prometo no dejarte sola con lo que salga." },
  { title: "Flor", text: "Eres de las personas que florecen aunque el suelo esté seco. Eso me da fe." },
  { title: "Noche", text: "Si se te hace larga la noche, deja la luz baja y recuérdate que amanece." },
  { title: "Tierno", text: "Hoy te mando un cariño tonto: de esos que no arreglan nada y aun así sirven." },
  { title: "Voz", text: "Tu voz me acomoda el día. Aunque sea un audio corto, me deja más liviano." },
  { title: "Perdón", text: "Si alguna vez te fallé, que hoy te llegue al menos esto: quiero hacerlo mejor." },
  { title: "Elegirte", text: "No te elijo solo cuando estás dulce. Te elijo también cuando estás hecha un lío." },
  { title: "Paz", text: "Que te sobre un poco de paz. Aunque sea cinco minutos sin pelearte contigo." },
  { title: "Sol", text: "Si sale el sol, tómalo. Si no sale, enciende una luz y sigue igual." },
  { title: "Cuento", text: "Cuéntame lo que sea. Lo grande, lo tonto, lo que no le cuentas a nadie." },
  { title: "Manta", text: "Hoy te mando una manta imaginaria. Tápate. El mundo puede esperar un rato." },
  { title: "Valiente", text: "Levantarte ya fue valiente. Lo demás, si se puede, se va acomodando." },
  { title: "Dulce", text: "Ojalá te toque algo dulce: un mensaje, un sabor, o solo un pensamiento amable." },
  { title: "Raíz", text: "Hay días en que no creces hacia arriba. Creces hacia adentro. Eso también vale." },
  { title: "Mía", text: "No para poseerte: para cuidarte. Esa es la única forma en que me gusta decirlo." },
  { title: "Silencio", text: "Si no quieres hablar, también está bien. Me quedo cerca en silencio." },
  { title: "Brillo", text: "No tienes que brillar para que te quieran. Te quiero apagada, cansada y real." },
  { title: "Paso", text: "Un paso chiquito sigue siendo un paso. Hoy no te exijas una carrera." },
  { title: "Tesoro", text: "Eres de las conversaciones que uno guarda. De las que no se tiran." },
  { title: "Aire", text: "Abre la ventana un segundo. A veces el aire nuevo acomoda la cabeza." },
  { title: "Promesa", text: "No te prometo un cuento perfecto. Te prometo que voy a intentar estar." },
  { title: "Raro", text: "Me gusta lo raro tuyo. Lo que a otros les estorba, a mí me parece tú." },
  { title: "Abrazo", text: "Esto es un abrazo en texto. Torpe, sí. Pero va en serio." },
  { title: "Mañana", text: "Si hoy no se pudo, mañana existe. Y yo también." },
  { title: "Cielo", text: "Mira un segundo el cielo. A veces eso basta para recordar que no estás atrapada." },
  { title: "Lista", text: "No tienes que tener todo listo. Puedes estar a medias y aun así ser querida." },
  { title: "Canción", text: "Ojalá te suene una canción que te acomode el pecho. Si no, tararea una tonta." },
  { title: "Firme", text: "Puedes temblar y ser firme a la vez. Las dos cosas caben en ti." },
  { title: "Detalle", text: "Hoy fíjate en un detalle bonito: una sombra, un olor, una frase. Quédate con eso." },
  { title: "Compañía", text: "No vengo a arreglarte. Vengo a acompañarte. A veces eso es más honesto." },
  { title: "Risa dos", text: "Si se te olvida cómo se ríe, empieza con una sonrisa chiquita. El resto llega." },
  { title: "Cuidado", text: "Cuídate como si fueras alguien que quieres mucho. Porque lo eres." },
  { title: "Siempre", text: "Siempre es una palabra grande. Aun así, quiero usarla contigo con cuidado." },
  { title: "Tarde", text: "Si llegas tarde a tu propia vida, no pasa nada. Siéntate. Aún hay asiento." },
  { title: "Beso", text: "Un beso en la frente, de esos que no piden nada. Solo que estés bien." },
  { title: "Nudo", text: "Si tienes un nudo en la garganta, no lo tragues solo. Yo puedo oírlo." },
  { title: "Juego", text: "Hoy te permito ser un poco niña: caprichosa, cansada, consentida. Está bien." },
  { title: "Verdad", text: "La verdad es que me haces falta hasta en los días en que no hablamos tanto." },
  { title: "Suerte", text: "Que te toque una suerte chiquita: un semáforo en verde, un mensaje a tiempo." },
  { title: "Piel", text: "Ojalá el día te roce suave, como alguien que no quiere lastimarte." },
  { title: "Recuerdo", text: "Me acuerdo de ti en lo cotidiano: en un chiste, en una calle, en un silencio." },
  { title: "Fuego", text: "Tienes un fuego propio. No dejes que te lo expliquen como si fuera un defecto." },
  { title: "Agua", text: "Toma agua. Come algo. Eso también es quererse. Lo demás puede esperar un poco." },
  { title: "Nube", text: "Si hoy eres nube, está bien. No todas las horas tienen que ser cielo despejado." },
  { title: "Manita", text: "Te doy la mano aunque no la veas. Apriétala cuando se te olvide que no estás sola." },
  { title: "Orgullo", text: "Estoy orgulloso de ti por cosas que ni siquiera publicas. Sobre todo por esas." },
  { title: "Tregua", text: "Haz una tregua con tu cabeza. Cinco minutos sin juzgarte. Luego sigues." },
  { title: "Destino", text: "No sé si el destino existe. Sé que yo te elijo cuando puedo elegir." },
  { title: "Bolsillo", text: "Guarda este mensaje en el bolsillo del día. Por si más tarde se te pierde el ánimo." },
  { title: "Olas", text: "Los días vienen en olas. Esta también baja. Aguanta la respiración un poco." },
  { title: "Miel", text: "Que te toque algo con sabor a miel: una palabra, un plato, un rato sin prisa." },
  { title: "Espejo", text: "Si el espejo está pesado hoy, no le creas todo. El cansancio miente." },
  { title: "Vuelo", text: "No tienes que volar alto. Puedes quedarte cerca del suelo y aun así ser libre." },
  { title: "Señal", text: "Si necesitabas una señal para ser un poco más amable contigo: esta es." },
  { title: "Rincón", text: "Hay un rincón de mi día que es solo tuyo. Aunque no lo veas, está ocupado." },
  { title: "Lluvia", text: "Si llueve por fuera o por dentro, yo traigo techo. Métete un rato." },
  { title: "Ganas", text: "Si no te dan ganas de nada, no te castigues. A veces el cuerpo pide pausa." },
  { title: "Estrella", text: "Eres de las personas que uno señala en silencio: esa. Esa me importa." },
  { title: "Camino", text: "No tienes que saber el camino completo. Con el siguiente paso alcanza." },
  { title: "Dulzura", text: "Tu dulzura no es debilidad. Es una forma rara de ser valiente." },
  { title: "Hilo", text: "Aunque el hilo se tense, no lo suelto. Prefiero acomodarlo a perderte." },
  { title: "Mesa", text: "Siempre hay un plato para ti en mi mesa. Aunque sea un plato de palabras." },
  { title: "Alivio", text: "Ojalá hoy se te quite un peso chiquito. Uno solo. Eso ya cambia la cara." },
  { title: "Canción dos", text: "Si pudieras oírme, te cantaría desafinado. De puro cariño, no de talento." },
  { title: "Puerta", text: "Mi puerta no se cierra cuando estás difícil. Se cierra cuando dejo de intentarlo, y no quiero eso." },
  { title: "Brisa", text: "Que te toque una brisa buena: un mensaje, una calle vacía, un minuto tuyo." },
  { title: "Nombre", text: "Tu nombre me acomoda la boca. Por eso lo digo bonito, aunque sea en una nota." },
  { title: "Cansancio", text: "El cansancio no te hace menos querible. Te hace humana. Ven, descansa un poco." },
  { title: "Isla", text: "Si el día es isla, yo soy bote. No siempre llego rápido, pero voy." },
  { title: "Tinta", text: "Escribo esto para que no se te olvide: importas. Incluso en los días grises." },
  { title: "Hueco", text: "Hay un hueco a tu forma en mis horas. Cuando no estás, se nota." },
  { title: "Permiso", text: "Te doy permiso de no estar bien hoy. Y de que yo te quiera igual." },
  { title: "Semilla", text: "Lo que haces hoy, aunque no se vea, es semilla. Algún día se nota." },
  { title: "Cielo dos", text: "No todos los cielos son azules. Algunos son grises y aun así son cielo." },
  { title: "Lazo", text: "Estamos atados por cosas simples: hablar de más, reír a destiempo, quedarnos." },
  { title: "Mimo tres", text: "Hoy no te pido nada. Solo que te trates como te trato yo cuando te extraño." },
  { title: "Ventana", text: "Deja una ventana abierta por si entra algo bueno. A veces llega sin avisar." },
  { title: "Corazón", text: "Tu corazón hace ruido bonito. Aunque a veces te duela, sigue siendo un buen lugar." },
  { title: "Tarde dos", text: "Si la tarde se te cae, siéntate conmigo un rato. Luego la recogemos." },
  { title: "Brújula", text: "Cuando te pierdas, vuelve a lo simple: agua, comida, un mensaje, un poquito de fe." },
  { title: "Nido", text: "Quiero ser nido, no jaula. Un lugar al que llegas, no un lugar que te encierra." },
  { title: "Suerte dos", text: "Que hoy te salga una cosa chiquita bien. Una sola. Y que te dé gusto." },
  { title: "Eco", text: "Si nadie te responde como mereces, aquí hay eco. Tus palabras no se caen al vacío." },
  { title: "Marea", text: "Hoy puedes ser marea baja. No tienes que llenar toda la playa." },
  { title: "Lámpara", text: "Si se te apaga el ánimo, yo traigo una lámpara chica. No ilumina todo, pero alcanza." },
  { title: "Cariño dos", text: "Te quiero con tus berrinches, tus silencios y tus mensajes a destiempo." },
  { title: "Paso dos", text: "Si hoy solo pudiste dar un paso, eso es noticia buena. El resto es extra." },
  { title: "Hogar", text: "Hogar no es un cuarto. A veces es una persona que te contesta. Hola." },
  { title: "Risa tres", text: "Guarda una risa para más tarde. Por si el día se pone serio de más." },
  { title: "Farol", text: "Si caminas de noche, mira el farol más cercano. Luego el siguiente. Así se llega." },
  { title: "Tierno dos", text: "Hoy te escribo tierno a propósito. Porque a veces lo tierno es lo más honesto." },
  { title: "Vuelta", text: "Puedes irte un rato a tu cabeza y volver. Yo no corro la silla." },
  { title: "Música", text: "Que el día te ponga una música que no te apure. Algo para andar despacio." },
  { title: "Sombra", text: "Hasta tu sombra me parece compañía. Imagínate tú." },
  { title: "Pan", text: "Come algo caliente si puedes. El cuerpo también entiende el cariño." },
  { title: "Carta", text: "Esta no es una carta perfecta. Es una carta que llegó. A veces eso basta." },
  { title: "Más", text: "Quiero más días contigo. Más charlas. Más perdones. Más de esto que somos." },
];

const BIRTHDAY = "09-07";
const MAIL_SPECIAL_DAYS = {
  [BIRTHDAY]: {
    title: "Para Vania",
    text: "Feliz cumpleaños, Vania.\n\nYa van 7 años y yo voy por más. Te quiero mucho.\n\nMe gusta hablar demasiado contigo. Me quedo horas y no me cansas. Contigo se me sale todo.\n\nPerdón por las veces que te hice llorar y por las que te enojé. En serio lo siento.\n\nY para tus berrinches también estoy. No me voy porque un día estés de malgenio o triste.\n\nAlgún día nos vamos a ver en persona. Yo sé que sí. Y ojalá sigamos jugando más juegos, como ahora, rato y rato.\n\nGracias por aguantarme. Feliz cumple.",
    sign: true,
  },
};

let mailOpen = false;
let mailBusy = false;

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function monthDay(date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function specialNote(date) {
  if (isBirthday(date)) {
    return MAIL_SPECIAL_DAYS[BIRTHDAY];
  }
  return MAIL_SPECIAL_DAYS[monthDay(date)] || null;
}

function dailyNote(date) {
  return MAIL_NOTES[dayNumber(date) % MAIL_NOTES.length];
}

function loadMail() {
  const today = dateKey(new Date());
  let data;
  try {
    data = JSON.parse(localStorage.getItem(MAIL_KEY) || "null");
  } catch {
    data = null;
  }
  if (!data || data.day !== today) {
    data = { day: today, read: false };
    localStorage.setItem(MAIL_KEY, JSON.stringify(data));
  }
  return data;
}

function saveMail(data) {
  localStorage.setItem(MAIL_KEY, JSON.stringify(data));
}

function mailIconSrc(data) {
  if (specialNote(new Date())) {
    return MAIL.heart;
  }
  if (!data.read) {
    return MAIL.unread;
  }
  return MAIL.empty;
}

function renderMail() {
  const data = loadMail();
  mailIcon.src = mailIconSrc(data);
  const special = Boolean(specialNote(new Date()));
  mailBtn.setAttribute(
    "aria-label",
    data.read ? "Carta del día, leída" : special ? "Carta especial" : "Carta nueva",
  );
}

const HEART_SRC = [0, 1, 2, 3, 4].map((i) => `sprites/heart-${String(i).padStart(2, "0")}.png?v=79`);
let heartTimer = 0;
let heartTick = 0;

function paintLetterHearts() {
  document.querySelectorAll(".letter-heart").forEach((img, index) => {
    img.src = HEART_SRC[(heartTick + index) % HEART_SRC.length];
  });
}

function startLetterHearts() {
  window.clearInterval(heartTimer);
  heartTick = 0;
  paintLetterHearts();
  heartTimer = window.setInterval(() => {
    heartTick += 1;
    paintLetterHearts();
  }, 1000);
}

function stopLetterHearts() {
  window.clearInterval(heartTimer);
  heartTimer = 0;
}

function fillLetter(date, forcedSpecial) {
  const special = forcedSpecial || specialNote(date);
  const note = special || dailyNote(date);
  letterKicker.textContent = special ? "Día especial" : "Nota del día";
  letterTitle.textContent = note.title;
  letterBody.textContent = note.text;
  letterCard.classList.toggle("is-long", Boolean(special));
  const showSign = Boolean(special && special.sign);
  document.getElementById("letter-sign").classList.toggle("hidden", !showSign);
  document.getElementById("letter-expire").classList.toggle("hidden", !showSign);
  if (showSign) {
    startLetterHearts();
  } else {
    stopLetterHearts();
  }
}

function loadLetterImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("no se pudo cargar la imagen"));
    img.src = src;
  });
}

function wrapCanvasText(ctx, text, maxWidth) {
  const lines = [];
  String(text)
    .split("\n")
    .forEach((para) => {
      const words = para.trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        return;
      }
      let line = words[0];
      for (let i = 1; i < words.length; i += 1) {
        const next = `${line} ${words[i]}`;
        if (ctx.measureText(next).width <= maxWidth) {
          line = next;
        } else {
          lines.push(line);
          line = words[i];
        }
      }
      lines.push(line);
    });
  return lines;
}

async function renderLetterBlob() {
  if (document.fonts && document.fonts.load) {
    await Promise.all([
      document.fonts.load('700 25px "Pixelify Sans"'),
      document.fonts.load('400 32px "Pixelify Sans"'),
    ]);
    await document.fonts.ready;
  }

  const signed = !document.getElementById("letter-sign").classList.contains("hidden");
  const showExpire = !document.getElementById("letter-expire").classList.contains("hidden");
  const kicker = letterKicker.textContent;
  const title = letterTitle.textContent;
  const body = letterBody.textContent;
  const scale = 2;
  const cardW = 280 * scale;
  const padX = 16 * scale;
  const padTop = 22 * scale;
  const padBottom = 18 * scale;
  const innerW = cardW - padX * 2;
  const kickerSize = Math.round(12.5 * scale);
  const titleSize = Math.round(18.4 * scale);
  const bodySize = 16 * scale;
  const expireSize = Math.round(12.5 * scale);
  const kickerH = Math.round(kickerSize * 1.3);
  const titleH = Math.round(titleSize * 1.2);
  const bodyH = Math.round(bodySize * 1.35);
  const expireH = Math.round(expireSize * 1.3);
  const measure = document.createElement("canvas").getContext("2d");
  measure.font = `700 ${titleSize}px "Pixelify Sans"`;
  const titleLines = wrapCanvasText(measure, title, innerW);
  measure.font = `400 ${bodySize}px "Pixelify Sans"`;
  const bodyLines = wrapCanvasText(measure, body, innerW);
  measure.font = `400 ${expireSize}px "Pixelify Sans"`;
  const expireLines = showExpire
    ? wrapCanvasText(measure, "Esta carta se borra a la medianoche.", innerW)
    : [];

  let y = padTop + kickerH + 6 * scale + titleLines.length * titleH + 10 * scale + bodyLines.length * bodyH;
  if (signed) {
    y += 18 * scale + 22 * scale;
  }
  if (showExpire) {
    y += 12 * scale + expireLines.length * expireH;
  }
  y += padBottom;

  const margin = 28;
  const shadowX = 6 * scale;
  const shadowY = 8 * scale;
  const canvas = document.createElement("canvas");
  canvas.width = cardW + margin * 2 + shadowX;
  canvas.height = y + margin * 2 + shadowY;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = "#d7e6c4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const ox = margin;
  const oy = margin;
  ctx.fillStyle = "rgba(36, 24, 16, 0.28)";
  ctx.fillRect(ox + shadowX, oy + shadowY, cardW, y);
  ctx.fillStyle = "#3d2118";
  ctx.fillRect(ox - 3 * scale, oy - 3 * scale, cardW + 6 * scale, y + 6 * scale);
  ctx.fillStyle = "#efe4c8";
  ctx.fillRect(ox, oy, cardW, y);

  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, oy, cardW, y);
  ctx.clip();
  ctx.fillStyle = "rgba(74, 46, 24, 0.08)";
  const lineGap = 22 * scale;
  for (let lineY = oy + lineGap; lineY < oy + y; lineY += lineGap) {
    ctx.fillRect(ox, lineY, cardW, scale);
  }
  ctx.restore();

  let stamp = null;
  try {
    stamp = await loadLetterImage(MAIL.letter);
  } catch {
    stamp = null;
  }
  if (stamp) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(stamp, ox + cardW - padX - 36 * scale, oy + 10 * scale, 32 * scale, 32 * scale);
  }

  let cursor = oy + padTop;
  ctx.textBaseline = "top";
  ctx.fillStyle = "#8a5a12";
  ctx.font = `700 ${kickerSize}px "Pixelify Sans"`;
  ctx.fillText(kicker, ox + padX, cursor);
  cursor += kickerH + 6 * scale;

  ctx.fillStyle = "#3d2a18";
  ctx.font = `700 ${titleSize}px "Pixelify Sans"`;
  titleLines.forEach((line) => {
    ctx.fillText(line, ox + padX, cursor);
    cursor += titleH;
  });
  cursor += 10 * scale;

  ctx.font = `400 ${bodySize}px "Pixelify Sans"`;
  bodyLines.forEach((line) => {
    ctx.fillText(line, ox + padX, cursor);
    cursor += bodyH;
  });

  if (signed) {
    cursor += 18 * scale;
    const heartSize = 22 * scale;
    const hearts = [...document.querySelectorAll(".letter-heart")];
    for (let i = 0; i < hearts.length; i += 1) {
      try {
        const heart = await loadLetterImage(hearts[i].src || HEART_SRC[i % HEART_SRC.length]);
        ctx.drawImage(heart, ox + padX + i * (heartSize + 2 * scale), cursor, heartSize, heartSize);
      } catch {
        // keep the letter even if a heart sprite fails
      }
    }
    ctx.font = `700 ${bodySize}px "Pixelify Sans"`;
    ctx.textAlign = "right";
    ctx.fillText("Felipe.O", ox + cardW - padX, cursor + 4 * scale);
    ctx.textAlign = "left";
    cursor += heartSize;
  }

  if (showExpire) {
    cursor += 12 * scale;
    ctx.fillStyle = "#8a5a12";
    ctx.font = `400 ${expireSize}px "Pixelify Sans"`;
    ctx.textAlign = "center";
    expireLines.forEach((line) => {
      ctx.fillText(line, ox + cardW / 2, cursor);
      cursor += expireH;
    });
    ctx.textAlign = "left";
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("no se pudo crear la imagen"));
      }
    }, "image/png");
  });
}

function letterFileName() {
  const title = letterTitle.textContent
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return `vani-${title || "nota"}-${dateKey(new Date())}.png`;
}

async function saveLetterImage() {
  const btn = document.getElementById("letter-save");
  if (!btn || btn.disabled) {
    return;
  }
  const old = btn.textContent;
  btn.disabled = true;
  btn.textContent = "...";
  try {
    const blob = await renderLetterBlob();
    const name = letterFileName();
    const file = new File([blob], name, { type: "image/png" });
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (iOS && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: letterTitle.textContent,
        text: "Carta de Vani",
      });
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
    btn.textContent = "listo";
    await wait(800);
  } catch (err) {
    if (!err || err.name !== "AbortError") {
      btn.textContent = "error";
      await wait(800);
    }
  } finally {
    btn.textContent = old;
    btn.disabled = false;
  }
}

async function playMailRead() {
  const frames = [MAIL.letter, MAIL.paper, MAIL.empty];
  for (const src of frames) {
    mailIcon.src = src;
    letterAnim.src = src;
    await wait(260);
  }
}

async function openMail(opts) {
  if (playing || mailOpen || mailBusy) {
    return;
  }
  mailBusy = true;
  mailOpen = true;
  hideInstallToast(false);
  const date = new Date();
  const data = loadMail();
  fillLetter(date, opts && opts.birthday ? MAIL_SPECIAL_DAYS[BIRTHDAY] : null);
  letterCard.classList.add("hidden");
  letterAnim.classList.remove("hidden");
  letterAnim.src = data.read ? MAIL.empty : mailIconSrc(data);
  letterOverlay.classList.remove("hidden");
  if (!data.read) {
    await playMailRead();
    data.read = true;
    saveMail(data);
  } else {
    letterAnim.src = MAIL.empty;
  }
  letterAnim.classList.add("hidden");
  letterCard.classList.remove("hidden");
  renderMail();
  mailBusy = false;
}

function closeMail() {
  if (mailBusy) {
    return;
  }
  mailOpen = false;
  stopLetterHearts();
  letterOverlay.classList.add("hidden");
  letterCard.classList.add("hidden");
  renderMail();
}

const giftBtn = document.getElementById("gift-btn");

function isBirthday(date) {
  const day = monthDay(date);
  return day === BIRTHDAY || day === "09-06";
}

function maybeShowGift() {
  const now = new Date();
  giftBtn.classList.toggle("hidden", playing || !isBirthday(now));
  if (mailOpen && !specialNote(now)) {
    closeMail();
  }
}

async function openGift() {
  if (playing || mailOpen || mailBusy) {
    return;
  }
  await openMail({ birthday: true });
}

document.getElementById("gift-btn").addEventListener("pointerdown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  openGift();
});

mailBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  openMail();
});

letterOverlay.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
  if (event.target === letterOverlay) {
    closeMail();
  }
});

document.getElementById("letter-save").addEventListener("click", (event) => {
  event.stopPropagation();
  saveLetterImage();
});

document.getElementById("letter-close").addEventListener("click", (event) => {
  event.stopPropagation();
  closeMail();
});

needs.thirst.btn.addEventListener("click", () => {
  if (!playing) {
    dropTreat(needs.thirst);
  }
});
needs.hunger.btn.addEventListener("click", () => {
  if (!playing) {
    dropTreat(needs.hunger);
  }
});
needs.clean.btn.addEventListener("click", () => {
  if (!playing) {
    feed(needs.clean);
  }
});

playBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (playing) {
    stopPlay();
    return;
  }
  startPlay();
});

pet.addEventListener("click", () => {
  if (!playing && !mailOpen) {
    caress();
  }
});

phone.addEventListener("pointerdown", (event) => {
  markAwake();
  if (!playing || fallen || mailOpen || event.target.closest(".menu, .mail-stack, .letter-overlay")) {
    return;
  }
  headBall();
});

renderPlayScore();

if (isNightNow()) {
  lastInteract = Date.now() - NAP_MS;
}

show(0);
scheduleIdleMove();
syncNeeds();
syncScene();
window.setInterval(syncScene, 15 * 1000);
window.setInterval(updateRest, 1000);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const INSTALL_KEY = "vani-install-hide";
const installToast = document.getElementById("install-toast");
const installBtn = document.getElementById("install-btn");
const installText = document.getElementById("install-text");
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches || Boolean(window.navigator.standalone);
let installEvent = null;

function hideInstallToast(save) {
  installToast.classList.add("hidden");
  if (save) {
    localStorage.setItem(INSTALL_KEY, "1");
  }
}

function showInstallToast() {
  if (isStandalone || localStorage.getItem(INSTALL_KEY) || playing || mailOpen) {
    return;
  }
  if (isIos) {
    installText.textContent = "En iPhone: toca Compartir y luego Añadir a pantalla de inicio.";
    installBtn.textContent = "listo";
  }
  installToast.classList.remove("hidden");
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installEvent = event;
  showInstallToast();
});

installBtn.addEventListener("click", async () => {
  if (installEvent) {
    installEvent.prompt();
    await installEvent.userChoice.catch(() => {});
    installEvent = null;
  }
  hideInstallToast(true);
});

document.getElementById("install-close").addEventListener("click", () => {
  hideInstallToast(true);
});

if (isIos && !isStandalone && !localStorage.getItem(INSTALL_KEY)) {
  window.setTimeout(showInstallToast, 1200);
}
