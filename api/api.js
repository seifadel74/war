const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function fetchBooks(category = '', page = 1, limit = 10) {
    try {
        const url = category ? `${API_BASE_URL}/books?category=${category}&page=${page}&limit=${limit}` : `${API_BASE_URL}/books?page=${page}&limit=${limit}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer your-token' // أضف التوكن لو لازم
            }
        });
        if (!response.ok) throw new Error('فشل جلب الكتب');
        return await response.json();
    } catch (error) {
        console.error('خطأ في جلب الكتب:', error);
        return [];
    }
}

async function searchBooks(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer your-token'
            }
        });
        if (!response.ok) throw new Error('فشل البحث');
        return await response.json();
    } catch (error) {
        console.error('خطأ في البحث:', error);
        return [];
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('فشل تسجيل الدخول');
        return await response.json();
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        return null;
    }
}

async function signup(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        if (!response.ok) throw new Error('فشل إنشاء الحساب');
        return await response.json();
    } catch (error) {
        console.error('خطأ في إنشاء الحساب:', error);
        return null;
    }
}

async function resetPassword(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        if (!response.ok) throw new Error('فشل إرسال رابط إعادة تعيين كلمة المرور');
        return await response.json();
    } catch (error) {
        console.error('خطأ في إعادة تعيين كلمة المرور:', error);
        return null;
    }
}

async function contact(name, email, message) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message })
        });
        if (!response.ok) throw new Error('فشل إرسال الرسالة');
        return await response.json();
    } catch (error) {
        console.error('خطأ في إرسال الرسالة:', error);
        return null;
    }
}

export { fetchBooks, searchBooks, login, signup, resetPassword, contact };