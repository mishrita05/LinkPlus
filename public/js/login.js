const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const icon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {

    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";

    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");

});

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");

loginForm.addEventListener("submit", () => {

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

});