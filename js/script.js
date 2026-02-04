document.addEventListener("DOMContentLoaded", () => {
  const givenText = document.querySelector(".given-text");
  const textField = document.querySelector(".text-field");

  const RANDOM_QUOTE_API_URL =
    "https://api.freeapi.app/api/v1/public/quotes/quote/random";

  let ind = 0;
  let arr = [];

  let start = false;

  // get random quote from API
  async function getRandomQuote() {
    try {
      const response = await fetch(RANDOM_QUOTE_API_URL);

      if (!response.ok) throw new Error("Quote not found!");
      const result = await response.json();
      const text = result.data.content;
      renderQuote(text);
    } catch (error) {
      givenText.innerText = "Failed to load quote. Try refreshing.";
    }
  }

  // render quote to the screen
  function renderQuote(text) {
    givenText.innerHTML = "";
    arr = Array.from(text);
    ind = 0;
    textField.value = "";

    arr.forEach((char, index) => {
      const span = document.createElement("span");
      span.id = index;
      span.innerText = char;
      givenText.appendChild(span);
    });
  }

  // handle user input
  textField.addEventListener("keydown", (e) => {
    // start timer on first keypress
    if (!start && e.key.length === 1) {
      startTimer();
      start = true;
    }

    // Handle Backspace
    if (e.key === "Backspace") {
      if (ind > 0) {
        ind--;
        document.getElementById(ind).classList.remove("correct", "incorrect");
      }
      return;
    }

    // Ignore control keys
    if (e.key.length > 1) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
      }
      return;
    }

    // prevent typing if the quote is alreay finished
    if (ind >= arr.length) {
      e.preventDefault();
      return;
    }

    const span = document.getElementById(ind);

    // Comparison Logic
    if (e.key === arr[ind]) {
      span.classList.add("correct");
    } else {
      span.classList.add("incorrect");
    }

    ind++;

    if (ind === arr.length) {
      setTimeout(getRandomQuote, 400);
    }
  });

  // Global function to reset state when timer changes
  window.resetGameState = () => {
    start = false;
    getRandomQuote();
  };

  getRandomQuote();
});
