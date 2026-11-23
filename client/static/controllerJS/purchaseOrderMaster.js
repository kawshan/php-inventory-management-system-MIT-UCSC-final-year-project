window.addEventListener('load', function () {

    refreshPurchaseOrderMasterForm();
    refreshPurchaseOrderMasterTable();

});


// master form refresh function
const refreshPurchaseOrderMasterForm = async () => {

    purchaseOrderMaster = new Object();
    oldPurchaseOrderMaster = null;
    purchaseOrderMaster.rawMaterials = new Array();

    textDate.value = "";
    textReferenceQuotation.value = "";
    selectStatus.value = "";

    textDate.style.border = "1px solid #ced4da";
    textReferenceQuotation.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";

    await refreshInnerForm();

}


// master table refresh function
const refreshPurchaseOrderMasterTable = async () => {

    let purchaseOrderList = await getAllPurchaseOrderService();

    console.log("purchase orders", purchaseOrderList);

    const tableBody = document.getElementById("invoiceMasterTableTbody");
    tableBody.innerHTML = "";

    purchaseOrderList.forEach((item, index) => {

        const row = document.createElement("tr");

        // index cell
        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        // date cell
        const dateCell = document.createElement("td");
        dateCell.textContent = item.date;


        // code cell
        const codeCell = document.createElement("td");
        codeCell.textContent = item.code;

        // quotation cell
        const quotationCell = document.createElement("td");
        quotationCell.textContent = item.reference_quotation;

        // raw material cell
        const rawMaterialCell = document.createElement("td");

        rawMaterialCell.innerHTML = item.rawMaterials
            .map(innerItem => `<span>${innerItem.name} &nbsp;&nbsp;</span>`)
            .join("");

        // status cell
        const statusCell = document.createElement("td");
        statusCell.innerHTML = `<p class="text-center">${item.status == 1 ? "Active" : "Inactive"}</p>`;

        // action cell
        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");

        // refill button
        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill";
        refillButton.classList.add("rounded", "bg-emerald-800", "px-3", "py-2", "text-neutral-50", "hover:bg-black");

        refillButton.onclick = () => {
            refillPurchaseOrderMaster(item);
        };

        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("rounded", "bg-emerald-800", "px-3", "py-2", "text-neutral-50", "hover:bg-black");

        deleteButton.onclick = () => {
            deletePurchaseOrderMaster(item);
        };


        // append cells to row
        row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(codeCell);
        row.appendChild(quotationCell);
        row.appendChild(rawMaterialCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        actionCell.appendChild(refillButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    });


    new DataTable('#purchaseOrderMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });

}


// master validation function
const checkErrorsPurchaseOrderMaster = () => {

    let errors = "";

    if (purchaseOrderMaster.date == null || purchaseOrderMaster.date == "") {

        errors += "Date Cannot Be Empty \n";

        textDate.classList.add("is-invalid");
        textDate.style.border = "1px solid red";

    }

    if (purchaseOrderMaster.status == null || purchaseOrderMaster.status == "") {

        errors += "Status Cannot Be Empty \n";

        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";

    }

    return errors;

}


// save master function
const savePurchaseOrderMaster = async () => {

    let errors = checkErrorsPurchaseOrderMaster();

    if (errors == "") {

        const userConfirm = confirm(`Are You Sure To Add Following Details

Date is ${purchaseOrderMaster.date}

Reference Quotation is ${purchaseOrderMaster.reference_quotation}

Status is ${purchaseOrderMaster.status}

Number of Raw Materials is ${purchaseOrderMaster.rawMaterials.length}
`);

        if (userConfirm) {

            const serverResponse = await savePurchaseOrderMasterService(purchaseOrderMaster);

            if (serverResponse.success) {

                alert("Save Successful");

                setTimeout(() => {
                    window.location.reload();
                }, 500);

            } else {

                alert("Something Went Wrong");

            }

        } else {

            alert("User Cancelled the Operation");

        }

    } else {

        alert(`You Have Following Errors \n ${errors}`);

    }

}


// refill master function
const refillPurchaseOrderMaster = (obj) => {

    purchaseOrderMaster = JSON.parse(JSON.stringify(obj));
    oldPurchaseOrderMaster = JSON.parse(JSON.stringify(obj));

    textDate.value = purchaseOrderMaster.date;
    textReferenceQuotation.value = purchaseOrderMaster.reference_quotation;
    selectStatus.value = purchaseOrderMaster.status;

    refreshInnerTable();

}


// check master updates
const checkUpdatePurchaseOrderMaster = () => {

    let updates = "";

    if (oldPurchaseOrderMaster.date != purchaseOrderMaster.date) {
        updates += "Date Is Changed \n";
    }

    if (oldPurchaseOrderMaster.reference_quotation != purchaseOrderMaster.reference_quotation) {
        updates += "Reference Quotation Is Changed \n";
    }

    if (oldPurchaseOrderMaster.status != purchaseOrderMaster.status) {
        updates += "Status Is Changed \n";
    }


    // checking raw materials
    if (purchaseOrderMaster.rawMaterials.length !== oldPurchaseOrderMaster.rawMaterials.length) {

        updates += "Raw Materials Are Changed \n";

    } else {

        for (let element of purchaseOrderMaster.rawMaterials) {

            let extIndex = oldPurchaseOrderMaster.rawMaterials
                .map(item => item.raw_material_master_id)
                .indexOf(element.raw_material_master_id);

            if (extIndex === -1) {

                updates += "Raw Materials Are Changed \n";

            } else {

                const oldRawMaterial = oldPurchaseOrderMaster.rawMaterials[extIndex];

                if (
                    oldRawMaterial.quantity !== element.quantity ||
                    oldRawMaterial.rate !== element.rate ||
                    oldRawMaterial.description !== element.description
                ) {

                    updates += "Raw Materials Are Changed \n";
                    break;

                }

            }

        }

    }

    return updates;

}


// update master function
const updatePurchaseOrderMaster = async () => {

    const updates = checkUpdatePurchaseOrderMaster();

    if (updates != "") {

        const userConfirm = confirm(`Are You Sure to Update Following Details

${updates}`);

        if (userConfirm) {

            const serverResponse = await updatePurchaseOrderMasterService(
                purchaseOrderMaster.id,
                purchaseOrderMaster
            );

            if (serverResponse.success) {

                alert("Update Successful");

                setTimeout(() => {
                    window.location.reload();
                }, 500);

            } else {

                alert("Something Went Wrong");

            }

        } else {

            alert("User Cancelled the Operation");

        }

    } else {

        alert("Nothing to Update");

    }

}


// delete master function
const deletePurchaseOrderMaster = async (obj) => {

    const userConfirm = confirm(`Are You Sure to Delete Purchase Order Details

Date is ${obj.date}

Reference Quotation is ${obj.reference_quotation}

Status is ${obj.status}
`);

    if (userConfirm) {

        const serverResponse = await deletePurchaseOrderMasterService(obj.id);

        if (serverResponse.success) {

            alert("Delete Successful");

            setTimeout(() => {
                window.location.reload();
            }, 500);

        }

    }

}


// print function
const printPurchaseOrderMaster = (obj) => {

    // print functionality can be implemented later

}



// inner functions start from here


// refresh inner form
const refreshInnerForm = async () => {

    purchaseRawMaterial = new Object();
    oldPurchaseRawMaterial = null;

    selectItem.style.border = "1px solid #ced4da";
    textQuantity.style.border = "1px solid #ced4da";
    textRate.style.border = "1px solid #ced4da";
    textDescription.style.border = "1px solid #ced4da";

    selectItem.value = "";
    textQuantity.value = "";
    textRate.value = "";
    textDescription.value = "";


    rawMaterialsList = await getAllRawMaterialService();

    generateDataList(dataListItem, rawMaterialsList.data, "name");


    const textItem = document.getElementById("selectItem");

    textItem.addEventListener("change", () => {

        const selectedValue = textItem.value;

        const selectedItem = rawMaterialsList.data.find(item =>
            item.name === selectedValue
        );

        if (selectedItem) {

            purchaseRawMaterial.raw_material_master_id = selectedItem.raw_material_id;
            purchaseRawMaterial.name = selectedItem.name;

            textItem.style.border = "1px solid green";

        } else {

            purchaseRawMaterial.raw_material_master_id = null;
            purchaseRawMaterial.name = null;

            textItem.style.border = "1px solid red";

        }

    });


    await refreshInnerTable();

}


// refresh inner table
const refreshInnerTable = async () => {

    const tableBody = document.getElementById("innerTableTbody");

    tableBody.innerHTML = "";

    purchaseOrderMaster.rawMaterials.forEach((item, index) => {

        const row = document.createElement("tr");

        // index cell
        const idCell = document.createElement("td");
        idCell.textContent = index + 1;
        idCell.classList.add("py-2");

        // raw material name cell
        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        // quantity cell
        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.quantity;

        // rate cell
        const rateCell = document.createElement("td");
        rateCell.textContent = item.rate;

        // description cell
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = item.description;

        // action cell
        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");

        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("bg-emerald-600", "text-white", "px-3", "py-2", "rounded");

        deleteButton.onclick = () => {
            deleteInnerRow(item);
        };


        // append cells
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(rateCell);
        row.appendChild(descriptionCell);
        row.appendChild(actionCell);

        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    });


    new DataTable('#innerItemTable');

}


// delete inner row
const deleteInnerRow = async (obj) => {

    const userConfirm = confirm("Are You Sure to Delete");

    if (userConfirm) {

        let extIndex = purchaseOrderMaster.rawMaterials
            .map(item => item.raw_material_master_id)
            .indexOf(obj.raw_material_master_id);

        if (extIndex !== -1) {

            purchaseOrderMaster.rawMaterials.splice(extIndex, 1);

            alert("Delete Success");

            await refreshInnerTable();

        }

    }

}


// check inner form errors
const checkInnerFormErrors = () => {

    let errors = "";

    if (purchaseRawMaterial.raw_material_master_id == null) {

        errors += "Raw Material Cannot Be Empty \n";

        selectItem.style.border = "1px solid red";

    }

    if (purchaseRawMaterial.quantity == null || purchaseRawMaterial.quantity == "") {

        errors += "Quantity Cannot Be Empty \n";

        textQuantity.style.border = "1px solid red";

    }

    if (purchaseRawMaterial.rate == null || purchaseRawMaterial.rate == "") {

        errors += "Rate Cannot Be Empty \n";

        textRate.style.border = "1px solid red";

    }

    return errors;

}


// add inner row
const buttonInnerAdd = async () => {

    let errors = checkInnerFormErrors();

    if (errors == "") {

        const userConfirm = confirm("Are You Sure to Add This Raw Material?");

        if (userConfirm) {

            await purchaseMasterDuplicateCheck();

        }

    } else {

        alert(`You Have Following Errors \n ${errors}`);

    }

}


// check duplicate raw materials
const purchaseMasterDuplicateCheck = async () => {

    const extIndex = purchaseOrderMaster.rawMaterials
        .map(item => item.raw_material_master_id)
        .indexOf(purchaseRawMaterial.raw_material_master_id);

    if (extIndex === -1) {

        purchaseOrderMaster.rawMaterials.push(purchaseRawMaterial);

        await refreshInnerTable();
        await refreshInnerForm();

    } else {

        alert("This Raw Material Already Exists");

    }

}