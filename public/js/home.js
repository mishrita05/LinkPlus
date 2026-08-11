const suggestBtn = document.getElementById("suggestAliasBtn");
const originalUrl = document.getElementById("originalUrl");
const customAlias = document.getElementById("customAlias");
const suggestionsDiv = document.getElementById("aliasSuggestions");

suggestBtn.addEventListener("click", async () => {

    if (!originalUrl.value.trim()) {

        showToast("⚠ Please enter a URL first.", "warning");

        originalUrl.focus();

        return;

    }
    suggestBtn.disabled = true;
    suggestBtn.textContent = "Generating...";
    suggestionsDiv.innerHTML = `
        <p class="loading-text">
            ✨ AI is generating suggestions...
        </p>
    `;

    try {

        const response = await fetch("/url/suggest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: originalUrl.value,
            }),
        });

        const data = await response.json();

        suggestionsDiv.innerHTML = "";

        data.aliases.forEach((alias) => {

            const button = document.createElement("button");
            button.className = "alias-chip";
            button.type = "button";
            button.innerText = alias;

            button.addEventListener("click", () => {
                customAlias.value = alias;
            });

            suggestionsDiv.appendChild(button);

        });

    }
    catch(error){

        suggestionsDiv.innerHTML = "Unable to generate aliases.";

    }
    finally{

        suggestBtn.disabled = false;
        suggestBtn.textContent = "✨ Suggest Alias";

    }

});