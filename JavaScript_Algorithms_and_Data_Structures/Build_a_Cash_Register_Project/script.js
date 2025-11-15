let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const currencyUnit = {
  "ONE HUNDRED": 100.0,
  TWENTY: 20.0,
  TEN: 10.0,
  FIVE: 5.0,
  ONE: 1.0,
  QUARTER: 0.25,
  DIME: 0.1,
  NICKEL: 0.05,
  PENNY: 0.01,
};

const cashInput = document.getElementById("cash");
const changeDueSpan = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
document.getElementById("total").textContent += ` $${price}`;
const moneyInRegisterDiv = document.getElementById("money-in-register");
const moneyInRegister = cid.map((currencyArray) => {
  const div = document.createElement("div");
  div.textContent = `${currencyArray[0]}: $${currencyArray[1].toFixed(2)}`;
  return div;
});
moneyInRegister.forEach((div) => moneyInRegisterDiv.append(div));

const calculateTotal = (change) =>
  change.reduce((acc, el) => acc + Math.round(el[1] * 100), 0);

const inputValidation = () => {
  const cashInputNum = +cashInput.value;
  if (cashInputNum < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cashInputNum === price) {
    changeDueSpan.innerHTML = "No change due - customer paid with exact cash";
    return;
  }

  changeDueSpan.innerHTML = ""; // Clear for change calculation
  return cashInputNum;
};

const formatAmount = (amt) => {
  const fixed = amt.toFixed(2);
  const parsed = parseFloat(fixed);
  return parsed.toString();
};

const calculateChangeDue = (cash) => {
  let rest = Math.round((cash - price) * 100);
  const totalCashInDrawer = calculateTotal(cid);
  let statusText;
  let changeDue = {};

  if (totalCashInDrawer < rest) {
    statusText = "Status: INSUFFICIENT_FUNDS";
  } else if (totalCashInDrawer === rest) {
    statusText = "Status: CLOSED";
    // Special case: Dispense entire drawer (exact by total)
    cid.forEach(([unit, amt]) => {
      if (amt > 0) {
        changeDue[unit] = amt;
      }
    });
  } else {
    statusText = "Status: OPEN";
    // Greedy algorithm for OPEN
    for (const currency in currencyUnit) {
      const unitCents = Math.round(currencyUnit[currency] * 100);
      const amountNeeded = Math.floor(rest / unitCents) * unitCents;
      const currencyArray = cid.find((arr) => arr[0] === currency);
      const cidValue = Math.round(currencyArray[1] * 100);

      if (amountNeeded === 0) continue; // Skip if nothing needed here

      if (cidValue < amountNeeded) {
        changeDue[currency] = cidValue / 100;
        rest -= cidValue;
      } else {
        changeDue[currency] = amountNeeded / 100;
        rest %= unitCents;
      }

      if (rest === 0) break;
    }

    if (rest > 0) {
      statusText = "Status: INSUFFICIENT_FUNDS";
      changeDue = {}; // No change dispensed
    }
  }

  // Build exact output string
  let message = statusText;
  if (Object.keys(changeDue).length > 0) {
    let changeStr = "";
    for (const currency in currencyUnit) {
      const amt = changeDue[currency];
      if (amt > 0) {
        const formatted = formatAmount(amt);
        changeStr += `${currency}: $${formatted} `;
      }
    }
    message += ` ${changeStr.trim()}`;
  }

  changeDueSpan.innerHTML = message;
  return changeDue; // Return for drawer update check
};

const calculateMoneyInRegister = (changeDue) => {
  cid.forEach((currencyArray, index) => {
    const value = changeDue[currencyArray[0]];
    if (value) {
      cid[index][1] -= value;
    }
  });

  moneyInRegister.forEach(
    (div, index) =>
      (div.textContent = `${cid[index][0]}: $${cid[index][1].toFixed(2)}`)
  );
};

const processPayment = () => {
  const cashInputNum = inputValidation();
  if (!cashInputNum) {
    return;
  }

  const changeDue = calculateChangeDue(cashInputNum);
  if (Object.keys(changeDue).length > 0) {
    calculateMoneyInRegister(changeDue);
  }
};

purchaseBtn.addEventListener("click", processPayment);
