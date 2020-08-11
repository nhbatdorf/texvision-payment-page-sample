const invInput = document.querySelectorAll(".so-inv-num");
let invValOne, invValTwo;

invInput.forEach((data) => {
  data.addEventListener("input", invoiceVerify);
});

function invoiceVerify(e) {
  const field = e.target;
  const value = e.target.value;
  if (Number(value) === NaN) {
    if (field.classList.contains("invOne")) {
      e.target.value = invValOne;
    } else if (field.classList.contains("invTwo")) {
      e.target.value = invValTwo;
    }
  }
  console.log(e.target);
  //   if (e.target.value.length <= 3) {
  //     invVal = e.target.value;
  //   } else {
  //   }
}
