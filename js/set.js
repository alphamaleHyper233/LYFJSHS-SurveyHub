    document.addEventListener("DOMContentLoaded", () => {
  const toastEl = document.getElementById('phpToast');
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });

  // Attach warning to Register and Login links
  const phpLinks = [
    '.navbar-nav a[href="#"]' // select all links that go nowhere
  ];

  phpLinks.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault(); // prevent default navigation
        toast.show();
      });
    });
  });
});
  
    function getFontSize(size) {
      switch (size) {
        case "small": return "14px";
        case "large": return "20px";
        default: return "16px";
      }
    }

    function applyThemeAndFont() {
      const theme = localStorage.getItem("theme");
      const textSize = localStorage.getItem("textSize") || "medium";

      if (theme === "light") {
        document.body.classList.add("light");
      } else {
        document.body.classList.remove("light");
      }

      document.body.style.fontSize = getFontSize(textSize);

      // Update button colors based on theme
      document.querySelectorAll(".text-size-buttons button").forEach(btn => {
        btn.style.color = getComputedStyle(document.body).getPropertyValue("--text");
        btn.style.borderColor = getComputedStyle(document.body).getPropertyValue("--text");
      });

      // Highlight active button
      document.querySelectorAll(".text-size-buttons button").forEach(b => b.classList.remove("btn-success"));
      const activeBtn = document.querySelector(`.text-size-buttons button[data-size="${textSize}"]`);
      if (activeBtn) activeBtn.classList.add("btn-success");
    }

    document.addEventListener("DOMContentLoaded", applyThemeAndFont);

    // Toggle Dark / Light mode
    document.getElementById("toggleTheme").addEventListener("click", () => {
      document.body.classList.toggle("light");
      const newTheme = document.body.classList.contains("light") ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyThemeAndFont();
    });

    // Text size buttons
    document.querySelectorAll(".text-size-buttons button").forEach(btn => {
      btn.addEventListener("click", () => {
        const size = btn.getAttribute("data-size");
        localStorage.setItem("textSize", size);
        applyThemeAndFont();
      });
    });