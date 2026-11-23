/**
 * ============================================================================
 * MODUL 10: JAVASCRIPT DOM & EVENT HANDLING
 * Fitur: Detail Proyek Interaktif (Modal Dialog) dengan Event Delegation
 * ============================================================================
 * 
 * FUNGSI UTAMA:
 * - Membaca metadata proyek dari atribut HTML5 `data-*` pada kartu portofolio.
 * - Menampilkan detail proyek tersebut ke dalam modal pop-up secara dinamis.
 * 
 * MENGAPA textContent, BUKAN innerHTML? (Pertanyaan Keamanan M10):
 * - Menggunakan `element.textContent` adalah standar pencegahan serangan
 *   XSS (Cross-Site Scripting). Browser memperlakukan data sebagai teks murni
 *   sehingga skrip berbahaya tidak dapat dieksekusi.
 * 
 * FITUR AKSESIBILITAS MODAL (MODUL 07 - A11y):
 * - Mendukung tombol keyboard `Escape` untuk menutup modal tanpa mouse.
 * - Mengunci scroll latar belakang (`overflow-hidden`) saat modal aktif agar
 *   pengguna tidak bingung saat menggulir layar.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Seleksi elemen modal dan kontainer portofolio
  const modal = document.querySelector("[data-project-modal]");
  const container =
    document.querySelector("[data-portfolio-container]") ||
    document.querySelector("main");

  // 2. Fungsi untuk menutup modal dan mengembalikan scroll layar
  const close = () => {
    modal?.classList.remove("active");
    document.body.classList.remove("overflow-hidden");
  };

  // 3. Kamus pemetaan (mapping) antara atribut dataset kartu dengan elemen modal
  const map = {
    title: "project-title",
    category: "project-category",
    year: "project-year",
    duration: "project-duration",
    description: "project-description",
    role: "project-role",
    tools: "project-tools",
    problem: "project-problem",
    process: "project-process",
    solution: "project-solution",
    result: "project-result",
    lessons: "project-lessons",
  };

  // 4. EVENT DELEGATION: Satu listener pada kontainer portofolio
  container?.addEventListener("click", (e) => {
    // Deteksi apakah tombol [data-project] yang diklik (atau elemen di dalamnya)
    const btn = e.target.closest("[data-project]");
    if (!btn) return; // Jika klik bukan pada kartu proyek, abaikan

    // Iterasi kamus map dan isi teks modal secara aman dengan textContent
    Object.entries(map).forEach(([key, selector]) => {
      const el = document.querySelector(`[data-${selector}]`);
      if (el) el.textContent = btn.dataset[key] || "—";
    });

    // Tampilkan modal dan kunci scroll latar belakang
    modal?.classList.add("active");
    document.body.classList.add("overflow-hidden");
  });

  // 5. Tombol Close (X) di dalam modal
  document
    .querySelector("[data-project-close]")
    ?.addEventListener("click", close);

  // 6. Klik pada area latar belakang (backdrop) untuk menutup modal
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // 7. AKSESIBILITAS KEYBOARD (MODUL 07): Menutup modal dengan tombol Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
