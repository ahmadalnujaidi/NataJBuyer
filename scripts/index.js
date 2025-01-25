// ...existing code...

document.getElementById("trackButton").addEventListener("click", function () {
  const orderNumber = document.getElementById("orderNumberInput").value.trim();
  if (orderNumber !== "") {
    fetch(`http://localhost:3000/orders/${orderNumber}`)
      .then((response) => {
        if (response.ok) {
          window.location.href = `buyer-dashboard.html?id=${orderNumber}`;
        } else {
          throw new Error("Non existing order");
        }
      })
      .catch((error) => {
        alert("non existing order");
      });
  } else {
    alert("Please enter your order number.");
  }
});
