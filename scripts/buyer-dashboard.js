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
      return (
        statusText &&
        statusText.textContent.toLowerCase().includes(status.toLowerCase())
      );
    });

    if (statusStep) {
      const index = statusStepArray.indexOf(statusStep);
      const dots = document.querySelectorAll(
        ".first-circle, .second-circle, .multiple-circles, .inner-circles1"
      );

      // Set all previous dots to green (completed)
      for (let i = statusStepArray.length; i >= index; i--) {
        if (dots[i]) {
          dots[i].style.backgroundColor = "var(--color-forestgreen)";
        }
      }

      // Set the current step (index - 1) to purple
      if (dots[index]) {
        dots[index].style.backgroundColor = "var(--color-slateblue-100)";
      }
    }
  }

  function formatDate(date) {
    if (!date) return { date: "00/00/0000", time: "0:00 AM" };
    const d = new Date(date);
    // Add 1 to month since getMonth() returns 0-11
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();

    const dateStr = `${month}/${day}/${year}`;
    const timeStr = d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { date: dateStr, time: timeStr };
  }

  function updateDateElements(statusData) {
    const dateElements = Array.from(
      document.querySelectorAll(
        ".date-values, .date-components8, .date-components9, .order-date"
      )
    ).reverse(); // Reverse the array of elements

    // Set default values for all date elements
    dateElements.forEach((element) => {
      const dateDiv = element.querySelector(".apr-2025") || element;
      const timeDiv =
        element.querySelector(".am") || element.querySelector(".am10");
      if (dateDiv) dateDiv.textContent = "00 abc 0000";
      if (timeDiv) timeDiv.textContent = "0:00 AM";
    });

    // Sort status data by timestamp in ascending order
    const sortedStatusData = [...statusData].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Update with actual timestamps
    sortedStatusData.forEach((status, index) => {
      if (index < dateElements.length) {
        const element = dateElements[index];
        const { date, time } = formatDate(status.timestamp);
        const dateDiv = element.querySelector(".apr-2025") || element;
        const timeDiv =
          element.querySelector(".am") || element.querySelector(".am10");
        if (dateDiv) dateDiv.textContent = date;
        if (timeDiv) timeDiv.textContent = time;
      }
    });
  }

  function updateStatusAndLocation(statusData) {
    // First do the existing status dot updates
    const latestStatus = getLatestStatus(statusData);
    updateStatusDot(latestStatus.status);
    updateDateElements(statusData);

    // Update location text for each status
    const allStatusSteps = document.querySelectorAll(
      ".delivery-location, .step-labels, .step-labels1, .step-labels2, .step-labels3, .step-labels7, .step-labels8, .step-labels9, .step-labels10, .order-received-location"
    );

    const statusStepArray = Array.from(allStatusSteps);

    // Reset all location texts to default
    statusStepArray.forEach((step) => {
      const locationDiv = step.querySelector(".to-saudi-arabia, .at-china-bj9");
      if (locationDiv) {
        locationDiv.textContent = "Location: ...";
      }
    });

    // Update locations from status data
    statusData.forEach((status) => {
      const matchingStep = statusStepArray.find((step) => {
        const statusText = step.querySelector(
          ".delivered, .packaging, .initial-loading, .order-received"
        );
        return (
          statusText &&
          statusText.textContent
            .toLowerCase()
            .includes(status.status.toLowerCase())
        );
      });

      if (matchingStep) {
        const locationDiv = matchingStep.querySelector(
          ".to-saudi-arabia, .at-china-bj9"
        );
        if (locationDiv) {
          locationDiv.textContent = status.location || "Location: ...";
        }
      }
    });
  }

  function updateEstimatedDelivery(deadline) {
    const estimatedDateElement = document.querySelector(
      ".estimated-delivery-date"
    );
    if (estimatedDateElement && deadline) {
      const { date, time } = formatDate(deadline);
      estimatedDateElement.textContent = `Estimated delivery date ${date}`;
      const timeElement = document.querySelector(".am-100");
      if (timeElement) {
        timeElement.textContent = time;
      }
    }
  }

  function updateOrderNumber(orderData) {
    const orderNumberElement = document.querySelector(".order-no-435478675232");
    if (orderNumberElement && orderData.id) {
      orderNumberElement.textContent = `Order No. #${orderData.id}`;
    }
  }

  function updatePlacedDate(orderData) {
    const placedDateElement = document.querySelector(".placed-order-1822025");
    if (placedDateElement && orderData.placedDate) {
      const { date } = formatDate(orderData.placedDate);
      placedDateElement.textContent = `Placed order ${date}`;
    }
  }

  if (orderId) {
    fetch(`http://localhost:3000/orders/${orderId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        updateEstimatedDelivery(data.deadline);
        updateOrderNumber(data);
        updatePlacedDate(data);
        // Fetch status updates
        fetch(`http://localhost:3000/orders/${orderId}/status-updates`)
          .then((response) => response.json())
          .then((statusData) => {
            console.log(statusData);
            updateStatusAndLocation(statusData);
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
