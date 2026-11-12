window.addEventListener('load',function () {

    refreshAssetMasterForm();
    refreshAssetMasterTable()


})


const refreshAssetMasterForm = async ()=>{
    assetMaster = new Object();

    selectAssetCategory.style.border = "1px solid #ced4da";
    textAssetName.style.border = "1px solid #ced4da";
    textSerialNumber.style.border = "1px solid #ced4da";
    textBrandName.style.border = "1px solid #ced4da";
    textModel.style.border = "1px solid #ced4da";
    purchaseDate.style.border = "1px solid #ced4da";
    textPurchasePrice.style.border = "1px solid #ced4da";
    textWarrantyExpireDate.style.border = "1px solid #ced4da";
    selectItemStatus.style.border = "1px solid #ced4da";
    textDescription.style.border = "1px solid #ced4da";

    selectAssetCategory.value = ""
    textAssetName.value = ""
    textSerialNumber.value = ""
    textBrandName.value = ""
    textModel.value = ""
    purchaseDate.value = ""
    textPurchasePrice.value = ""
    textWarrantyExpireDate.value = ""
    selectItemStatus.value = ""
    textDescription.value = ""

    const assetList = await getAllAssetCategoryService();
    generateSelectDropDown(selectAssetCategory, assetList, "data", "name");


    const statusList = await getAllAssetStatus();
    generateSelectDropDown(selectItemStatus, statusList, "data", "name");



}



const refreshAssetMasterTable = async ()=>{


    const assetList = await getAllAsseMasterService();
    console.log(assetList);

    const tableBody = document.getElementById("assetTableBody");
    tableBody.innerHTML = ""

    assetList.data.forEach((item, index) => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = item.asset_category_name;

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        const serialNumberCell = document.createElement("td");
        serialNumberCell.textContent = item.serial_number;

        const brandCell = document.createElement("td");
        brandCell.textContent = item.brand;

        const modelCell = document.createElement("td");
        modelCell.textContent = item.model;

        const purchaseDate = document.createElement("td");
        purchaseDate.textContent = item.purchase_date;

        const purchasePrice = document.createElement("td");
        purchasePrice.textContent = item.purchase_price;

        const statusCell = document.createElement("td");
        statusCell.textContent = item.asset_status_name;

        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");




        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillAssetMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printAssetMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteAssetMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(categoryCell);
        row.appendChild(nameCell);
        row.appendChild(serialNumberCell);
        row.appendChild(brandCell);
        row.appendChild(modelCell);
        row.appendChild(purchaseDate);
        row.appendChild(purchasePrice);
        row.appendChild(statusCell);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);
    });


    // new DataTable("#tableItemMaster");
    new DataTable('#tableAssetMaster', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });
}



const refillAssetMaster = (obj)=>{

    console.log(obj);

    assetMaster = JSON.parse(JSON.stringify(obj));
    oldAssetMaster = JSON.parse(JSON.stringify(obj));

    selectAssetCategory.value= assetMaster.asset_category_idm
    textAssetName.value= assetMaster.name
    textSerialNumber.value= assetMaster.serial_number
    textBrandName.value = assetMaster.brand
    textModel.value= assetMaster.model
    purchaseDate.value= assetMaster.purchase_date
    textPurchasePrice.value= assetMaster.purchase_price
    textWarrantyExpireDate.value= assetMaster.warranty_expire_date
    selectItemStatus.value= assetMaster.asset_status_id
    textDescription.value= assetMaster.description




}
const printAssetMaster = (obj)=>{




}
const deleteAssetMaster = async (obj)=>{

    console.log("Delete", obj);
    const userConfirm = confirm(`Are You Sure To delete Following Data
Name is ${obj.name}
Serial Number is ${obj.serial_number}
Brand is ${obj.brand}
Model is ${obj.model}
Purchase Date ${obj.purchase_date}
Purchase Price ${obj.purchase_price}
Warranty Expire date ${obj.warranty_expire_date}
Category is ${obj.assert_category_master_id}
Status ${obj.asset_status_id}`)
    if (userConfirm) {

        const deleteServerResponse = await deleteAsseMasterService(obj.id);
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


const checkErrors = ()=>{
    let errors = "";

    if (assetMaster.name == null) {
        errors += "Name Cannot Be Empty \n"
        textAssetName.classList.add("is-invalid");
        textAssetName.style.border="1px solid red";
    }


    if (assetMaster.assert_category_master_id == null) {
        errors += "Category Cannot Be Empty \n"
        selectAssetCategory.classList.add("is-invalid");
        selectAssetCategory.style.border="1px solid red";
    }


    if (assetMaster.brand == null) {
        errors += "Brand Cannot Be Empty \n"
        textBrandName.classList.add("is-invalid");
        textBrandName.style.border="1px solid red";
    }


    if (assetMaster.model == null) {
        errors += "Status Cannot Be Empty \n"
        textModel.classList.add("is-invalid");
        textModel.style.border="1px solid red";
    }


    if (assetMaster.purchase_date == null) {
        errors += "Purchase date Cannot Be Empty \n"
        purchaseDate.classList.add("is-invalid");
        purchaseDate.style.border="1px solid red";
    }



    if (assetMaster.purchase_price == null) {
        errors += "Purchase Price Cannot Be Empty \n"
        textPurchasePrice.classList.add("is-invalid");
        textPurchasePrice.style.border="1px solid red";
    }

    if (assetMaster.asset_status_id == null) {
        errors += "Status Price Cannot Be Empty \n"
        selectItemStatus.classList.add("is-invalid");
        selectItemStatus.style.border="1px solid red";
    }


    return errors;
}





const saveAssetMaster = async ()=>{
    const errors  = checkErrors();
    if (errors==""){
        const userConfirm = confirm(`Are You Sure To Add Following Data
Name is ${assetMaster.name}
Serial Number is ${assetMaster.serial_number}
Brand is ${assetMaster.brand}
Model is ${assetMaster.model}
Purchase Date is ${assetMaster.purchase_date}
Purchase Price is ${assetMaster.purchase_price}
Warranty Expire Date is ${assetMaster.warranty_expire_date}
Category is ${assetMaster.assert_category_master_id}
Status is ${assetMaster.asset_status_id}


`);

        if (userConfirm){
            const serverResponse = await createAsseMasterService(assetMaster);
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



const checkUpdatesAssetMaster = () => {

    let updates = ""

    if (assetMaster.name !== oldAssetMaster.name) {
        updates += "Name is Updated \n"
    }

    if (assetMaster.description !== oldAssetMaster.description) {
        updates += "Description is Updated \n"
    }

    if (assetMaster.serial_number !== oldAssetMaster.serial_number) {
        updates += "Serial Number is updated \n"
    }

    if (assetMaster.brand !== oldAssetMaster.brand) {
        updates += "Brand is updated \n"
    }
    if (assetMaster.model !== oldAssetMaster.model) {
        updates += "Model is updated \n"
    }

    if (assetMaster.purchase_date !== oldAssetMaster.purchase_date) {
        updates += "Purchase Date is updated \n"
    }

    if (assetMaster.purchase_price !== oldAssetMaster.purchase_price) {
        updates += "Purchase Price is Updated \n"
    }

    if (assetMaster.warranty_expire_date !== oldAssetMaster.warranty_expire_date) {
        updates += "Warranty Expire Date is Updated \n"
    }

    if (assetMaster.assert_category_master_id !== oldAssetMaster.assert_category_master_id) {
        updates += "Category is Updated \n"
    }
    if (assetMaster.asset_status_id !== oldAssetMaster.asset_status_id) {
        updates += "Status Updated \n"
    }
    return updates;
}


const updateAssetMaster = async () => {
    const updates = checkUpdatesAssetMaster();

    if (updates !== "") {
        const userConfirm = confirm(`Are You Sure to Proceed with Following Changes ${updates}`)
        if (userConfirm) {
            console.log(assetMaster.id)
            const updateServerResponse = await updateItemService(assetMaster.id, assetMaster);
            if (updateServerResponse.success) {
                alert(`Update Success`);
                setTimeout(()=>{
                    window.location.reload();
                },500)
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



















