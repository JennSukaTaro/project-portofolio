/**
 * ============================================================================
 * MODUL 10 & MODUL 11: DOM EVENT DELEGATION & GALLERY PERFORMANCE
 * Fitur: Filter Kategori Galeri & Pratinjau Modal Gambar
 * ============================================================================
 * 
 * FUNGSI UTAMA:
 * 1. Menyaring tampilan karya (Semua / Foto / Video) tanpa reload halaman.
 * 2. Membuka modal popup pratinjau gambar saat kartu foto diklik.
 * 3. Membedakan tautan eksternal (video Instagram) agar terbuka di tab baru.
 * 
 * ARSITEKTUR EVENT DELEGATION (MODUL 10):
 * - Filter: Listener dipasang pada kontainer `[data-gallery-filters]`.
 * - Grid Galeri: Listener dipasang pada kontainer grid `[data-gallery-grid]`.
 * 
 * AKSESIBILITAS MODAL (MODUL 07):
 * - Mendukung tombol Escape dan klik area luar (backdrop) untuk menutup dialog.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Seleksi kontainer induk dan elemen modal
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

  // ==========================================================================
  // 1. EVENT DELEGATION: Filter Kategori (All / Photo / Video)
  // ==========================================================================
  filterContainer?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gallery-filter]");
    if (!btn) return;

    // Tandai tombol filter yang aktif
    document
      .querySelectorAll("[data-gallery-filter]")
      .forEach((x) => x.classList.toggle("active", x === btn));

    // Filter elemen galeri berdasarkan kategori
    const f = btn.dataset.galleryFilter;
    items.forEach((item) => {
      // Jika 'all', tampilkan semua. Jika bukan, sembunyikan yang kategorinya tidak cocok
      const hide = f !== "all" && item.dataset.galleryCategory !== f;
      item.classList.toggle("is-hidden", hide);
    });
  });

  // ==========================================================================
  // 2. EVENT DELEGATION: Pratinjau Modal Galeri Gambar
  // ==========================================================================
  galleryGrid?.addEventListener("click", (e) => {
    const item = e.target.closest("[data-gallery-category]");
    // Abaikan jika item bukan kartu galeri atau jika item adalah link eksternal (video)
    if (!item || item.dataset.galleryExternal === "true") return;

    // Pasang sumber gambar WebP dan deskripsi ke dalam modal
    if (image) {
      image.src = item.dataset.image;
      image.alt = item.dataset.title || "Gallery item";
    }
    // Keamanan XSS: gunakan textContent untuk teks dinamis
    if (title) title.textContent = item.dataset.title;
    if (desc) desc.textContent = item.dataset.description;
    if (category) category.textContent = item.dataset.galleryCategory;

    // Buka modal dialog
    modal?.classList.add("active");
    document.body.classList.add("overflow-hidden");
  });

  // Fungsi menutup modal
  const close = () => {
    modal?.classList.remove("active");
    document.body.classList.remove("overflow-hidden");
  };

  // Tombol X close
  document
    .querySelector("[data-gallery-close]")
    ?.addEventListener("click", close);

  // Klik backdrop luar
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // Tombol Escape keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
