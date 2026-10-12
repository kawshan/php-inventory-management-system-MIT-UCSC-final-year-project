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

    });

    new DataTable('#tableItemCategoryMaster', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });
}




const refillItemCategoryMaster = (obj)=>{
    itemCategoryMaster = JSON.parse(JSON.stringify(obj));
    oldItemCategoryMaster = JSON.parse(JSON.stringify(obj));

    texCategoryName.value=itemCategoryMaster.item_category_master_name;
    texCategoryCode.value=itemCategoryMaster.item_category_master_code;
    selectCategoryStatus.value = itemCategoryMaster.item_category_master_status;


}
const printItemCategoryMaster = (obj)=>{

}
const deleteItemCategoryMaster = async (obj)=>{
    const userConfirm = confirm(`Are You Sure To Delete Following Data
Name is ${obj.item_category_master_name}
Short Name is ${obj.item_category_master_code}
Price is ${obj.item_category_master_status}`);

    if (userConfirm){
        const serverResponse = await deleteItemCategoryMasterService(obj.id);
        if (serverResponse.success){
            alert(`Delete Success`);
            setTimeout(()=>{
                window.location.reload();
            },500)
        }else {
            alert(`Something Went Wrong`)
        }
    }else {
        alert(`User Cancelled The Operation`)
    }



}


const checkErrors = ()=>{
    let errors = "";

    if (itemCategoryMaster.item_category_master_name == null) {
        errors += "Name Cannot Be Empty \n"
        texCategoryName.classList.add("is-invalid");
        texCategoryName.style.border="1px solid red";
    }

    if (itemCategoryMaster.item_category_master_code == null) {
        errors += "Code Cannot Be Empty \n"
        texCategoryCode.classList.add("is-invalid");
        texCategoryCode.style.border="1px solid red";
    }


    if (itemCategoryMaster.item_category_master_status == null) {
        errors += "Status Cannot Be Empty \n"
        selectCategoryStatus.classList.add("is-invalid");
        selectCategoryStatus.style.border="1px solid red";
    }
    return errors;
}



const saveItemMasterCategory = async ()=>{


    itemCategoryMaster.item_category_master_added_date = getMysqlDateTime();

    const errors  = checkErrors();
    if (errors==""){
        const userConfirm = confirm(`Are You Sure To Add Following Data
Name is ${itemCategoryMaster.item_category_master_name}
Short Name is ${itemCategoryMaster.item_category_master_code}
Price is ${itemCategoryMaster.item_category_master_status}`);

        if (userConfirm){
            const serverResponse = await createItemCategoryService(itemCategoryMaster);
            if (serverResponse.success){
                alert(`Save Success`);
                setTimeout(()=>{
                    window.location.reload();
                },500)
            }else {
                alert(`Something Went Wrong ${serverResponse.message}`)
            }
        }else {
            alert(`User Cancelled the Operation`);
        }
    }else {
        alert(`You Have Following Errors \n ${errors}`);
    }


}

const checkUpdates = ()=>{

    let updates = ""

    if (oldItemCategoryMaster.item_category_master_name !== itemCategoryMaster.item_category_master_name) {
        updates += "Name is Updated \n"
    }


    if (oldItemCategoryMaster.item_category_master_code !== itemCategoryMaster.item_category_master_code) {
        updates += "Code is Updated \n"
    }


    if (oldItemCategoryMaster.item_category_master_status !== itemCategoryMaster.item_category_master_status) {
        updates += "Name is Updated \n"
    }

return updates;
}




const updateItemCategoryMaster =async ()=>{
    itemCategoryMaster.item_category_master_modify_date = getMysqlDateTime();
    const updates = checkUpdates();

    if (updates !== ""){
        const userConfirm = confirm(`Are You Sure to Change Following Details \n ${updates}`);
        if (userConfirm){
         const serverResponse = await updateItemCategory(itemCategoryMaster.id, itemCategoryMaster);
         if (serverResponse.success){
             alert(`Update success`);
             setTimeout(()=>{
                 window.location.reload();
             },500)
         }else {
             alert(`Something Went Wrong ${serverResponse.message}`);
         }
        }else {
            alert(`User Cancelled the Operation`)
        }
    }else {
        alert(`Nothing to Update`)
    }



}
















