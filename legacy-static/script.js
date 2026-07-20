(function () {
  "use strict";

  // ---- theme toggle -------------------------------------------------
  var root = document.documentElement;
  var toggleBtn = document.querySelector(".theme-toggle");
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  }
  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function updateToggleLabel() {
    if (!toggleBtn) return;
    toggleBtn.textContent = currentTheme() === "dark" ? "☀ ライト" : "🌙 ダーク";
  }
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      updateToggleLabel();
    });
    updateToggleLabel();
  }

  // ---- map click -> scroll to company section ------------------------
  document.querySelectorAll("[data-target]").forEach(function (el) {
    el.addEventListener("click", function () {
      var target = document.getElementById(el.getAttribute("data-target"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "link");
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  // ---- back to top ------------------------------------------------------
  var backBtn = document.querySelector(".back-to-top");
  if (backBtn) {
    window.addEventListener("scroll", function () {
      backBtn.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- quick filter for comparison table & company cards ---------------
  var search = document.getElementById("quick-search");
  if (search) {
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      document.querySelectorAll("table.compare tbody tr").forEach(function (row) {
        row.style.display = row.textContent.toLowerCase().indexOf(q) === -1 ? "none" : "";
      });
      document.querySelectorAll(".company-card").forEach(function (card) {
        card.style.display = card.textContent.toLowerCase().indexOf(q) === -1 ? "none" : "";
      });
    });
  }
})();
