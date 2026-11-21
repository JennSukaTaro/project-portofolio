document.addEventListener("DOMContentLoaded", () => {
  const filterContainer =
    document.querySelector("[data-gallery-filters]") ||
    document.querySelector("main");
  const galleryGrid =
    document.querySelector("[data-gallery-grid]") ||
    document.querySelector("main");
  const modal = document.querySelector("[data-gallery-modal]");
  const image = document.querySelector("[data-gallery-modal-image]");
  const title = document.querySelector("[data-gallery-modal-title]");
  const desc = document.querySelector("[data-gallery-modal-description]");
  const category = document.querySelector("[data-gallery-modal-category]");
  const items = document.querySelectorAll("[data-gallery-category]");

  // 1. Event Delegation for Filters
  filterContainer?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gallery-filter]");
    if (!btn) return;

    document
      .querySelectorAll("[data-gallery-filter]")
      .forEach((x) => x.classList.toggle("active", x === btn));

    const f = btn.dataset.galleryFilter;
    items.forEach((item) => {
      const hide = f !== "all" && item.dataset.galleryCategory !== f;
      item.classList.toggle("is-hidden", hide);
    });
  });

  // 2. Event Delegation for Gallery Items
  galleryGrid?.addEventListener("click", (e) => {
    const item = e.target.closest("[data-gallery-category]");
    if (!item || item.dataset.galleryExternal === "true") return;

    if (image) {
      image.src = item.dataset.image;
      image.alt = item.dataset.title || "Gallery item";
    }
    if (title) title.textContent = item.dataset.title;
    if (desc) desc.textContent = item.dataset.description;
    if (category) category.textContent = item.dataset.galleryCategory;

    modal?.classList.add("active");
    document.body.classList.add("overflow-hidden");
  });

  const close = () => {
    modal?.classList.remove("active");
    document.body.classList.remove("overflow-hidden");
  };

  document
    .querySelector("[data-gallery-close]")
    ?.addEventListener("click", close);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
