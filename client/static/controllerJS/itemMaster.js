import {getAllItemCategories} from "../services/itemCategoryService.js";
import {getAllItemSizes} from "../services/itemSizeService";
import {getAllItemStatus} from "../services/itemStatusService";
import {getAllItems} from "../services/itemMasterService";

window.addEventListener('load', () => {


    refreshItemMasterForm();
    refreshItemMasterTable();

});


let itemMaster = {};

const refreshItemMasterForm = async () => {


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
    console.log(itemCategoriesList);
    itemCategoriesList.items.forEach(itemCategory => {
        const option = document.createElement("option")
        option.value = itemCategory.id;
        option.textContent = itemCategory.item_category_master_name;
        selectItemCategory.appendChild(option);
    });


    const itemSizeList = await getAllItemSizes();
    console.log(itemSizeList);
    itemSizeList.item.forEach(itemSize => {
        const option = document.createElement("option");
        option.value = itemSize.id;
        option.textContent = itemSize.item_size_name;
        selectItemSize.appendChild(option);
    });


    const itemStatusesList = await getAllItemStatus();
    console.log(itemStatusesList);
    itemStatusesList.status.forEach(itemStatus=>{
        const option = document.createElement("option");
        option.value = itemStatus.id;
        option.textContent = itemStatus.item_master_status_name;
        selectItemStatus.appendChild(option);
    })


}

const refreshItemMasterTable = async () => {

    const itemsList = await getAllItems();

    const tableBody = document.getElementById("itemTableBody");

    itemsList.data.forEach(item => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = item.id;

        const nameCell = document.createElement("td");
        nameCell.textContent = item.item_master_nam;

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
        refillButton.textContent="Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = ()=>{refillItemMaster(item)}


        const printButton = document.createElement("button");
        printButton.textContent="print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = ()=>{printItemMaster(item)}


        const deleteButton = document.createElement("button");
        deleteButton.textContent="delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = ()=>{deleteItemMaster(item)}


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
};






const refillItemMaster = (obj)=>{
    console.log(obj)
}


const deleteItemMaster = (obj)=>{
    console.log(obj)
}


const printItemMaster = (obj)=>{
    console.log(obj)
}
