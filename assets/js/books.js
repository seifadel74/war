import { fetchBooks } from '../api/api.js';

document.addEventListener("DOMContentLoaded", function () {
    const bookSlider = document.getElementById("book-slider");
    const booksContainer = document.getElementById("books-container");
    const novelsContainer = document.getElementById("novels-container");
    const storiesContainer = document.getElementById("stories-container");
    const referencesContainer = document.getElementById("references-container");

    async function renderBooks(container, category = '') {
        if (!container) return;
        container.innerHTML = '<p>جاري تحميل الكتب...</p>';
        const books = await fetchBooks(category);
        container.innerHTML = '';
        if (books.length === 0) {
            container.innerHTML = '<p>لا توجد كتب متاحة.</p>';
            return;
        }
        books.forEach(book => {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book");
            bookDiv.innerHTML = `
                <img src="${book.image_url}" alt="${book.title}" loading="lazy">
                <p class="book-title">${book.title}</p>
                <p class="book-author">${book.author}</p>
            `;
            container.appendChild(bookDiv);
        });
    }

    if (bookSlider) renderBooks(bookSlider);
    if (booksContainer) renderBooks(booksContainer);
    if (novelsContainer) renderBooks(novelsContainer, 'novels');
    if (storiesContainer) renderBooks(storiesContainer, 'stories');
    if (referencesContainer) renderBooks(referencesContainer, 'references');

    // تأثير الكروت
    const books = document.querySelectorAll(".book");
    books.forEach((book) => {
        book.addEventListener("mouseover", () => {
            book.style.transform = "scale(1.1) rotate(3deg)";
            book.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
        });
        book.addEventListener("mouseout", () => {
            book.style.transform = "scale(1) rotate(0deg)";
            book.style.boxShadow = "none";
        });
    });

    // التنقل في السلايدر
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    if (bookSlider && prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            bookSlider.scrollBy({ left: -200, behavior: "smooth" });
        });
        nextBtn.addEventListener("click", () => {
            bookSlider.scrollBy({ left: 200, behavior: "smooth" });
        });
    }
});