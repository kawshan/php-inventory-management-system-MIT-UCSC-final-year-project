window.addEventListener('load', function () {

    refreshGrnMasterForm();
    refreshGrnMasterTable();

});


// master form refresh function
const refreshGrnMasterForm = async () => {

    grnMaster = new Object();
    oldGrnMaster = null;
    grnMaster.rawMaterials = new Array();

    textDate.value = "";
    textOurPurchaseOrder.value = "";
    selectSupplier.value = "";
    selectStatus.value = "";

    textDate.style.border = "1px solid #ced4da";
    textOurPurchaseOrder.style.border = "1px solid #ced4da";
    selectSupplier.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";

    // refresh supplier dropdown
    const supplierList = await getAllSupplierService();


    generateSelectDropDown(selectSupplier,supplierList,"data","name")

    await refreshInnerForm();

}


// master table refresh function
const refreshGrnMasterTable = async () => {

    let grnList = await getAllGRNService();

    console.log("GRN List", grnList);

    const tableBody = document.getElementById("grnMasterTableTbody");

    tableBody.innerHTML = "";

    grnList.forEach((item, index) => {

        const row = document.createElement("tr");

        // index cell
        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        // date cell
        const dateCell = document.createElement("td");
        dateCell.textContent = item.date;

        // purchase order cell
        const purchaseOrderCell = document.createElement("td");
        purchaseOrderCell.textContent = item.code;

        // raw material cell
        const rawMaterialCell = document.createElement("td");

        rawMaterialCell.innerHTML = item.rawMaterials
            .map(innerItem => `<span>${innerItem.rms_name} &nbsp;&nbsp;</span>`)
            .join("");

        // status cell
        const statusCell = document.createElement("td");

        statusCell.innerHTML =
            `<p class="text-center">${item.status == 1 ? "Active" : "Inactive"}</p>`;

        // action cell
        const actionCell = document.createElement("td");

        actionCell.classList.add(
            "flex",
            "justify-center",
            "items-center",
            "gap-2"
        );

        // refill button
        const refillButton = document.createElement("button");

        refillButton.textContent = "Refill";

        refillButton.classList.add(
            "rounded",
            "bg-emerald-800",
            "px-3",
            "py-2",
            "text-neutral-50",
            "hover:bg-black"
        );

        refillButton.onclick = () => {
            refillGrnMaster(item);
        };

        // delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add(
            "rounded",
            "bg-emerald-800",
            "px-3",
            "py-2",
            "text-neutral-50",
            "hover:bg-black"
        );

        deleteButton.onclick = () => {
            deleteGrnMaster(item);
        };


        // append cells to row
        row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(purchaseOrderCell);
        row.appendChild(rawMaterialCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        actionCell.appendChild(refillButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    });


    new DataTable('#GRNMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });

}


// master validation function
const checkErrorsGrnMaster = () => {

    let errors = "";

    if (grnMaster.date == null || grnMaster.date == "") {

        errors += "Date Cannot Be Empty \n";

        textDate.classList.add("is-invalid");
        textDate.style.border = "1px solid red";

    }

    if (grnMaster.supplier_id == null || grnMaster.supplier_id == "") {

        errors += "Supplier Cannot Be Empty \n";

        selectSupplier.classList.add("is-invalid");
        selectSupplier.style.border = "1px solid red";

    }

    if (grnMaster.status == null || grnMaster.status == "") {

        errors += "Status Cannot Be Empty \n";

        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";

    }

    return errors;

}


// save master function
const saveGrnMaster = async () => {

    let errors = checkErrorsGrnMaster();

    if (errors == "") {

        const userConfirm = confirm(`Are You Sure To Add Following Details

Date is ${grnMaster.date}

Purchase Order ID is ${grnMaster.our_purchase_order_id}

Supplier ID is ${grnMaster.supplier_id}

Status is ${grnMaster.status}

Number of Raw Materials is ${grnMaster.rawMaterials.length}
`);

        if (userConfirm) {

            const serverResponse = await saveGRNMasterService(grnMaster);

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
const refillGrnMaster = async (obj) => {

    grnMaster = JSON.parse(JSON.stringify(obj));

    oldGrnMaster = JSON.parse(JSON.stringify(obj));

    textDate.value = grnMaster.date;

    textOurPurchaseOrder.value = grnMaster.our_purchase_order_id;

    selectSupplier.value = grnMaster.supplier_id;

    selectStatus.value = grnMaster.status;

    await refreshInnerTable();

}


// check master updates
const checkUpdateGrnMaster = () => {

    let updates = "";

    if (oldGrnMaster.date != grnMaster.date) {

        updates += "Date Is Changed \n";

    }

    if (oldGrnMaster.our_purchase_order_id != grnMaster.our_purchase_order_id) {

        updates += "Purchase Order Is Changed \n";

    }

    if (oldGrnMaster.supplier_id != grnMaster.supplier_id) {

        updates += "Supplier Is Changed \n";

    }

    if (oldGrnMaster.status != grnMaster.status) {

        updates += "Status Is Changed \n";

    }


    // checking raw materials
    if (grnMaster.rawMaterials.length !== oldGrnMaster.rawMaterials.length) {

        updates += "Raw Materials Are Changed \n";

    } else {

        for (let element of grnMaster.rawMaterials) {

            let extIndex = oldGrnMaster.rawMaterials
                .map(item => item.raw_material_master_id)
                .indexOf(element.raw_material_master_id);

            if (extIndex === -1) {

                updates += "Raw Materials Are Changed \n";

                break;

            } else {

                const oldRawMaterial = oldGrnMaster.rawMaterials[extIndex];

                if (
                    oldRawMaterial.quantity != element.quantity ||
                    oldRawMaterial.rate != element.rate ||
                    oldRawMaterial.description != element.description
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
const updateGrnMaster = async () => {

    const updates = checkUpdateGrnMaster();

    if (updates != "") {

        const userConfirm = confirm(`Are You Sure to Update Following Details

${updates}`);

        if (userConfirm) {

            const serverResponse = await updateGRNMasterService(
                grnMaster.id,
                grnMaster
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
const deleteGrnMaster = async (obj) => {

    const userConfirm = confirm(`Are You Sure to Delete GRN Details

Date is ${obj.date}

Purchase Order ID is ${obj.our_purchase_order_id}

Supplier ID is ${obj.supplier_id}

Status is ${obj.status}
`);

    if (userConfirm) {

        const serverResponse = await deleteGRNMasterService(obj.id);

        if (serverResponse.success) {

            alert("Delete Successful");

            setTimeout(() => {
                window.location.reload();
            }, 500);

        }

    }

}


// print function
const printGrnMaster = (obj) => {

    // print functionality can be implemented later

}


// inner functions start from here


// refresh inner form
const refreshInnerForm = async () => {

    grnRawMaterial = new Object();

    oldGrnRawMaterial = null;

    selectItem.style.border = "1px solid #ced4da";

    textQuantity.style.border = "1px solid #ced4da";

    textRate.style.border = "1px solid #ced4da";

    textDescription.style.border = "1px solid #ced4da";

    selectItem.value = "";

    textQuantity.value = "";

    textRate.value = "";

    textDescription.value = "";


    rawMaterialsList = await getAllRawMaterialService();

    generateDataList(
        dataListItem,
        rawMaterialsList.data,
        "name"
    );


    // raw material selection
    selectItem.onchange = () => {

        const selectedValue = selectItem.value;

        const selectedItem = rawMaterialsList.data.find(item =>
            item.name.trim() === selectedValue.trim()
        );

        if (selectedItem) {

            grnRawMaterial.raw_material_master_id =
                selectedItem.raw_material_id;

            grnRawMaterial.name = selectedItem.name;

            selectItem.style.border = "1px solid green";

        } else {

            grnRawMaterial.raw_material_master_id = null;

            grnRawMaterial.name = null;

            selectItem.style.border = "1px solid red";

        }

    };


    await refreshInnerTable();

}


// refresh inner table
const refreshInnerTable = async () => {

    const tableBody = document.getElementById("innerTableTbody");

    tableBody.innerHTML = "";

    grnMaster.rawMaterials.forEach((item, index) => {

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

        actionCell.classList.add(
            "flex",
            "justify-center",
            "items-center",
            "gap-2"
        );

        // delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add(
            "bg-emerald-600",
            "text-white",
            "px-3",
            "py-2",
            "rounded"
        );

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

        let extIndex = grnMaster.rawMaterials
            .map(item => item.raw_material_master_id)
            .indexOf(obj.raw_material_master_id);

        if (extIndex !== -1) {

            grnMaster.rawMaterials.splice(extIndex, 1);

            alert("Delete Success");

            await refreshInnerTable();

        }

    }

}


// check inner form errors
const checkInnerFormErrors = () => {

    let errors = "";

    if (grnRawMaterial.raw_material_master_id == null) {

        errors += "Raw Material Cannot Be Empty \n";

        selectItem.style.border = "1px solid red";

    }

    if (grnRawMaterial.quantity == null || grnRawMaterial.quantity == "") {

        errors += "Quantity Cannot Be Empty \n";

        textQuantity.style.border = "1px solid red";

    }

    if (grnRawMaterial.rate == null || grnRawMaterial.rate == "") {

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

            await grnMasterDuplicateCheck();

        }

    } else {

        alert(`You Have Following Errors \n ${errors}`);

    }

}


// check duplicate raw materials
const grnMasterDuplicateCheck = async () => {

    const extIndex = grnMaster.rawMaterials
        .map(item => item.raw_material_master_id)
        .indexOf(grnRawMaterial.raw_material_master_id);

    if (extIndex === -1) {

        grnMaster.rawMaterials.push(grnRawMaterial);

        await refreshInnerTable();

        await refreshInnerForm();

    } else {

        alert("This Raw Material Already Exists");

    }

}



const getIdFromOurPurchaseOrderCode = async () => {
    const ourPoField = document.getElementById("textOurPurchaseOrder");
    const val = ourPoField.value;

    const serverResponse = await getAllPurchaseOrderIdByCodeService(val);

    if (serverResponse) {
        grnMaster.our_purchase_order_id = serverResponse;
        ourPoField.classList.remove("is-invalid");
        ourPoField.classList.add("is-valid");
        console.log(serverResponse)

    } else {
        grnMaster.our_purchase_order_id = null;

        ourPoField.classList.remove("is-valid");
        ourPoField.classList.add("is-invalid");
        console.log(serverResponse)
    }
};













