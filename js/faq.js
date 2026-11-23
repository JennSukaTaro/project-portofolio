/**
 * ============================================================================
 * MODUL 10: JAVASCRIPT DOM & EVENT HANDLING
 * Fitur: FAQ Accordion dengan Arsitektur Event Delegation
 * ============================================================================
 * 
 * FUNGSI UTAMA:
 * - Menangani interaksi buka-tutup (accordion) pada pertanyaan FAQ.
 * 
 * MENGAPA MENGGUNAKAN EVENT DELEGATION? (Pertanyaan Dosen M10):
 * Alih-alih memasang event listener pada setiap tombol pertanyaan satu per satu
 * menggunakan forEach(), kita cukup memasang SATU event listener pada kontainer
 * induk `[data-faq-list]`. Teknik ini memanfaatkan 'Event Bubbling' (event klik
 * dari tombol merambat naik ke induk).
 * - Keuntungan: Sangat hemat alokasi memori browser, dan jika ada item FAQ baru
 *   yang ditambahkan secara dinamis, tombol baru tersebut otomatis langsung berfungsi.
 * 
 * FITUR AKSESIBILITAS (MODUL 07 - A11y):
 * - Memperbarui atribut WAI-ARIA `aria-expanded="true"` / `"false"` saat item
 *   dibuka/ditutup agar pengguna tunanetra dengan Screen Reader mengetahui statusnya.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Seleksi kontainer induk FAQ (Modul 10: querySelector)
  const faqContainer =
    document.querySelector("[data-faq-list]") ||
    document.querySelector(".faq-list") ||
    document.querySelector("main");

  // 2. Pasang satu listener pada elemen induk (Event Delegation)
  faqContainer?.addEventListener("click", (e) => {
    // Cari tombol pemicu terdekat dari target yang diklik (menggunakan closest)
    const button = e.target.closest("[data-faq-button]");
    if (!button) return; // Abaikan jika klik di luar tombol FAQ

    const item = button.closest(".faq-item");
    if (!item) return;

    const isOpen = item.classList.contains("open");

    // 3. Pola Eksklusif Accordion: Tutup semua item FAQ lain yang sedang terbuka
    document.querySelectorAll(".faq-item.open").forEach((x) => {
      x.classList.remove("open");
      // Update atribut aksesibilitas WAI-ARIA menjadi false
      x.querySelector("[data-faq-button]")?.setAttribute(
        "aria-expanded",
        "false",
      );
    });

    // 4. Jika item yang diklik sebelumnya tertutup, sekarang buka
    if (!isOpen) {
      item.classList.add("open");
      // Beri tahu Screen Reader bahwa item ini sekarang terbuka (Modul 07)
      button.setAttribute("aria-expanded", "true");
    }
  });
});
