const invOne = document.querySelector(".invOne");
const invTwo = document.querySelector(".invTwo");
const invBtn = document.querySelector(".so-inv-btn");
const invError = document.querySelector(".so-inv-error");
const amtField = document.querySelector(".amt");
const cardNumber = document.querySelector(".card-number");
const cardMon = document.querySelector(".valMon");
const cardYr = document.querySelector(".valYr");
const dateErr = document.querySelector(".card-date-error");
const cvv2Data = document.querySelector(".cvv2");
const chName = document.querySelector(".ch-name");
const custEmail = document.querySelector(".cust-email");
const payBtn = document.querySelector(".pay-btn");
const receipt = document.querySelector(".receipt");
const map = document.querySelector(".map");

let invNum;
let payError = document.querySelector(".pay-error");

const gray = "#f1f1f1";
const red = "rgb(190, 3, 24)";
const green = "rgb(121, 196, 0)";

invOne.addEventListener("input", () => {
  invCheck(invOne);
});
invTwo.addEventListener("input", () => {
  invCheck(invTwo);
});

invBtn.addEventListener("click", (e) => {
  cleanSlate("inv");
  typeToggle(e);
  invoiceVerify();
});
cardNumber.addEventListener("input", numberFormatter);
cardMon.addEventListener("input", (e) => {
  cleanSlate("dat");
  dateVerify();
});
cardYr.addEventListener("input", (e) => {
  cleanSlate("dat");
  dateVerify();
});
cvv2Data.addEventListener("input", cvvVerify);
chName.addEventListener("input", chnVerify);
custEmail.addEventListener("input", emailVerify);
payBtn.addEventListener("click", printReceipt);
map.addEventListener("click", resetForm);

function cleanSlate(funct) {
  if (funct === "all" || funct === "inv") {
    invOne.style.borderColor = gray;
    invTwo.style.borderColor = gray;
    invBtn.style.borderColor = gray;
    amtField.style.borderColor = gray;
    amtField.style.backgroundColor = "#bebebe";
    invError.innerText = "";
  }
  if (funct === "all" || funct === "dat") {
    cardMon.style.borderColor = gray;
    cardYr.style.borderColor = gray;
    dateErr.innerText = "";
  }
  if (funct === "all") {
    invOne.value = "";
    invTwo.value = "";
    invBtn.innerHTML = "I/O";
    amtField.innerHTML = "";
    amtField.style.borderColor = red;
    cardNumber.value = "";
    cardNumber.style.borderColor = gray;
    cardNumber.style.backgroundImage = `url("https://www.texvisions.com/design_tool/data/test_logos/blank_card.png")`;
    cardMon.value = "";
    cardYr.value = "";
    cvv2Data.value = "";
    cvv2Data.style.borderColor = gray;
    chName.value = "";
    chName.style.borderColor = gray;
    custEmail.value = "";
    custEmail.style.borderColor = gray;
    payBtn.style.backgroundColor = red;
    payError.innerHTML = "";
  }
}

function typeToggle(e) {
  const btnText = e.target.innerText;
  if (btnText === "I/O" || btnText === "SO") {
    invBtn.innerText = "SI";
  } else {
    invBtn.innerText = "SO";
  }
}

async function getAmount() {
  const amtFetch = await fetch(
    "https://www.random.org/integers/?num=1&min=1&max=500&col=1&base=10&format=plain&rnd=new"
  );
  const amt = await amtFetch.json();
  return amt;
}

function invVerified() {
  invOne.style.borderColor = green;
  invTwo.style.borderColor = green;
  invBtn.style.borderColor = green;
  amtField.style.borderColor = green;
  amtField.style.backgroundColor = gray;
}

function invCheck(field) {
  const value = field.value;
  const valueArray = value.split("").filter(checkNum);
  field.value = valueArray.toString().replace(/,/g, "");
  if (field.value.length != 3) {
    field.style.borderColor = red;
  } else {
    field.style.borderColor = gray;
  }
}

async function invoiceVerify() {
  const invValOne = invOne.value;
  const invValTwo = invTwo.value;
  const invError = document.querySelector(".so-inv-error");

  if (isNaN(invValOne) || invValOne.length != 3) {
    invOne.style.borderColor = red;
    invError.innerText =
      "Each Sales Order/Invoice field must hold three numbers and no letters.";
    return;
  }
  if (isNaN(invValTwo) || invValTwo.length != 3) {
    invTwo.style.borderColor = red;
    invError.innerText =
      "Each Sales Order/Invoice field must hold three numbers and no letters.";
    return;
  }

  const invAmt = await getAmount();
  amtField.innerHTML = "$ " + invAmt + ".00";
  invNum = invValOne.toString() + invValTwo.toString() + invBtn.innerHTML;

  invVerified();
  checkPayment();
}

function checkNum(val) {
  if (val === " ") {
    return false;
  } else {
    return !isNaN(val);
  }
}

function numberFormatter(e) {
  const cardString = e.target.value;
  const cardArray = cardString.split("");
  const filCardArray = cardArray.filter(checkNum);

  for (let i = 4; i < filCardArray.length; i = i + 5) {
    filCardArray.splice(i, 0, " ");
  }

  switch (filCardArray[0]) {
    case "3":
      cardNumber.style.backgroundImage = `url("https://www.texvisions.com/design_tool/data/test_logos/amex.png")`;
      break;
    case "4":
      cardNumber.style.backgroundImage = `url("https://www.texvisions.com/design_tool/data/test_logos/visa.png")`;
      break;
    case "5":
      cardNumber.style.backgroundImage = `url("https://www.texvisions.com/design_tool/data/test_logos/mastercard.png")`;
      break;
    case "6":
      cardNumber.style.backgroundImage = `url("https://www.texvisions.com/design_tool/data/test_logos/discover.png")`;
      break;
    default:
      cardNumber.style.backgroundImage = `url("https://www.texvisions.com/design_tool/data/test_logos/blank_card.png")`;
  }
  cardNumber.value = filCardArray.toString().replace(/,/g, "");

  if (filCardArray.length === 19) {
    cardNumber.style.borderColor = green;
  } else {
    cardNumber.style.borderColor = red;
  }
  checkPayment();
}

function dateVerify() {
  const month = cardMon.value - 1;
  const year = 20 + cardYr.value;
  const today = new Date();
  const expire = new Date(year, month, 28);

  if (cardMon.value.length != 2 || month > 11) {
    cardMon.style.borderColor = red;
    return;
  }
  if (cardYr.value.length != 2) {
    cardYr.style.borderColor = red;
    return;
  }

  if (today > expire) {
    dateErr.innerHTML = "Date has expired";
    cardMon.style.borderColor = red;
    cardYr.style.borderColor = red;
  } else {
    cardMon.style.borderColor = green;
    cardYr.style.borderColor = green;
  }
  checkPayment();
}

function showInfo() {
  const cvvInfo = document.querySelector(".cvv-info");
  cvvInfo.style.opacity = "1";
  cvvInfo.style.zIndex = "1";
}

function hideInfo() {
  const cvvInfo = document.querySelector(".cvv-info");
  cvvInfo.style.opacity = "0";
  cvvInfo.style.zIndex = "-1";
}

function cvvVerify(e) {
  const input = e.target.value;
  const inputArray = input.split("").filter(checkNum);
  cvv2Data.value = inputArray.toString().replace(/,/g, "");

  if (cvv2Data.value.length === 3) {
    cvv2Data.style.borderColor = green;
  } else {
    cvv2Data.style.borderColor = red;
  }
  checkPayment();
}

function chnVerify(e) {
  const input = e.target.value;
  if (input.length > input.search(" ") && input.search(" ") != -1) {
    chName.style.borderColor = green;
  } else {
    chName.style.borderColor = red;
  }
  checkPayment();
}

function emailVerify(e) {
  const input = e.target.value;

  if (input.search("@") != -1) {
    if (
      input.endsWith(".com") ||
      input.endsWith(".net") ||
      input.endsWith(".org")
    ) {
      custEmail.style.borderColor = green;
    } else {
      custEmail.style.borderColor = red;
    }
  }
  checkPayment();
}

function checkPayment() {
  let formComplete = 0;

  if (amtField.style.borderColor === green) {
    formComplete++;
  }
  if (cardNumber.style.borderColor === green) {
    formComplete++;
  }
  if (cardYr.style.borderColor === green) {
    formComplete++;
  }
  if (cvv2Data.style.borderColor === green) {
    formComplete++;
  }
  if (chName.style.borderColor === green) {
    formComplete++;
  }
  if (custEmail.style.borderColor === green) {
    formComplete++;
  }

  if (formComplete === 6) {
    payError.innerHTML = "";
    payBtn.style.backgroundColor = green;
    return true;
  } else {
    payBtn.style.backgroundColor = red;
    return false;
  }
}

function getCardType(firstNum) {
  switch (firstNum) {
    case "3":
      return "AMEX";
    case "4":
      return "VISA";
    case "5":
      return "MSTC";
    case "6":
      return "DISC";
    default:
      return "CARD";
  }
}

function showReceipt() {
  const recEmail = document.querySelector(".rec-email");
  const recInv = document.querySelector(".rec-inv");
  const recAmt = document.querySelector(".rec-amt");
  const recType = document.querySelector(".rec-type");
  const recCard = document.querySelector(".rec-card");
  const recExp = document.querySelector(".rec-exp");

  recEmail.innerHTML = "Email: " + custEmail.value;
  recInv.innerHTML = "SO/SI: " + invNum;
  recAmt.innerHTML = "Amount: " + amtField.innerHTML;
  recType.innerHTML = getCardType(cardNumber.value.charAt(0));
  recCard.innerHTML = "**** **** **** " + cardNumber.value.substring(15, 19);
  recExp.innerHTML = "Expires: " + cardMon.value + "/" + cardYr.value;

  receipt.style.display = "block";
  receipt.style.zIndex = "1";
}

function printReceipt() {
  if (checkPayment()) {
    showReceipt();
  } else {
    payError.innerHTML = "Check data in red border inputs.";
  }
}

function resetForm() {
  receipt.style.display = "none";
  receipt.style.zIndex = "-1";

  cleanSlate("all");
}
