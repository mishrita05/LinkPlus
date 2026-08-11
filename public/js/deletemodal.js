const modal = document.getElementById("deleteModal");

const cancelBtn = document.getElementById("cancelDelete");

const confirmBtn = document.getElementById("confirmDelete");

const deleteForms = document.querySelectorAll(".delete-form");

let selectedForm = null;

deleteForms.forEach((form)=>{

    form.addEventListener("submit",(e)=>{

        e.preventDefault();

        selectedForm = form;

        modal.classList.add("show");

    });

});

cancelBtn.addEventListener("click",()=>{

    modal.classList.remove("show");

});

confirmBtn.addEventListener("click",()=>{

    if(selectedForm){

        selectedForm.submit();

    }

});