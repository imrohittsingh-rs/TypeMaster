const timerSelect = document.getElementById("timer");
const displayTimer = document.getElementById("display-timer");

const resultSection = document.getElementById("result-section");
const wpmVal = document.getElementById("wpm-val");
const accuracyVal = document.getElementById("accuracy-val");
const totalCorrectVal = document.getElementById("total-correct-val");
const totalIncorrectVal = document.getElementById("total-incorrect-val");
const retryBtn = document.getElementById("retry-btn");

let timeLeft; // time in seconds
let timerInterval = null;
let isRunning = false;

// Initialize time based on default select value
updateTimeFromSelect();

timerSelect.addEventListener("change", () => {
  resetTimer();
  updateTimeFromSelect();

  const textField = document.querySelector(".text-field");
  textField.value = "";
  textField.disabled = false;

  if (typeof resetGameState === "function") resetGameState();
});

// converting minutes to seconds (from selected option)
function updateTimeFromSelect() {
  const minutes = parseInt(timerSelect.value);
  timeLeft = minutes * 60;
  updateDisplay(timeLeft);
}

// display the timer
function updateDisplay(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  displayTimer.innerText = `Time: ${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// start timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay(timeLeft);
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// reset the game
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  resultSection.classList.remove("active");
}

// end game
function endGame() {
  clearInterval(timerInterval);
  isRunning = false;
  document.querySelector(".text-field").disabled = true;

  // Add the stats from the current (unfinished) quote to the totals
  const currentCorrect = document.querySelectorAll(".correct").length;
  const currentIncorrect = document.querySelectorAll(".incorrect").length;

  const finalCorrect = chars.correctChars + currentCorrect;
  const finalIncorrect = chars.incorrectChars + currentIncorrect;
  const totalTyped = finalCorrect + finalIncorrect;

  
  // WPM Formula: (total characters / 5) / time spent in minutes
  const totalTimeChosen = parseInt(timerSelect.value) * 60;
  const timeSpentSeconds = totalTimeChosen - timeLeft;
  const timeSpentMinutes = timeSpentSeconds / 60;
  
  const wpm =
  timeSpentMinutes > 0 ? Math.round(totalTyped / 5 / timeSpentMinutes) : 0;
  const accuracy =
  totalTyped > 0 ? Math.round((finalCorrect / totalTyped) * 100) : 0;
  
  wpmVal.innerText = wpm;
  accuracyVal.innerText = accuracy;
  totalCorrectVal.innerText = finalCorrect;
  totalIncorrectVal.innerText = finalIncorrect;
  
  resultSection.classList.add("active");
}

function resetTextColors() {
  const chars = document.querySelectorAll(".given-text span");
  chars.forEach((char) => {
    char.classList.remove("correct", "incorrect");
  });
}

retryBtn.addEventListener("click", () => location.reload());
