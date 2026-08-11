function copyUrl() {

    const shortUrl = document.getElementById("shortUrl").innerText;

    navigator.clipboard.writeText(shortUrl)
        .then(() => {
            showToast("✅ Short URL copied successfully!");
        })
        .catch((err) => {
            console.error(err);
        });

}

const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {

    button.addEventListener("click", async (event) => {

        event.preventDefault();

        const shortUrl = button.dataset.shortUrl;

        try {

            await navigator.clipboard.writeText(shortUrl);

            showToast("✅ Short URL copied successfully!");
            
        } catch (err) {

            console.error(err);

            showToast("❌ Failed to copy URL.");

        }

    });

});