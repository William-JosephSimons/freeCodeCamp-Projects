const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const resultsText = document.getElementById("results-div");

const inputValidation = () => {
  const input = document.getElementById("user-input");

  if (!input.value) {
    alert("Please provide a phone number");
    return;
  }

  const phoneRegex = /^(1)?[- ]?(?:\d{3}|\(\d{3}\))[- ]?\d{3}[- ]?\d{4}$/;

  resultsText.innerText = phoneRegex.test(input.value)
    ? `Valid US number: ${input.value}`
    : `Invalid US number: ${input.value}`;
};

checkBtn.addEventListener("click", inputValidation);
clearBtn.addEventListener("click", () => (resultsText.textContent = ""));
