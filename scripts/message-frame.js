/* ...existing code... */

window.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");

  if (orderId) {
    // Fetch existing messages
    fetch(`http://localhost:3000/orders/${orderId}/chat`)
      .then((response) => response.json())
      .then((messages) => {
        const messageContainer = document.querySelector(".message-bubbles");
        messages.forEach((message) => {
          const bubble = document.createElement("div");
          bubble.classList.add("message-bubble");
          bubble.textContent = message.content; // Adjust based on message structure
          messageContainer.appendChild(bubble);
        });
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    // Handle send button click
    const sendButton = document.querySelector(".input-area button");
    const inputField = document.querySelector(".input-area input");

    if (sendButton && inputField) {
      sendButton.addEventListener("click", function () {
        const content = inputField.value.trim();
        if (content !== "") {
          fetch(`http://localhost:3000/orders/${orderId}/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sender: "buyer", content }),
          })
            .then((response) => response.json())
            .then((message) => {
              const messageContainer =
                document.querySelector(".message-bubbles");
              const bubble = document.createElement("div");
              bubble.classList.add("message-bubble");
              bubble.textContent = message.content; // Adjust based on message structure
              messageContainer.appendChild(bubble);
              inputField.value = ""; // Clear input field
            })
            .catch((error) => {
              console.error("Error sending message:", error);
            });
        }
      });
    }
  } else {
    console.log("No order ID provided.");
  }
});
