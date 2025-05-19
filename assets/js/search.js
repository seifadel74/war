import { searchBooks } from '../api/api.js';

document.querySelector(".search-box")?.addEventListener("keypress", async function(event) {
    if (event.key === "Enter") {
        const query = this.value.trim().toLowerCase();
        if (!query) {
            alert("يرجى إدخال كلمة بحث");
            return;
        }
        const results = await searchBooks(query);
        localStorage.setItem('searchResults', JSON.stringify(results));
        window.location.href = `../pages/search-results.html?q=${encodeURIComponent(query)}`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes('search-results.html')) {
        const resultsContainer = document.getElementById("search-results");
        const results = JSON.parse(localStorage.getItem("searchResults") || "[]");
        resultsContainer.innerHTML = '';
        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>لا توجد نتائج للبحث.</p>";
            return;
        }
        results.forEach(book => {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book");
            bookDiv.innerHTML = `
                <img src="${book.image_url}" alt="${book.title}" loading="lazy">
                <p class="book-title">${book.title}</p>
                <p class="book-author">${book.author}</p>
            `;
            resultsContainer.appendChild(bookDiv);
        });
    }
});