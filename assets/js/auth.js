import { login, signup, resetPassword } from '../api/api.js';

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const resetPasswordForm = document.getElementById("reset-password-form");
    const forgotPasswordLink = document.querySelector(".forgot-password");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector("input[type='email']").value;
            const password = loginForm.querySelector("input[type='password']").value;
            const response = await login(email, password);
            if (response) {
                alert("تم تسجيل الدخول بنجاح!");
                window.location.href = "../pages/index.html";
            } else {
                alert("فشل تسجيل الدخول. تحقق من بياناتك.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = signupForm.querySelector("input[type='text']").value;
            const email = signupForm.querySelector("input[type='email']").value;
            const password = signupForm.querySelector("input[type='password']").value;
            const response = await signup(name, email, password);
            if (response) {
                alert("تم إنشاء الحساب بنجاح!");
                window.location.href = "../pages/login.html";
            } else {
                alert("فشل إنشاء الحساب. حاول مرة أخرى.");
            }
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", (e) => {
            e.preventDefault();
            const modal = document.querySelector(".reset-password-modal");
            if (modal) {
                modal.classList.add("show");
            }
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = resetPasswordForm.querySelector("input[type='email']").value;
            const response = await resetPassword(email);
            if (response) {
                alert("تم إرسال رابط إعادة تعيين كلمة المرور!");
                resetPasswordForm.closest(".reset-password-modal").classList.remove("show");
            } else {
                alert("فشل إرسال الرابط. تحقق من البريد الإلكتروني.");
            }
        });
    }
});