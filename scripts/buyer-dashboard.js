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

  // Open Modal
  const messageButton = document.querySelector(".rectangle-parent");
  const modal = document.getElementById("messageModal");
  const closeButton = document.querySelector(".close-button");
  const iframe = modal.querySelector("iframe");

  if (messageButton && modal && closeButton && iframe) {
    messageButton.addEventListener("click", function () {
      iframe.src = `message-frame.html?id=${orderId}`;
      modal.style.display = "block";
    });

    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
      iframe.src = ""; // Clear iframe src when closing
    });

    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
        iframe.src = ""; // Clear iframe src when closing
      }
    });
  }
});
