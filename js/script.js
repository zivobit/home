
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("websiteGrid");
  const cards = Array.from(grid.querySelectorAll(".website-card"));
  const searchInput = document.getElementById("searchInput");
  const filterButtons = Array.from(
    document.querySelectorAll(".filter-btn")
  );
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");
  const resetFilters = document.getElementById("resetFilters");
  const gridView = document.getElementById("gridView");
  const listView = document.getElementById("listView");
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");

  let selectedCategory = "all";

  // Update copyright year automatically.
  document.querySelectorAll(".year").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  // Search and category filtering.
  function filterWebsites() {
    const query = searchInput.value
      .trim()
      .toLowerCase();

    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const searchableText = [
        card.dataset.search || "",
        card.textContent || ""
      ].join(" ").toLowerCase();

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const matchesSearch =
        query === "" || searchableText.includes(query);

      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    resultsCount.textContent =
      `${visibleCount} website${visibleCount === 1 ? "" : "s"}`;

    emptyState.hidden = visibleCount !== 0;
  }

  searchInput.addEventListener("input", filterWebsites);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      filterWebsites();
    });
  });

  // Switch between grid and list layouts.
  function setView(view) {
    const isGrid = view === "grid";

    grid.classList.toggle("list-view", !isGrid);

    gridView.classList.toggle("active", isGrid);
    listView.classList.toggle("active", !isGrid);

    gridView.setAttribute("aria-pressed", String(isGrid));
    listView.setAttribute("aria-pressed", String(!isGrid));
  }

  gridView.addEventListener("click", () => setView("grid"));
  listView.addEventListener("click", () => setView("list"));

  // Reset filters.
  function resetAllFilters() {
    searchInput.value = "";
    selectedCategory = "all";

    filterButtons.forEach((button) => {
      const active = button.dataset.category === "all";
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    filterWebsites();
    searchInput.focus();
  }

  resetFilters.addEventListener("click", resetAllFilters);

  // Keyboard shortcut: "/" focuses search unless typing in a field.
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLElement &&
      (target.isContentEditable ||
       ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

    if (event.key === "/" && !isTyping &&
        !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      searchInput.focus();
    }

    if (event.key === "Escape") {
      closeSidebar();
    }
  });

  // Mobile navigation.
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  document.addEventListener("click", (event) => {
    if (
      window.matchMedia("(max-width: 720px)").matches &&
      sidebar.classList.contains("is-open") &&
      !sidebar.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeSidebar();
    }
  });

  // Initial render.
  filterWebsites();
});
