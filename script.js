document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const searchBox = document.querySelector(".search-box");
    const booksContainer = document.querySelector(".books-container");
    const bookSlider = document.getElementById("book-slider");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const scrollTopButton = document.getElementById("scrollTop");
    const chatButton = document.getElementById("chat-button");
    const footer = document.querySelector(".footer");
    const socialIcons = document.querySelectorAll(".social-icon");
    const footerLinks = document.querySelectorAll(".footer-links ul li a");

    // API Base URL (replace with production URL when deploying)
    const API_BASE_URL = "http://127.0.0.1:8000/api";

    // Search Functionality
    if (searchBox) {
        searchBox.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                const query = this.value.trim();
                if (query) {
                    // استخدام النص كما هو بدون تحويل إلى lowercase
                    const encodedQuery = encodeURIComponent(query);
                    window.location.href = `search-results.html?q=${encodedQuery}`;
                }
            }
        });
        
        // إضافة بحث فوري أثناء الكتابة
        searchBox.addEventListener("input", function (event) {
            const query = this.value.trim();
            if (query.length >= 1) { // البحث من الحرف الأول
                // يمكن إضافة بحث فوري هنا إذا كان مطلوباً
                console.log("Searching for:", query);
            }
        });
    }

    // Navigation Helper
    function navigateTo(page) {
        window.location.href = page;
    }

    // Logo Animation
    const logo = document.querySelector(".logo");
    if (logo) {
        logo.classList.add("show");
        logo.classList.add("pulsing");
    }

    // Book Card Hover Effects
    const books = document.querySelectorAll(".book-card");
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

    // Display Books in Main Container
    function displayBooks(books) {
        if (!booksContainer) return;
        booksContainer.innerHTML = "";
        const row = document.createElement("div");
        row.className = "row";
        if (!Array.isArray(books) || books.length === 0) {
            booksContainer.innerHTML = '<p style="color: #E8ECEC; text-align: center;">لا توجد كتب متاحة.</p>';
            return;
        }
        books.slice(0, 20).forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.className = "book-card";
            bookCard.innerHTML = `
                <img src="${book.image}" alt="${book.title || 'كتاب بدون عنوان'}" class="book" onclick="openBookDetails('${book.id}')">
                <p class="book-title">${book.title || 'عنوان غير متاح'}</p>
                <p class="book-author">${book.author || 'غير معروف'}</p>
            `;
            const bookLink = document.createElement("a");
            bookLink.href = `book-details.html?id=${book.id}`;
            bookLink.className = "book-link";
            bookLink.setAttribute("aria-label", `عرض تفاصيل كتاب ${book.title || 'غير معروف'}`);
            bookLink.appendChild(bookCard);
            row.appendChild(bookLink);
        });
        booksContainer.appendChild(row);
    }

    // Display Suggested Books in Slider
    function displaySuggestedBooks(books) {
        if (!bookSlider) return;
        bookSlider.innerHTML = "";
        if (!Array.isArray(books) || books.length === 0) {
            bookSlider.innerHTML = '<p style="color: #E8ECEC; text-align: center;">لا توجد مقترحات متاحة.</p>';
            return;
        }
        // ترتيب الكتب بشكل عشوائي
        const shuffledBooks = books.sort(() => Math.random() - 0.5);
        shuffledBooks.slice(0, 15).forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.className = "book-card slider-card";
            bookCard.innerHTML = `
                <img src="${book.image || 'images/default-book.jpg'}" alt="${book.title || 'كتاب بدون عنوان'}" class="book" onclick="openBookDetails('${book.id}')">
                <p class="book-title">${book.title || 'عنوان غير متاح'}</p>
                <p class="book-author">${book.author || 'غير معروف'}</p>
            `;
            const bookLink = document.createElement("a");
            bookLink.href = `book-details.html?id=${book.id}`;
            bookLink.className = "book-link";
            bookLink.setAttribute("aria-label", `عرض تفاصيل كتاب ${book.title || 'غير معروف'}`);
            bookLink.appendChild(bookCard);
            bookSlider.appendChild(bookLink);
        });
    }

    // Fetch Books from API
    async function fetchBooks(category) {
        if (!booksContainer) return;
        booksContainer.innerHTML = '<p style="color: #E8ECEC; text-align: center;">جارٍ تحميل الكتب...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/books?category=${category}&limit=4&random=true`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log("API Response booksData (fetchBooks):", data);
            const booksToRender = Array.isArray(data) ? data : (data.books && Array.isArray(data.books) ? data.books : []);

            if (booksToRender.length > 0) {
                displayBooks(booksToRender);
            } else {
                throw new Error("No books data found or data is not an array.");
            }
        } catch (error) {
            console.error("خطأ في جلب البيانات:", error);
            booksContainer.innerHTML = '<p style="color: #E8ECEC; text-align: center;">فشل في تحميل الكتب، حاول لاحقًا.</p>';
        }
    }

    // Fetch Suggested Books from API
    async function fetchSuggestedBooks() {
        if (!bookSlider) return;
        bookSlider.innerHTML = '<p style="color: #E8ECEC; text-align: center;">جارٍ تحميل المقترحات...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/books?category=suggested&limit=5`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log("API Response suggestedBooksData (fetchSuggestedBooks):", data);
            const suggestedBooksToRender = Array.isArray(data) ? data : (data.books && Array.isArray(data.books) ? data.books : []);

            if (suggestedBooksToRender.length > 0) {
                displaySuggestedBooks(suggestedBooksToRender);
                setupSlider();
            } else {
                throw new Error("No suggested books data found or data is not an array.");
            }
        } catch (error) {
            console.error("خطأ في جلب المقترحات:", error);
            bookSlider.innerHTML = '<p style="color: #E8ECEC; text-align: center;">فشل في تحميل المقترحات، حاول لاحقًا.</p>';
        }
    }

    // Slider Setup with Smooth Transform
    function setupSlider() {
        const slides = document.querySelectorAll(".slider-card");
        if (!slides.length || !prevBtn || !nextBtn) return;

        const slideWidth = slides[0].offsetWidth + 16; // 16 = margin/gap تقريبًا

        prevBtn.onclick = () => {
            bookSlider.scrollBy({ left: -slideWidth, behavior: "smooth" });
        };
        nextBtn.onclick = () => {
            bookSlider.scrollBy({ left: slideWidth, behavior: "smooth" });
        };

        // إضافة تأثيرات للكروت
        slides.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
                card.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
                card.style.zIndex = '1';
            });
        });
    }

    // Category Links
    document.querySelectorAll(".book-category a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const category = this.getAttribute("href").substring(1);
            if (category === "latest-books") fetchBooks("latest");
            else if (category === "famous-books") fetchBooks("famous");
            else if (category === "most-read") fetchBooks("most-read");
        });
    });

    // Initial Load
    fetchBooks("latest");
    fetchSuggestedBooks();

    // Scroll-to-Top Button
    if (scrollTopButton) {
        window.addEventListener("scroll", function () {
            scrollTopButton.style.display = window.scrollY > 300 ? "block" : "none";
        });

        scrollTopButton.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    }

    // Footer Visibility and Effects
    if (footer) {
        function checkFooterVisibility() {
            const footerPosition = footer.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            if (footerPosition < screenHeight - 100) {
                footer.classList.add("visible");
            }
        }
        window.addEventListener("scroll", checkFooterVisibility);
        checkFooterVisibility();
    }

    socialIcons.forEach((icon) => {
        icon.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.2) rotate(5deg)";
            this.style.boxShadow = "0 4px 10px rgba(255, 255, 255, 0.5)";
        });
        icon.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1) rotate(0deg)";
            this.style.boxShadow = "none";
        });
    });

    footerLinks.forEach((link) => {
        link.addEventListener("mouseenter", function () {
            this.style.color = "#ff5733";
            this.style.textShadow = "0px 0px 10px rgba(255, 87, 51, 0.8)";
        });
        link.addEventListener("mouseleave", function () {
            this.style.color = "#05A099";
            this.style.textShadow = "none";
        });
    });

    // Chatbot Functionality
    function appendMessage(sender, text, className) {
        const messagesDiv = document.getElementById("chat-messages");
        if (messagesDiv) {
            const messageEl = document.createElement("div");
            messageEl.className = `message ${className}`;
            messageEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
            messagesDiv.appendChild(messageEl);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    async function sendMessage() {
        const inputField = document.getElementById("user-text");
        if (!inputField) return;

        const message = inputField.value.trim();
        if (!message) return;

        appendMessage("أنت", message, "user");
        inputField.value = "";
        inputField.disabled = true;

        try {
            const STREAMLIT_API_ENDPOINT = "https://your-streamlit-app.com/api/chat"; // Replace with actual endpoint
            const response = await fetch(STREAMLIT_API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": "Bearer YOUR_STREAMLIT_API_KEY" // Uncomment and add API key if required
                },
                body: JSON.stringify({
                    message: message,
                    context: "أنت مساعد مفيد لموقع Digital Literature Library System. أنصح بالكتب وأجيب عن الأسئلة المتعلقة بالأنواع، الملخصات، إلخ.",
                }),
            });

            if (!response.ok) {
                throw new Error(`خطأ من السيرفر: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.reply || "عذراً، لا يمكنني الرد الآن.";
            appendMessage("Digital Literature Library System", botReply, "bot");
        } catch (error) {
            console.error("Error:", error);
            appendMessage("Digital Literature Library System", "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى لاحقاً.", "bot");
        } finally {
            inputField.disabled = false;
            inputField.focus();
        }
    }

    if (chatButton) {
        chatButton.addEventListener("click", (event) => {
            event.stopPropagation();
            window.open("chat.html", "_blank");
        });
    }

    // Chat Input Handling
    const userInputButton = document.querySelector("#user-input button");
    if (userInputButton) {
        userInputButton.addEventListener("click", sendMessage);
        document.getElementById("user-text")?.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        });
    }

    // جلب مسار صورة البروفايل من localStorage (أو أي مكان تحفظ فيه المسار)
    let profileImg = localStorage.getItem('userAvatar');
    const navProfileImg = document.getElementById('navProfileImg');
    if (profileImg && profileImg.trim() !== '') {
        navProfileImg.src = profileImg;
    } else {
        navProfileImg.src = 'images/avatar-placeholder.png'; // الصورة الافتراضية
    }

    // Function to handle auth buttons visibility
    function updateAuthButtonsVisibility() {
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        const profileNavIcon = document.getElementById('profileNavIcon');
        
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'flex';
        if (signupBtn) signupBtn.style.display = isLoggedIn ? 'none' : 'flex';
        if (profileNavIcon) profileNavIcon.style.display = isLoggedIn ? 'flex' : 'none';
    }

    // Add click event listener to profile icon to open profile page
    const profileNavIcon = document.getElementById('profileNavIcon');
    if (profileNavIcon) {
        profileNavIcon.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }

    // Initialize auth buttons state
    updateAuthButtonsVisibility();

    // Update profile image if exists
    const img = document.getElementById('navProfileImg');
    const userImg = localStorage.getItem('userImage') || sessionStorage.getItem('userImage') || localStorage.getItem('profileImage') || sessionStorage.getItem('profileImage');
    if (img && userImg && userImg.length > 5) {
        img.src = userImg;
    }

    // إظهار زر الناشر فقط إذا كان الدور publisher
    const publisherIcon = document.querySelector('.publisher-icon');
    const userRole = localStorage.getItem('role');
    if (publisherIcon) {
        if (userRole === 'publisher') {
            publisherIcon.classList.remove('hidden');
            publisherIcon.style.display = 'inline-flex';
        } else {
            publisherIcon.classList.add('hidden');
            publisherIcon.style.display = 'none';
        }
    }
});

// Open Book Details Page
function openBookDetails(bookId) {
    window.location.href = `book-details.html?id=${bookId}`;
}

// دالة البحث المحسنة - يمكن استخدامها في أي مكان
function enhancedSearch(books, searchQuery) {
    if (!searchQuery || searchQuery.trim() === '') {
        return books;
    }

    const query = searchQuery.trim().toLowerCase();
    
    return books.filter(book => {
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();
        
        // البحث بالكلمة الكاملة (أحرف كبيرة أو صغيرة)
        if (title.includes(query) || author.includes(query)) {
            return true;
        }
        
        // البحث بالحرف الأول من العنوان
        if (title.startsWith(query)) {
            return true;
        }
        
        // البحث بالحرف الأول من اسم المؤلف
        if (author.startsWith(query)) {
            return true;
        }
        
        // البحث في كلمات العنوان المنفصلة
        const titleWords = title.split(/\s+/);
        if (titleWords.some(word => word.startsWith(query))) {
            return true;
        }
        
        // البحث في كلمات اسم المؤلف المنفصلة
        const authorWords = author.split(/\s+/);
        if (authorWords.some(word => word.startsWith(query))) {
            return true;
        }
        
        return false;
    });
}

// دالة للبحث الفوري (إذا كان مطلوباً)
function performInstantSearch(query, booksContainer) {
    if (!query || query.trim() === '') {
        return;
    }
    
    // يمكن إضافة منطق البحث الفوري هنا
    console.log("Performing instant search for:", query);
    
    // مثال على البحث الفوري
    fetch(`${API_BASE_URL}/books?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const books = data.results || data.books || [];
            const filteredBooks = enhancedSearch(books, query);
            
            if (filteredBooks.length > 0) {
                displayBooks(filteredBooks);
            } else {
                booksContainer.innerHTML = '<p style="color: #E8ECEC; text-align: center;">لا توجد نتائج مطابقة.</p>';
            }
        })
        .catch(error => {
            console.error("Error in instant search:", error);
        });
}
