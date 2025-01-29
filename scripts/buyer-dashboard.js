// ...existing code...

window.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");

  function getLatestStatus(statusUpdates) {
    return statusUpdates.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp)
        ? current
        : latest;
    });
  }

  function getStatusMatch(currentStatus, elementText) {
    // Define special cases for status matching
    const statusMappings = {
      received: "order received",
      // Add more mappings as needed
    };

    const normalizedStatus = currentStatus.toLowerCase();
    const normalizedText = elementText.toLowerCase();

    // Check if there's a special mapping for this status
    if (statusMappings[normalizedStatus]) {
      return normalizedText.includes(statusMappings[normalizedStatus]);
    }

    // Default to regular includes check
    return normalizedText.includes(normalizedStatus);
  }

  function updateStatusDot(status) {
    // Remove any existing active dots
    const allDots = document.querySelectorAll(
      ".first-circle, .second-circle, .multiple-circles, .inner-circles1"
    );
    allDots.forEach((dot) => {
      dot.style.backgroundColor = "var(--color-gray-300)";
    });

    // Find the status text element and its corresponding dot
    const allStatusSteps = document.querySelectorAll(
      ".delivery-location, .step-labels, .step-labels1, .step-labels2, .step-labels3, .step-labels7, .step-labels8, .step-labels9, .step-labels10, .order-received-location"
    );

    const statusStepArray = Array.from(allStatusSteps);
    const statusStep = statusStepArray.find((step) => {
      const statusText = step.querySelector(
        ".delivered, .packaging, .initial-loading, .order-received"
      );
      return statusText && getStatusMatch(status, statusText.textContent);
    });

    if (statusStep) {
      const index = statusStepArray.indexOf(statusStep);
      const dots = document.querySelectorAll(
        ".first-circle, .second-circle, .multiple-circles, .inner-circles1"
      );

      // Set all previous dots to green (completed)
      for (let i = statusStepArray.length; i >= index - 1; i--) {
        if (dots[i]) {
          dots[i].style.backgroundColor = "var(--color-forestgreen)";
        }
      }

      // Set the current step (index - 1) to purple
      if (dots[index - 1]) {
        dots[index - 1].style.backgroundColor = "var(--color-slateblue-100)";
      }
    }
  }

  if (orderId) {
    fetch(`http://localhost:3000/orders/${orderId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Fetch status updates
        fetch(`http://localhost:3000/orders/${orderId}/status-updates`)
          .then((response) => response.json())
          .then((statusData) => {
            console.log(statusData);
            const latestStatus = getLatestStatus(statusData);
            updateStatusDot(latestStatus.status);
          })
          .catch((error) => {
            console.error("Error fetching status updates:", error);
          });
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
