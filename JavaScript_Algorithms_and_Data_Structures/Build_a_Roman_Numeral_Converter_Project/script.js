const inputVal = document.getElementById("number");
const submitBtn = document.getElementById("convert-btn");
const results = document.getElementById("output");

const isInputValid = (input) => {
  if (!input) {
    results.textContent = "Please enter a valid number";
    return;
  }

  const intInput = parseInt(input);
  if (intInput < 1) {
    results.textContent = "Please enter a number greater than or equal to 1";
    return;
  }
  if (intInput >= 4000) {
    results.textContent = "Please enter a number less than or equal to 3999";
    return;
  }

  return true;
};

const convertToDecimal = () => {
  results.textContent = "";

  if (!isInputValid(inputVal.value)) {
    return;
  }

  const intInput = parseInt(inputVal.value);

  results.textContent += "M".repeat(Math.floor(intInput / 1000));
  let rest = inputVal.value % 1000;

  if (rest >= 900) {
    results.textContent += "CM";
    rest %= 900;
  }

  results.textContent += "D".repeat(Math.floor(rest / 500));
  rest %= 500;

  if (rest >= 400) {
    results.textContent += "CD";
    rest %= 400;
  }

  results.textContent += "C".repeat(Math.floor(rest / 100));
  rest %= 100;

  if (rest >= 90) {
    results.textContent += "XC";
    rest %= 90;
  }

  results.textContent += "L".repeat(Math.floor(rest / 50));
  rest %= 50;

  if (rest >= 40) {
    results.textContent += "XL";
    rest %= 40;
  }

  results.textContent += "X".repeat(Math.floor(rest / 10));
  rest %= 10;

  if (rest >= 9) {
    results.textContent += "IX";
    rest %= 9;
  }

  results.textContent += "V".repeat(Math.floor(rest / 5));
  rest %= 5;

  if (rest >= 4) {
    results.textContent += "IV";
    rest %= 4;
  }

  results.textContent += "I".repeat(Math.floor(rest));
};

submitBtn.addEventListener("click", convertToDecimal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    convertToDecimal();
  }
});
