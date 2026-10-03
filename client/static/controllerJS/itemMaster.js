// import {getAllItemSizes} from "../services/itemSizeService";
// import {getAllItemStatus} from "../services/itemStatusService";
// import {getAllItems} from "../services/itemMasterService";

window.addEventListener('load', () => {


    refreshItemMasterForm();
    refreshItemMasterTable();

});


const refreshItemMasterForm = async () => {

    itemMaster = {};

    const selectItemCategory = document.getElementById("selectItemCategory");
    const textItemName = document.getElementById("textItemName");
    const textItemShortName = document.getElementById("textItemShortName");
    const textCode = document.getElementById("textCode");
    const selectItemSize = document.getElementById("selectItemSize");
    const textNoOfPages = document.getElementById("textNoOfPages");
    const textBooksInPack = document.getElementById("textBooksInPack");
    const textPacksInBox = document.getElementById("textPacksInBox");
    const textBarCode = document.getElementById("textBarCode");
    const textPrice = document.getElementById("textPrice");
    const textCost = document.getElementById("textCost");
    const selectItemStatus = document.getElementById("selectItemStatus");
    const textDescription = document.getElementById("textDescription");


    selectItemCategory.style.border = "1px solid #ced4da";
    textItemName.style.border = "1px solid #ced4da";
    textItemShortName.style.border = "1px solid #ced4da";
    textCode.style.border = "1px solid #ced4da";
    selectItemSize.style.border = "1px solid #ced4da";
    textNoOfPages.style.border = "1px solid #ced4da";
    textBooksInPack.style.border = "1px solid #ced4da";
    textPacksInBox.style.border = "1px solid #ced4da";
    textBarCode.style.border = "1px solid #ced4da";
    textPrice.style.border = "1px solid #ced4da";
    textCost.style.border = "1px solid #ced4da";
    selectItemStatus.style.border = "1px solid #ced4da";
    textDescription.style.border = "1px solid #ced4da";


    textItemName.value = "";
    textItemShortName.value = "";
    textCode.value = "";
    textNoOfPages.value = "";
    textBooksInPack.value = "";
    textPacksInBox.value = "";
    textBarCode.value = "";
    textPrice.value = "";
    textCost.value = "";
    textDescription.value = "";

    const itemCategoriesList = await getAllItemCategories();
    const itemSizeList = await getAllItemSizes();
    const itemStatusesList = await getAllItemStatus();

    generateSelectDropDown(selectItemCategory, itemCategoriesList, "items", "item_category_master_name");
    generateSelectDropDown(selectItemSize, itemSizeList, "item", "item_size_name");
    generateSelectDropDown(selectItemStatus, itemStatusesList, "status", "item_master_status_name");


}

const refreshItemMasterTable = async () => {

    const itemsList = await getAllItems();
    console.log(itemsList)

    const tableBody = document.getElementById("itemTableBody");
    tableBody.innerHTML=""

    itemsList.data.forEach(item => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = item.id;

        const nameCell = document.createElement("td");
        nameCell.textContent = item.item_master_name;

        const shortNameCell = document.createElement("td");
        shortNameCell.textContent = item.item_master_short_name;

        const priceCell = document.createElement("td");
        priceCell.textContent = item.item_master_price;

        const costCell = document.createElement("td");
        costCell.textContent = item.item_master_cost;

        const barcodeCell = document.createElement("td");
        barcodeCell.textContent = item.item_master_barcode;

        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillItemMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printItemMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteItemMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(shortNameCell);
        row.appendChild(priceCell);
        row.appendChild(costCell);
        row.appendChild(barcodeCell);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);
    });

    // new DataTable("#tableItemMaster");
    new DataTable('#tableItemMaster', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });
};

const refillItemMaster = (obj) => {
    console.log(obj)
}


const deleteItemMaster = (obj) => {
    console.log(obj)
}


const printItemMaster = (obj) => {
    console.log(obj)
}


const checkErrors = () => {

    let errors = ""

    if (itemMaster.item_master_name == null) {
        errors += "Name Cannot Be Empty \n"
    }

    if (itemMaster.item_master_short_name == null) {
        errors += "Short Name Cannot Be Empty \n"
    }

    if (itemMaster.item_master_price == null) {
        errors += "Price Cannot Be Empty \n"
    }

    if (itemMaster.item_master_barcode == null) {
        errors += "Barcode Cannot Be Empty \n"
    }

    if (itemMaster.item_master_no_of_pages == null) {
        errors += "No of Pages Cannot Be Empty \n"
    }

    if (itemMaster.item_category_master_id == null) {
        errors += "Category Cannot Be Empty \n"
    }


    if (itemMaster.item_master_status_id == null) {
        errors += "Status Cannot Be Empty \n"
    }

    if (itemMaster.item_size_id == null) {
        errors += "Size Cannot Be Empty \n"
    }


    return errors;
}


const saveItemMaster = async () => {
    const errors = checkErrors();

    if (errors !== "") {
        alert(`You Have Following Errors\n${errors}`);
        return;
    }

    const userConfirm = confirm(`Are You Sure To Add Following Data
Name is ${itemMaster.item_master_name}
Short Name is ${itemMaster.item_master_short_name}
Price is ${itemMaster.item_master_price}
Barcode is ${itemMaster.item_master_barcode}
Number of Pages ${itemMaster.item_master_no_of_pages}
Category ${itemMaster.item_category_master_id}
Status ${itemMaster.item_master_status_id}
Size ${itemMaster.item_size_id}`);

    if (!userConfirm) {
        alert("Operation Cancelled by User");
        return;
    }

    try {
        const serverResponse = await createItemService(itemMaster);

        if (serverResponse.success) {
            Swal.fire("Save Success");
            refreshItemMasterForm();
            refreshItemMasterTable();
        } else {
            alert(`Something Went Wrong: ${serverResponse.message}`);
        }
    } catch (error) {
        alert(`Something Went Wrong: ${error.message}`);
    }
};



















