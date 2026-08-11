const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");

const tableRows = document.querySelectorAll("tbody tr");

let currentSearch = "";

let currentFilter = "all";

function updateTable() {

    tableRows.forEach((row) => {

        const alias = row.dataset.alias;

        const status = row.dataset.status;

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

}

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        updateTable();

    });

});

searchInput.addEventListener("input", () => {

    currentSearch =
        searchInput.value
            .toLowerCase()
            .trim();

    updateTable();

});