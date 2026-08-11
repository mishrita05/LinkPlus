const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2500);

}