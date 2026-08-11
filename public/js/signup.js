
document.querySelectorAll(".toggle-password").forEach(toggle => {

    toggle.addEventListener("click", () => {

        const input = toggle.previousElementSibling;
        const icon = toggle.querySelector("i");

        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";

        icon.classList.toggle("bi-eye");
        icon.classList.toggle("bi-eye-slash");

    });

});

const signupForm = document.getElementById("signupForm");

const signupBtn = document.getElementById("signupBtn");

signupForm.addEventListener("submit", (e) => {

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        e.preventDefault();

        showToast("❌ Passwords do not match.");

        return;

    }

    signupBtn.disabled = true;

    signupBtn.textContent = "Creating Account...";

});