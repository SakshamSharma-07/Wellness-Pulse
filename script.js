// ==========================================================================
// CONFIG
// ==========================================================================
// Point this at your running FastAPI backend.
const API_URL = "https://wellness-pulse.onrender.com/predict";

// The score scale your model was trained on (Mental_Health_Model.pkl).
// Change this single number if your model outputs on a different range.
const MAX_SCORE = 10;

// ==========================================================================
// STATE
// ==========================================================================
const state = {
  age: null,
  gender: null,
  country: null,
  academic_level: null,
  most_used_platform: null,
  purpose_of_use: null,
  avg_daily_usage_hours: 4,
  daily_unlocks: null,
  study_hours: 3,
  physical_activity_hours: 1,
  sleep_hours_per_night: 7,
  stress_level: null,
};

let currentStep = 1;
const TOTAL_STEPS = 3;

// ==========================================================================
// ELEMENT REFS
// ==========================================================================
const form = document.getElementById("predictForm");
const steps = Array.from(document.querySelectorAll(".step"));
const progressFill = document.getElementById("progressFill");
const progressLabels = Array.from(document.querySelectorAll(".progress__label"));
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const fieldError = document.getElementById("fieldError");

const hero = document.getElementById("hero");
const resultSection = document.getElementById("result");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");
const restartBtn = document.getElementById("restartBtn");

const scoreNumberEl = document.getElementById("scoreNumber");
const bandLabelEl = document.getElementById("bandLabel");
const dialReadout = document.getElementById("dialReadout");
const dialSvg = document.getElementById("dialSvg");
const dialNeedle = document.getElementById("dialNeedle");
const chipsEl = document.getElementById("chips");
const resultIntro = document.getElementById("resultIntro");

// ==========================================================================
// PILL GROUPS
// ==========================================================================
document.querySelectorAll(".pillgroup").forEach((group) => {
  const field = group.dataset.field;
  group.querySelectorAll(".pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      group.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-selected"));
      pill.classList.add("is-selected");
      state[field] = pill.dataset.value;
      group.classList.remove("is-invalid");
      fieldError.textContent = "";
    });
  });
});

// ==========================================================================
// SLIDERS (live value readouts)
// ==========================================================================
function bindSlider(inputId, valueId, stateKey) {
  const input = document.getElementById(inputId);
  const valueEl = document.getElementById(valueId);
  input.addEventListener("input", () => {
    valueEl.textContent = parseFloat(input.value).toFixed(1);
    state[stateKey] = parseFloat(input.value);
  });
  state[stateKey] = parseFloat(input.value);
}
bindSlider("usageHours", "usageHoursValue", "avg_daily_usage_hours");
bindSlider("studyHours", "studyHoursValue", "study_hours");
bindSlider("activityHours", "activityHoursValue", "physical_activity_hours");
bindSlider("sleepHours", "sleepHoursValue", "sleep_hours_per_night");

// ==========================================================================
// PLAIN INPUTS
// ==========================================================================
document.getElementById("age").addEventListener("input", (e) => {
  state.age = e.target.value === "" ? null : parseInt(e.target.value, 10);
});
document.getElementById("country").addEventListener("input", (e) => {
  state.country = e.target.value.trim() || null;
});
document.getElementById("unlocks").addEventListener("input", (e) => {
  state.daily_unlocks = e.target.value === "" ? null : parseInt(e.target.value, 10);
});
document.getElementById("platform").addEventListener("change", (e) => {
  state.most_used_platform = e.target.value || null;
});

// ==========================================================================
// STEP VALIDATION
// ==========================================================================
function validateStep(step) {
  fieldError.textContent = "";
  const missing = [];

  if (step === 1) {
    if (state.age === null || isNaN(state.age) || state.age < 0 || state.age > 100) missing.push("age");
    if (!state.country) missing.push("country");
    if (!state.gender) missing.push("gender");
    if (!state.academic_level) missing.push("academic level");
  }
  if (step === 2) {
    if (!state.most_used_platform) missing.push("platform");
    if (!state.purpose_of_use) missing.push("purpose of use");
    if (state.daily_unlocks === null || isNaN(state.daily_unlocks) || state.daily_unlocks < 0) missing.push("daily unlocks");
  }
  if (step === 3) {
    if (!state.stress_level) missing.push("stress level");
  }

  if (missing.length > 0) {
    fieldError.textContent = `Please fill in: ${missing.join(", ")}.`;
    // visually flag empty pill groups
    document.querySelectorAll(`.step[data-step="${step}"] .pillgroup`).forEach((group) => {
      if (!state[group.dataset.field]) group.classList.add("is-invalid");
    });
    return false;
  }
  return true;
}

// ==========================================================================
// STEP NAVIGATION
// ==========================================================================
function goToStep(n) {
  currentStep = n;
  steps.forEach((s) => s.classList.toggle("is-active", parseInt(s.dataset.step, 10) === n));
  progressLabels.forEach((label) => {
    const step = parseInt(label.dataset.step, 10);
    label.classList.toggle("is-active", step === n);
    label.classList.toggle("is-done", step < n);
  });
  progressFill.style.width = `${((n - 1) / (TOTAL_STEPS - 1)) * 100}%`;

  backBtn.disabled = n === 1;
  nextBtn.classList.toggle("hidden", n === TOTAL_STEPS);
  submitBtn.classList.toggle("hidden", n !== TOTAL_STEPS);
  fieldError.textContent = "";
}

nextBtn.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;
  if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
});

backBtn.addEventListener("click", () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

// ==========================================================================
// GAUGE / DIAL RENDERING
// ==========================================================================
const DIAL_CX = 150;
const DIAL_CY = 170;
const DIAL_R = 130;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function scoreToAngle(score) {
  const clamped = Math.max(0, Math.min(MAX_SCORE, score));
  return 180 - (clamped / MAX_SCORE) * 180;
}

function buildDial() {
  const bandsGroup = document.getElementById("dialBands");
  const ticksGroup = document.getElementById("dialTicks");

  const bounds = [0, MAX_SCORE * 0.4, MAX_SCORE * 0.7, MAX_SCORE];
  const classes = ["dial__band band--coral", "dial__band band--amber", "dial__band band--teal"];
  const colors = ["#E2665A", "#E8A33D", "#4FA89B"];

  let bandsSVG = "";
  for (let i = 0; i < 3; i++) {
    const startAngle = scoreToAngle(bounds[i]);
    const endAngle = scoreToAngle(bounds[i + 1]);
    bandsSVG += `<path class="dial__band" d="${describeArc(DIAL_CX, DIAL_CY, DIAL_R, startAngle, endAngle)}" stroke="${colors[i]}"></path>`;
  }
  bandsGroup.innerHTML = bandsSVG;

  let ticksSVG = "";
  for (let v = 0; v <= MAX_SCORE; v += MAX_SCORE / 4) {
    const angle = scoreToAngle(v);
    const outer = polarToCartesian(DIAL_CX, DIAL_CY, DIAL_R + 12, angle);
    const inner = polarToCartesian(DIAL_CX, DIAL_CY, DIAL_R + 2, angle);
    const label = polarToCartesian(DIAL_CX, DIAL_CY, DIAL_R + 26, angle);
    ticksSVG += `<line class="dial__tick" x1="${inner.x}" y1="${inner.y}" x2="${outer.x}" y2="${outer.y}"></line>`;
    ticksSVG += `<text class="dial__tick-label" x="${label.x}" y="${label.y + 3}">${v}</text>`;
  }
  ticksGroup.innerHTML = ticksSVG;
}
buildDial();

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateDialTo(score) {
  dialSvg.classList.remove("is-idle");
  dialSvg.classList.add("is-result");

  const startAngle = 180; // idle / zero position
  const targetAngle = scoreToAngle(score);
  const duration = 1100;
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = easeOutCubic(t);

    const currentAngle = startAngle + (targetAngle - startAngle) * eased;
    const tip = polarToCartesian(DIAL_CX, DIAL_CY, DIAL_R - 22, currentAngle);
    dialNeedle.setAttribute("x2", tip.x);
    dialNeedle.setAttribute("y2", tip.y);

    const currentScore = score * eased;
    scoreNumberEl.textContent = currentScore.toFixed(1);

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      scoreNumberEl.textContent = score.toFixed(1);
      dialReadout.classList.add("is-visible");
      revealBand(score);
    }
  }
  requestAnimationFrame(frame);
}

function revealBand(score) {
  const ratio = score / MAX_SCORE;
  let label, cls;
  if (ratio < 0.4) {
    label = "Needs attention";
    cls = "band--attention";
  } else if (ratio < 0.7) {
    label = "Balanced";
    cls = "band--balanced";
  } else {
    label = "Thriving";
    cls = "band--thriving";
  }
  bandLabelEl.textContent = label;
  bandLabelEl.classList.remove("band--attention", "band--balanced", "band--thriving");
  bandLabelEl.classList.add(cls);
  bandLabelEl.classList.add("is-visible");
}

// ==========================================================================
// RESULT DETAIL (chips + intro copy)
// ==========================================================================
function renderResultDetail() {
  resultIntro.textContent =
    "The estimate above is shaped mainly by the figures you shared below. Small changes to sleep, activity, or stress tend to move it the most.";

  const chips = [
    { label: "Sleep / night", value: `${state.sleep_hours_per_night.toFixed(1)} hrs` },
    { label: "Screen time / day", value: `${state.avg_daily_usage_hours.toFixed(1)} hrs` },
    { label: "Physical activity", value: `${state.physical_activity_hours.toFixed(1)} hrs` },
    { label: "Stress level", value: state.stress_level },
  ];

  chipsEl.innerHTML = chips
    .map(
      (c) => `
      <div class="chip">
        <div class="chip__label">${c.label}</div>
        <div class="chip__value">${c.value}</div>
      </div>`
    )
    .join("");
}

// ==========================================================================
// SUBMIT
// ==========================================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateStep(3)) return;

  submitBtn.classList.add("is-loading");
  submitBtn.disabled = true;
  backBtn.disabled = true;

  const payload = {
    age: state.age,
    gender: state.gender,
    country: state.country,
    academic_level: state.academic_level,
    most_used_platform: state.most_used_platform,
    purpose_of_use: state.purpose_of_use,
    avg_daily_usage_hours: state.avg_daily_usage_hours,
    daily_unlocks: state.daily_unlocks,
    study_hours: state.study_hours,
    physical_activity_hours: state.physical_activity_hours,
    sleep_hours_per_night: state.sleep_hours_per_night,
    stress_level: state.stress_level,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let detail = `The server responded with status ${response.status}.`;
      try {
        const body = await response.json();
        if (body.detail) detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
      } catch (_) {}
      throw new Error(detail);
    }

    const data = await response.json();
    showResult(data.predicted_score);
  } catch (err) {
    showError(
      err.message && err.message.includes("fetch")
        ? "Couldn't reach the prediction server. Make sure your FastAPI backend is running at " + API_URL + "."
        : err.message
    );
  } finally {
    submitBtn.classList.remove("is-loading");
    submitBtn.disabled = false;
  }
});

// ==========================================================================
// VIEW SWITCHING
// ==========================================================================
function showResult(score) {
  form.classList.add("hidden");
  document.getElementById("progress").classList.add("hidden");
  errorBox.classList.add("hidden");
  resultSection.classList.remove("hidden");

  hero.classList.add("is-result");
  renderResultDetail();
  animateDialTo(score);
}

function showError(message) {
  form.classList.add("hidden");
  document.getElementById("progress").classList.add("hidden");
  resultSection.classList.add("hidden");
  errorBox.classList.remove("hidden");
  errorMessage.textContent = message;
}

function resetAll() {
  hero.classList.remove("is-result");
  dialSvg.classList.remove("is-result");
  dialSvg.classList.add("is-idle");
  dialReadout.classList.remove("is-visible");
  bandLabelEl.classList.remove("is-visible", "band--attention", "band--balanced", "band--thriving");
  scoreNumberEl.textContent = "—";
  dialNeedle.setAttribute("x2", DIAL_CX - (DIAL_R - 22));
  dialNeedle.setAttribute("y2", DIAL_CY);

  resultSection.classList.add("hidden");
  errorBox.classList.add("hidden");
  form.classList.remove("hidden");
  document.getElementById("progress").classList.remove("hidden");

  goToStep(1);
}

retryBtn.addEventListener("click", () => {
  errorBox.classList.add("hidden");
  form.classList.remove("hidden");
  document.getElementById("progress").classList.remove("hidden");
  hero.classList.remove("is-result");
});

restartBtn.addEventListener("click", resetAll);

// ==========================================================================
// INIT
// ==========================================================================
dialSvg.classList.add("is-idle");
goToStep(1);
