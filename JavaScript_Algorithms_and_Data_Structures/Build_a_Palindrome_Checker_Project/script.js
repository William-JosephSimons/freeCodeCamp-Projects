const submitButton = document.getElementById("check-btn");
const textInput = document.getElementById("text-input");
const resultText = document.getElementById("result");

const validateInput = (input) => {
  if (!input) {
    alert("Please input a value");
    return false;
  }

  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const processResult = () => {
  const input = textInput.value;
  const validInput = validateInput(input);
  if (!validInput) {
    return;
  }

  if (validInput.split("").reverse().join("") === validInput) {
    resultText.innerText = `${input} is a palindrome`;
    return;
  }

  resultText.innerText = `${input} is not a palindrome`;
};

submitButton.addEventListener("click", processResult);
