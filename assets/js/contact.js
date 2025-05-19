import { contact } from '../api/api.js';

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = contactForm.querySelector("input[type='text']").value;
            const email = contactForm.querySelector("input[type='email']").value;
            const message = contactForm.querySelector("textarea").value;
            const response = await contact(name, email, message);
            if (response) {
                alert("تم إرسال رسالتك بنجاح!");
                contactForm.reset();
            } else {
                alert("فشل إرسال الرسالة. حاول مرة أخرى.");
            }
        });
    }
});