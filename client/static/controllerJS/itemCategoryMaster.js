window.addEventListener("load",()=>{

    refreshItemCategoryForm();
    refreshItemCategoryTable();



})


const refreshItemCategoryForm = ()=>{
    itemCategoryMaster = new Object();

    texCategoryName.style.border="1px solid #ced4da";
    texCategoryCode.style.border="1px solid #ced4da";
    selectCategoryStatus.style.border="1px solid #ced4da";


    texCategoryName.value=""
    texCategoryCode.value=""
    selectCategoryStatus.value=1


}




const refreshItemCategoryTable = async ()=>{

    const itemCategoryList = await getAllItemCategories();
    console.log(itemCategoryList);

    const tableBody = document.getElementById("itemTableBody");
    tableBody.innerHTML = ""

    itemCategoryList.items.forEach((category,index)=>{

        const row = document.createElement("tr");

        const idCell = document.createElement("td")
        idCell.textContent = index+1;

        const categoryNameCell = document.createElement("td");
        categoryNameCell.textContent=category.item_category_master_name;

        const categoryCodeCell = document.createElement("td");
        categoryCodeCell.textContent=category.item_category_master_code;

        const categoryAddedDateCell = document.createElement("td");
        categoryAddedDateCell.textContent=category.item_category_master_added_date;

        const categoryStatusCell = document.createElement("td");
        categoryStatusCell.textContent=category.item_category_master_status === "1" ? "Active" : "inactive";


        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillItemCategoryMaster(category);
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printItemCategoryMaster(category);
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteItemCategoryMaster(category);
        }

        row.appendChild(idCell);
        row.appendChild(categoryNameCell);
        row.appendChild(categoryCodeCell);
        row.appendChild(categoryAddedDateCell);
        row.appendChild(categoryStatusCell);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);




    })








}




const refillItemCategoryMaster = ()=>{

}
const printItemCategoryMaster = ()=>{

}
const deleteItemCategoryMaster = ()=>{

}





