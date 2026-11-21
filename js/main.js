document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement,
    page = document.querySelector(".page-shell"),
    navbar = document.querySelector("[data-navbar]"),
    menuButton = document.querySelector("[data-menu-button]"),
    mobileMenu = document.querySelector("[data-mobile-menu]");

  requestAnimationFrame(() => page?.classList.add("page-ready"));

  const current = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const target = (link.getAttribute("href") || "")
      .split("/")
      .pop()
      .toLowerCase();
    if (target === current || (current === "" && target === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  const closeMenu = () => {
    mobileMenu?.classList.add("hidden");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };

  menuButton?.addEventListener("click", () => {
    const hidden = mobileMenu.classList.toggle("hidden");
    menuButton.setAttribute("aria-expanded", String(!hidden));
    menuButton.innerHTML = hidden
      ? '<i class="fa-solid fa-bars"></i>'
      : '<i class="fa-solid fa-xmark"></i>';
  });

  mobileMenu
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));

  const handleNav = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 16);
  };
  window.addEventListener("scroll", handleNav, { passive: true });
  handleNav();

  // Dark/Light Theme Toggle with localStorage & Accessibility
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  if (localStorage.getItem("portfolio-theme") === "light") {
    html.classList.add("light");
  }

  const updateTheme = () => {
    const light = html.classList.contains("light");
    buttons.forEach((b) => {
      b.innerHTML = light
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';
      b.setAttribute(
        "aria-label",
        light ? "Use dark theme" : "Use light theme"
      );
      b.title = light ? "Use dark theme" : "Use light theme";
    });
  };

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      html.classList.toggle("light");
      localStorage.setItem(
        "portfolio-theme",
        html.classList.contains("light") ? "light" : "dark"
      );
      updateTheme();
    })
  );
  updateTheme();

  // Smooth page transition handler
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      link.target === "_blank"
    ) {
      return;
    }

    link.addEventListener("click", (e) => {
      // Don't intercept modifier keys (new tab/window) or non-left clicks
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // Check if hash link on the current page
      const [path, hash] = href.split("#");
      const currentPath = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      if ((path === "" || path.toLowerCase() === currentPath) && hash) {
        return; // Allow native smooth jump
      }

      e.preventDefault();
      page?.classList.add("page-leaving");
      setTimeout(() => {
        location.href = href;
      }, 260);
    });
  });

  // Scroll to top button
  const top = document.querySelector("[data-scroll-top]");
  const scrollHandler = () =>
    top?.classList.toggle("show", window.scrollY > 420);
  window.addEventListener("scroll", scrollHandler, { passive: true });
  scrollHandler();
  top?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  // Dynamic Year
  document
    .querySelectorAll("[data-year]")
    .forEach((e) => (e.textContent = new Date().getFullYear()));

  // Reveal Animations
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px" }
    );
    items.forEach((i) => io.observe(i));
  } else {
    items.forEach((i) => i.classList.add("show"));
  }

  // Contact Form Validation & Submission (Workshop Desain Web - Minggu 10)
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const statusBox = document.querySelector("#contact-status");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector("#contact-name");
      const emailInput = contactForm.querySelector("#contact-email");
      const subjectInput = contactForm.querySelector("#contact-subject");
      const messageInput = contactForm.querySelector("#contact-message");
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const subject = subjectInput ? subjectInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        if (statusBox) {
          statusBox.className = "form-alert form-alert-error";
          statusBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please fill in all required fields.';
          statusBox.classList.remove("hidden");
          statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }

      if (!emailRegex.test(email)) {
        if (statusBox) {
          statusBox.className = "form-alert form-alert-error";
          statusBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please provide a valid email address.';
          statusBox.classList.remove("hidden");
          statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }

      const origBtn = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtn;
        if (statusBox) {
          statusBox.className = "form-alert form-alert-success";
          statusBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you, ' + name + '! Your message has been sent successfully.';
          statusBox.classList.remove("hidden");
        }
        contactForm.reset();
      }, 600);
    });
  }
});
