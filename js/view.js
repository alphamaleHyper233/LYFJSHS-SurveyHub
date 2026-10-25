document.addEventListener("DOMContentLoaded", () => {
      // Apply theme + font size
      const theme = localStorage.getItem("theme");
      const textSize = localStorage.getItem("textSize") || "medium";
      if (theme === "light") {
        document.body.classList.add("light");
        document.querySelector(".survey-container").classList.add("light");
      }
      document.body.style.fontSize =
        textSize === "small" ? "14px" : textSize === "large" ? "20px" : "16px";

      // Get URL parameters
      const params = new URLSearchParams(window.location.search);
      const title = decodeURIComponent(params.get("title") || "Untitled Survey");
      const desc = decodeURIComponent(params.get("desc") || "");
      const link = decodeURIComponent(params.get("link") || "");

      document.getElementById("surveyTitle").innerText = title;
      const descEl = document.getElementById("surveyDesc");
      descEl.innerText = desc;
      descEl.style.color = theme === "light" ? "#212529" : "#f0f0f0";

      if (link && link.startsWith("http")) {
        document.getElementById("surveyFrame").src = link;
      } else {
        document.getElementById("surveyFrame").src = "about:blank";
      }
    });

    function showToast(message) {
      const container = document.getElementById("toastContainer");

      const toastEl = document.createElement("div");
      toastEl.className = "toast align-items-center text-bg-warning border-0";
      toastEl.setAttribute("role", "alert");
      toastEl.setAttribute("aria-live", "assertive");
      toastEl.setAttribute("aria-atomic", "true");
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;

      container.appendChild(toastEl);
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();

      toastEl.addEventListener("hidden.bs.toast", () => {
        toastEl.remove();
      });
    }

    document.getElementById("registerLink").addEventListener("click", (e) => {
      e.preventDefault();
      showToast("⚠️ Registration/Login cannot be used — full PHP functionality cannot be published on free hosting platforms.");
    });

    document.getElementById("loginLink").addEventListener("click", (e) => {
      e.preventDefault();
      showToast("⚠️ Registration/Login cannot be used — full PHP functionality cannot be published on free hosting platforms.");
    });