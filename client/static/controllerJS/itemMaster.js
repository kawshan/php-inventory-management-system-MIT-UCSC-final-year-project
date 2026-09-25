import {getAllItemCategories} from "../services/itemCategoryService.js";

window.addEventListener('load',()=>{


    refreshItemMasterForm();


});



let itemMaster = {};

const refreshItemMasterForm = async ()=>{



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
        itemCategoriesList.items.forEach(itemCategory=>{
            const option = document.createElement("option")
            option.value = itemCategory.id;
            option.textContent=itemCategory.item_category_master_name;
            selectItemCategory.appendChild(option);
        })

}

