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
    console.log(itemsList);

    const tableBody = document.getElementById("itemTableBody");
    tableBody.innerHTML = ""

    itemsList.data.forEach((item, index) => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

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

    // why we need to destroy? cuz datatable gives already initialized warning..
    // if (DataTable.isDataTable("#tableItemMaster")) {
    //     DataTable.get("#tableItemMaster").destroy();
    // }


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
    console.log(obj);

    itemMaster = JSON.parse(JSON.stringify(obj));
    oldItemMaster = JSON.parse(JSON.stringify(obj));


    textItemName.value = itemMaster.item_master_name;
    textItemShortName.value = itemMaster.item_master_short_name;
    textCode.value = itemMaster.item_master_code;
    textNoOfPages.value = itemMaster.item_master_no_of_pages;
    textBooksInPack.value = itemMaster.item_master_books_in_pack;
    textPacksInBox.value = itemMaster.item_master_books_in_box;
    textBarCode.value = itemMaster.item_master_code;
    textPrice.value = itemMaster.item_master_price;
    textCost.value = itemMaster.item_master_cost;
    textDescription.value = itemMaster.item_master_description;

    selectItemCategory.value = itemMaster.item_category_master_id;
    selectItemSize.value = itemMaster.item_size_id;
    selectItemStatus.value = itemMaster.item_master_status_id;
}


const deleteItemMaster = async (obj) => {
    console.log("Delete", obj);
    const userConfirm = confirm(`Are You Sure To delete Following Data
Name is ${obj.item_master_name}
Short Name is ${obj.item_master_short_name}
Price is ${obj.item_master_price}
Barcode is ${obj.item_master_barcode}
Number of Pages ${obj.item_master_no_of_pages}
Category ${obj.item_category_master_id}
Status ${obj.item_master_status_id}
Size ${obj.item_size_id}`)
    if (userConfirm) {

        const deleteServerResponse = await deleteItemService(obj.id);
        if (deleteServerResponse.success) {
            alert(`Delete Success`);
            await refreshItemMasterTable();
            await refreshItemMasterForm();
        } else {
            alert(`Delete Unsuccessful ${deleteServerResponse.message}`)
        }
    } else {
        alert("Operation Cancelled By User")

    }
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
        Swal.fire({
            icon: "error",
            title: "You Have Following Errors",
            text: `${errors}`
        });

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
Size ${itemMaster.item_size_id}`)
    if (!userConfirm) {
        alert("Operation Cancelled By User")
        return;
    }

    try {
        const serverResponse = await createItemService(itemMaster);

        if (serverResponse.success) {
                alert("Save Success")
                refreshItemMasterForm();
                refreshItemMasterTable();
        } else {
            alert(`Something Went Wrong: ${serverResponse.message}`);
        }
    } catch (error) {
        alert(`Something Went Wrong: ${error.message}`);
    }
};


const checkUpdatesItemMaster = () => {

    let updates = ""

    if (oldItemMaster.item_master_name !== itemMaster.item_master_name) {
        updates += "Name is Updated \n"
    }

    if (oldItemMaster.item_master_price !== itemMaster.item_master_price) {
        updates += "Price is Updated \n"
    }

    if (oldItemMaster.item_master_cost !== itemMaster.item_master_cost) {
        updates += "Cost is updated \n"
    }

    if (oldItemMaster.item_master_barcode !== itemMaster.item_master_barcode) {
        updates += "Barcode is updated \n"
    }
    if (oldItemMaster.item_master_key !== itemMaster.item_master_key) {
        updates += "Key is updated \n"
    }

    if (oldItemMaster.item_master_code !== itemMaster.item_master_code) {
        updates += "Code is updated \n"
    }

    if (oldItemMaster.item_master_short_name !== itemMaster.item_master_short_name) {
        updates += "Short Name is Updated \n"
    }

    if (oldItemMaster.item_master_description !== itemMaster.item_master_description) {
        updates += "Description is Updated \n"
    }

    if (oldItemMaster.item_master_no_of_pages !== itemMaster.item_master_no_of_pages) {
        updates += "No of Pages Updated \n"
    }
    if (oldItemMaster.item_master_books_in_pack !== itemMaster.item_master_books_in_pack) {
        updates += "Books in Pack Updated \n"
    }
    if (oldItemMaster.item_master_books_in_box !== itemMaster.item_master_books_in_box) {
        updates += "Books in Box Updated \n"
    }
    if (oldItemMaster.item_category_master_id !== itemMaster.item_category_master_id) {
        updates += "Category is Updated \n"
    }
    if (oldItemMaster.item_master_status_id !== itemMaster.item_master_status_id) {
        updates += "Status is Updated \n"
    }
    if (oldItemMaster.item_size_id !== itemMaster.item_size_id) {
        updates += "Size is Updated \n"
    }
    return updates;
}


const updateItemMaster = async () => {
    const updates = checkUpdatesItemMaster();

    if (updates !== "") {
        const userConfirm = confirm(`Are You Sure to Proceed with Following Changes ${updates}`)
        if (userConfirm) {
            console.log(itemMaster.id)
            const updateServerResponse = await updateItemService(itemMaster.id, itemMaster);
            if (updateServerResponse.success) {
                alert(`Update Success`);
                    await refreshItemMasterTable();
                    await refreshItemMasterForm();
            } else {
                alert(`Something Went Wrong: ${updateServerResponse.message}`);
            }
        } else {
            alert("User Cancelled The Operation?")
        }
    } else {
        alert("Nothing To Update?")
    }
}