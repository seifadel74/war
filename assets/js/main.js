function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'ar', includedLanguages: 'en,ar'}, 'google_translate_element');
}

document.addEventListener("DOMContentLoaded", function () {
    // اللوجو
    const logo = document.querySelector(".logo");
    if (logo) {
        logo.classList.add("show");
        logo.classList.add("float");
    }

    // زر العودة للأعلى
    const scrollTopButton = document.getElementById("scrollTop");
    if (scrollTopButton) {
        window.addEventListener("scroll", function () {
            scrollTopButton.style.display = window.scrollY > 300 ? "block" : "none";
        });
        scrollTopButton.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // الترجمة
    const toggleLanguageButton = document.getElementById("toggle-language");
    if (toggleLanguageButton) {
        toggleLanguageButton.addEventListener("click", function() {
            let select = document.querySelector(".goog-te-combo");
            if (select) {
                select.value = select.value === "ar" ? "en" : "ar";
                select.dispatchEvent(new Event("change"));
            }
            let translateDiv = document.getElementById("google_translate_element");
            if (translateDiv) {
                translateDiv.classList.toggle("show");
            }
        });
    }

    // إغلاق الـ modals
    const closeButtons = document.querySelectorAll(".close-btn");
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".faq-card, .reset-password-modal");
            if (modal) {
                modal.classList.remove("show");
            }
        });
    });

    // فتح الأسئلة الشائعة
    const faqButton = document.querySelector(".faq-button");
    if (faqButton) {
        faqButton.addEventListener("click", () => {
            const faqModal = document.querySelector(".faq-card");
            if (faqModal) {
                faqModal.classList.add("show");
            }
        });
    }
});