document.addEventListener("DOMContentLoaded", () => {
  const faqContainer =
    document.querySelector("[data-faq-list]") ||
    document.querySelector(".faq-list") ||
    document.querySelector("main");

  faqContainer?.addEventListener("click", (e) => {
    const button = e.target.closest("[data-faq-button]");
    if (!button) return;

    const item = button.closest(".faq-item");
    if (!item) return;

    const isOpen = item.classList.contains("open");

    // Close any other open faq item
    document.querySelectorAll(".faq-item.open").forEach((x) => {
      x.classList.remove("open");
      x.querySelector("[data-faq-button]")?.setAttribute(
        "aria-expanded",
        "false",
      );
    });

    // Toggle current item
    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});
