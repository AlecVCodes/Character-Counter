//light and dark mode toggle DOM ELementes
const toggleButton = document.querySelector(".light-dark-toggle");
const logoDark = document.querySelector(
  'header > img[src="logo-dark-theme.svg"]'
);
const logoLight = document.querySelector(
  'header > img[src="logo-light-theme.svg"]'
);
const sunIcon = document.querySelector(
  '.light-dark-toggle > img[src="icon-sun.svg"]'
);
const moonIcon = document.querySelector(
  '.light-dark-toggle > img[src="icon-moon.svg"]'
);

// light & dark mode functionality.
function updateUITheme(isLightMode) {
  logoDark.style.display = isLightMode ? "none" : "block";
  logoLight.style.display = isLightMode ? "block" : "none";
  sunIcon.style.display = isLightMode ? "none" : "block";
  moonIcon.style.display = isLightMode ? "block" : "none";
}

let lightDarkModeToggle = () => {
  document.body.classList.toggle("light-mode");
  const isLightMode = document.body.classList.contains("light-mode");
  updateUITheme(isLightMode);
  localStorage.setItem("darkMode", !isLightMode);
};

const isDarkMode = localStorage.getItem("darkMode") === "true";
if (isDarkMode) document.body.classList.add("light-mode");
updateUITheme(document.body.classList.contains("light-mode"));

toggleButton.addEventListener("click", lightDarkModeToggle);

//

// Main content DOM elements.
const textAreaContent = document.querySelector(".textarea");
const characterCounter = document.querySelector(
  ".total-characters-card > .data-count"
);
const wordCounter = document.querySelector(".word-count-card > .data-count");
const sentencesCounter = document.querySelector(
  ".sentence-count-card > .data-count"
);

const checkboxContainer = document.querySelector(".info");
const excludeSpacesCheckbox = document.querySelector(
  "#exclude-spaces-checkbox"
);
const limitCharactersCheckbox = document.querySelector(
  "#character-limit-checkbox"
);
const limitedCharacterInput = document.querySelector(".character-limit-box");

let limitedCharacterMessage = document.createElement("p");
limitedCharacterMessage.classList.add("error-message");
//

const infoIcon = document.createElement("img");
infoIcon.src = "/icon-info.svg";
infoIcon.alt = "Info icon";
infoIcon.classList.add("info-icon");

function showCharacterErrorMessage(limit) {
  limitedCharacterMessage.textContent = `Limit reached! Your text exceeds ${limit} characters`;
  if (!limitedCharacterMessage.contains(infoIcon)) {
    limitedCharacterMessage.prepend(infoIcon);
  }
  checkboxContainer.before(limitedCharacterMessage);
  textAreaContent.classList.add("error");
}

function hideCharacterErrorMessage() {
  if (document.body.contains(limitedCharacterMessage)) {
    limitedCharacterMessage.remove();
  }
  textAreaContent.classList.remove("error");
}

function getCharacterLimit() {
  return limitedCharacterInput.value;
}

let letterArray = [];
let wordsArray = [];
let sentencesArray = [];

limitCharactersCheckbox.addEventListener("change", () => {
  limitedCharacterInput.style.display = limitCharactersCheckbox.checked
    ? "block"
    : "none";

  const currentLimit = getCharacterLimit();
  const currentLength = textAreaContent.value.length;

  if (
    limitCharactersCheckbox.checked &&
    currentLength > parseInt(currentLimit)
  ) {
    showCharacterErrorMessage(currentLimit);
  } else {
    hideCharacterErrorMessage();
  }
});

// focus event listenet for textArea
textAreaContent.addEventListener("focus", (e) => {
  const characterLimit = getCharacterLimit();
  const currentLength = e.target.value.length;

  if (!limitCharactersCheckbox.checked) {
    textAreaContent.classList.remove("error");
  }

  if (
    limitCharactersCheckbox.checked &&
    currentLength > parseInt(characterLimit)
  ) {
    showCharacterErrorMessage(characterLimit);
  }
});

//DOM Elements for letter section

const LetterDensityContainer = document.querySelector(".letters-container");

//input event listener for TextArea
textAreaContent.addEventListener("input", function (e) {
  const characterLimit = getCharacterLimit();
  const currentValue = e.target.value;
  const currentLength = currentValue.length;

  LetterDensityContainer.innerHTML = "";
  //check if there is only whitespace within textarea or if it is empty
  if (currentValue.trim() === "") {
    LetterDensityContainer.innerHTML =
      "<p>No Characters found. Start typing to see letter density.</p>";
  }

  let characterCounterNoSpaces = currentValue
    .trim()
    .split("")
    .filter((char) => char !== " ");
  characterCounter.textContent = excludeSpacesCheckbox.checked
    ? characterCounterNoSpaces.length
    : currentLength;

  if (
    limitCharactersCheckbox.checked &&
    currentLength > parseInt(characterLimit)
  ) {
    showCharacterErrorMessage(characterLimit);
  } else {
    hideCharacterErrorMessage();
  }

  wordsArray = currentValue.trim().split(/\s+/).filter(Boolean);
  wordCounter.textContent = wordsArray.length;
  sentencesArray = currentValue.trim().split(".").filter(Boolean);
  sentencesCounter.textContent = sentencesArray.length;

  if (currentLength === 0) {
    characterCounter.textContent = "00";
    wordCounter.textContent = "00";
    sentencesCounter.textContent = "00";
  }

  //Reset

  letterArray = currentValue
    .toUpperCase()
    .split("")
    .filter((char) => /[A-Z]/.test(char));

  let countLetters = {};
  for (let letter of letterArray) {
    countLetters[letter] = (countLetters[letter] || 0) + 1;
  }

  let letterData = [];

  for (const [key, value] of Object.entries(countLetters)) {
    const percentage = ((value / currentLength) * 100).toFixed(2);
    letterData.push({ key, percentage: parseFloat(percentage), value });
  }

  letterData.sort((a, b) => b.percentage - a.percentage);

  for (const { key, percentage, value } of letterData) {
    const item = document.createElement("div");
    item.classList.add("letter-density-item");

    const itemLetter = document.createElement("span");
    itemLetter.textContent = key;

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    const progressBarFilled = document.createElement("div");
    progressBarFilled.classList.add("progress-bar-filled");
    progressBarFilled.style.width = `${percentage}%`;

    const itemValue = document.createElement("span");
    itemValue.textContent = `${value}`;
    itemValue.classList.add("item-value");

    const itemPercentage = document.createElement("span");
    itemPercentage.textContent = `(${percentage})%`;

    progressBar.appendChild(progressBarFilled);
    item.appendChild(itemLetter);
    item.appendChild(progressBar);
    item.appendChild(itemValue);
    item.appendChild(itemPercentage);
    LetterDensityContainer.appendChild(item);
  }
});
