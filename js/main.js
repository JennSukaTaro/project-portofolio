/**
 * ============================================================================
 * MODUL UTAMA JAVASCRIPT: WORKFLOW, INTERAKTIVITAS, DOM & FORMULIR
 * Berkas: js/main.js
 * ============================================================================
 * 
 * DAFTAR FITUR & KORELASI MODUL KULIAH:
 * 1. Modul 10: Inisialisasi DOM & Penanda Halaman Navigasi Aktif
 * 2. Modul 07: Menu Mobile Responsif & Status WAI-ARIA (aria-expanded)
 * 3. Modul 09/10: Sistem Tema Dark/Light Mode dengan Media Penyimpanan localStorage
 * 4. Modul 07: Transisi Halaman Halus (Ramah Aksesibilitas, tidak membajak Ctrl+Click)
 * 5. Modul 05/10: Tombol Fixed Scroll-to-Top
 * 6. Modul 10: Animasi Gulir Reveal dengan IntersectionObserver API
 * 7. Modul 03 & 10: Validasi & Pengiriman Formulir Kontak Semantik (e.preventDefault)
 */

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement,
    page = document.querySelector(".page-shell"),
    navbar = document.querySelector("[data-navbar]"),
    menuButton = document.querySelector("[data-menu-button]"),
    mobileMenu = document.querySelector("[data-mobile-menu]");

  // Efek transisi masuk halaman (smooth entrance)
  requestAnimationFrame(() => page?.classList.add("page-ready"));

  // ==========================================================================
  // 1. PENANDA NAVIGASI AKTIF (MODUL 03 & 10)
  // Menandai menu navigasi halaman yang sedang dibuka + atribut aria-current
  // ==========================================================================
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
      // Aksesibilitas: Beritahu Screen Reader bahwa ini adalah halaman yang aktif
      link.setAttribute("aria-current", "page");
    }
  });

  // ==========================================================================
  // 2. TOGGLE MENU MOBILE (MODUL 07 - RESPONSIVE & A11Y)
  // Membuka/menutup menu drawer smartphone dan mengupdate aria-expanded
  // ==========================================================================
  const closeMenu = () => {
    mobileMenu?.classList.add("hidden");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };

  menuButton?.addEventListener("click", () => {
    const hidden = mobileMenu.classList.toggle("hidden");
    // WAI-ARIA: Update status keterbukaan tombol menu
    menuButton.setAttribute("aria-expanded", String(!hidden));
    menuButton.innerHTML = hidden
      ? '<i class="fa-solid fa-bars"></i>'
      : '<i class="fa-solid fa-xmark"></i>';
  });

  // Tutup menu saat salah satu link navigasi diklik
  mobileMenu
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));

  // Efek navbar blur saat halaman digulir ({ passive: true } untuk performa)
  const handleNav = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 16);
  };
  window.addEventListener("scroll", handleNav, { passive: true });
  handleNav();

  // ==========================================================================
  // 3. DARK / LIGHT THEME TOGGLE DENGAN LOCALSTORAGE (MODUL 09 & 10)
  // Menyimpan preferensi tema pengguna di browser agar tidak hilang saat reload
  // ==========================================================================
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  // Cek apakah ada preferensi tersimpan sebelumnya
  if (localStorage.getItem("portfolio-theme") === "light") {
    html.classList.add("light");
  }

  // Fungsi sinkronisasi ikon tombol dan label aksesibilitas
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

  // Event listener tombol ganti tema
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      html.classList.toggle("light");
      // Simpan status tema ke localStorage browser
      localStorage.setItem(
        "portfolio-theme",
        html.classList.contains("light") ? "light" : "dark"
      );
      updateTheme();
    })
  );
  updateTheme();

  // ==========================================================================
  // 4. TRANSISI PERPINDAHAN HALAMAN HALUS (SMOOTH TRANSITION)
  // Menjaga Usability: TIDAK membajak tombol Ctrl/Cmd+Click atau target="_blank"
  // ==========================================================================
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
      // Biarkan pengguna membuka tab baru dengan Ctrl+Click, Cmd+Click, atau klik tengah
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // Jika link jangkar hash di halaman yang sama (misal #contact), biarkan native smooth scroll
      const [path, hash] = href.split("#");
      const currentPath = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      if ((path === "" || path.toLowerCase() === currentPath) && hash) {
        return;
      }

      // Animasi transisi keluar halaman
      e.preventDefault();
      page?.classList.add("page-leaving");
      setTimeout(() => {
        location.href = href;
      }, 260);
    });
  });

  // ==========================================================================
  // 5. TOMBOL SCROLL-TO-TOP (MODUL 05 & 10)
  // Tampil ketika scroll > 420px, scroll halus kembali ke atas
  // ==========================================================================
  const top = document.querySelector("[data-scroll-top]");
  const scrollHandler = () =>
    top?.classList.toggle("show", window.scrollY > 420);
  window.addEventListener("scroll", scrollHandler, { passive: true });
  scrollHandler();
  top?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  // Dynamic Year di footer
  document
    .querySelectorAll("footer [data-year]")
    .forEach((e) => (e.textContent = new Date().getFullYear()));

  // ==========================================================================
  // 6. ANIMASI REVEAL SAAT DIGULIR (INTERSECTION OBSERVER API)
  // ==========================================================================
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

  // ==========================================================================
  // 7. VALIDASI FORMULIR KONTAK SEMANTIK (MODUL 03 & MODUL 10)
  // Mencegah reload halaman (preventDefault), validasi regex, & feedback status
  // ==========================================================================
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const statusBox = document.querySelector("#contact-status");

    contactForm.addEventListener("submit", (e) => {
      // KUNCI MODUL 10: Mencegah reload bawaan browser saat submit
      e.preventDefault();

      // Mengambil nilai input dan membuang spasi kosong di ujung (trim)
      const nameInput = contactForm.querySelector("#contact-name");
      const emailInput = contactForm.querySelector("#contact-email");
      const subjectInput = contactForm.querySelector("#contact-subject");
      const messageInput = contactForm.querySelector("#contact-message");
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const subject = subjectInput ? subjectInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      // Regex pola format email standar W3C
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // VALIDASI 1: Pengecekan kolom kosong
      if (!name || !email || !subject || !message) {
        if (statusBox) {
          statusBox.className = "form-alert form-alert-error";
          // role="alert" memberi tahu Screen Reader secara otomatis ada error
          statusBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Harap isi semua kolom formulir.';
          statusBox.classList.remove("hidden");
          statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }

      // VALIDASI 2: Pengecekan keabsahan format email
      if (!emailRegex.test(email)) {
        if (statusBox) {
          statusBox.className = "form-alert form-alert-error";
          statusBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Format alamat email tidak valid.';
          statusBox.classList.remove("hidden");
          statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }

      // SIMULASI PENGIRIMAN: Tampilkan status loading pada tombol
      const origBtn = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengirim...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtn;
        if (statusBox) {
          statusBox.className = "form-alert form-alert-success";
          statusBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Terima kasih, ' + name + '! Pesan Anda telah terkirim.';
          statusBox.classList.remove("hidden");
        }
        // Bersihkan form setelah sukses (reset)
        contactForm.reset();
      }, 600);
    });
  }
});
