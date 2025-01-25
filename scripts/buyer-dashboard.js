// ...existing code...

window.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  if (orderId) {
    fetch(`http://localhost:3000/orders/${orderId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
      });
  } else {
    console.log("No order ID provided.");
  }
});
