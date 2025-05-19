document.addEventListener("DOMContentLoaded", async function () {
    const authorsContainer = document.getElementById("authors-container");
    if (!authorsContainer) {
        console.error("خطأ: العنصر authors-container غير موجود في الـ DOM");
        return;
    }

    authorsContainer.innerHTML = '<p>جاري تحميل المؤلفين...</p>';

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('https://your-backend.com/api/authors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`فشل جلب المؤلفين: ${response.status} ${response.statusText}`);
        }

        let authors;
        try {
            authors = await response.json();
        } catch (e) {
            throw new Error('فشل تحويل الـ response إلى JSON: ' + e.message);
        }

        if (!Array.isArray(authors)) {
            throw new Error('البيانات المرجعة ليست قائمة (array): ' + JSON.stringify(authors));
        }

        authorsContainer.innerHTML = '';
        if (authors.length === 0) {
            authorsContainer.innerHTML = '<p>لا توجد بيانات للمؤلفين.</p>';
            console.warn('تحذير: الـ API رجع قائمة فاضية');
            return;
        }

        authors.forEach((author, index) => {
            if (!author.name) {
                console.warn(`تحذير: المؤلف رقم ${index} بدون اسم:`, author);
                return;
            }

            const authorDiv = document.createElement("div");
            authorDiv.classList.add("author");
            authorDiv.innerHTML = `
                <img src="${author.image_url || '../assets/images/default-author.png'}" 
                     alt="${author.name}" 
                     loading="lazy"
                     onerror="this.src='../assets/images/default-author.png'; console.error('فشل تحميل صورة المؤلف:', '${author.image_url || 'غير متوفرة'}')">
                <p class="author-name">${author.name}</p>
                <p class="author-bio">${author.bio || 'لا توجد سيرة ذاتية متاحة'}</p>
            `;
            authorsContainer.appendChild(authorDiv);
        });

        const authorCards = document.querySelectorAll(".author");
        if (authorCards.length === 0) {
            console.warn("تحذير: لا توجد كروت مؤلفين لإضافة تأثيرات hover");
        }
        authorCards.forEach((author, index) => {
            author.addEventListener("mouseover", () => {
                author.style.transform = "translateY(-5px)"; /* تماشي مع الـ CSS */
                author.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
                console.log(`Hover على المؤلف رقم ${index}`);
            });
            author.addEventListener("mouseout", () => {
                author.style.transform = "translateY(0)";
                author.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.1)";
            });
        });

        console.log("تم تحميل المؤلفين بنجاح:", authors.length);

    } catch (error) {
        console.error('خطأ في جلب المؤلفين:', error.message);
        authorsContainer.innerHTML = '<p>فشل تحميل المؤلفين. حاول لاحقًا.</p>';
        if (error.name === 'AbortError') {
            authorsContainer.innerHTML += '<p>انتهت مهلة الطلب. تحقق من الاتصال بالإنترنت.</p>';
        }
    }
});