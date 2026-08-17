const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(
    ".filter-btn, .shortcuts-filter-btn"
);

const tableRows = document.querySelectorAll("tbody tr");
const shortcutCards = document.querySelectorAll(".shortcut-card");

let currentSearch = "";
let currentFilter = "all";

function updateResults() {

    // My URLs page
    tableRows.forEach((row) => {

        const alias = row.dataset.alias || "";
        const status = row.dataset.status || "";

        const matchesSearch =
            alias.includes(currentSearch);

        const matchesFilter =
            currentFilter === "all" ||
            status === currentFilter;

        row.style.display =
            matchesSearch && matchesFilter
                ? ""
                : "none";
    });


    // My Shortcuts page
    shortcutCards.forEach((card) => {

        const name = card.dataset.name || "";
        const status = card.dataset.status || "";

        const matchesSearch =
            name.includes(currentSearch);

        const matchesFilter =
            currentFilter === "all" ||
            status === currentFilter;

        card.style.display =
            matchesSearch && matchesFilter
                ? ""
                : "none";
    });
}


// Filter buttons
filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        // Clicking "All" shows everything
        // and clears the search.
        if (currentFilter === "all") {

            currentSearch = "";

            if (searchInput) {
                searchInput.value = "";
            }
        }

        updateResults();
    });

});


// Search
if (searchInput) {

    searchInput.addEventListener("input", () => {

        currentSearch =
            searchInput.value
                .toLowerCase()
                .trim();

        updateResults();

    });

}