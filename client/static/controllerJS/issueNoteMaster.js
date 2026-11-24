window.addEventListener('load', function () {

    refreshIssueNoteMasterForm();
    refreshIssueNoteTableForm();

});


// master form refresh function
const refreshIssueNoteMasterForm = async () => {

    issueNoteMaster = new Object();
    oldIssueNoteMaster = null;
    issueNoteMaster.rawMaterials = new Array();

    textDate.value = "";
    selectStatus.value = "";

    textDate.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";

    await refreshInnerForm();

}


// master table refresh function
const refreshIssueNoteTableForm = async () => {

    let issueNoteList = await getAllIssueNoteService();

    console.log("Issue Notes", issueNoteList);

    const tableBody = document.getElementById("issueNoteMasterTableTbody");

    tableBody.innerHTML = "";

    issueNoteList.forEach((item, index) => {

        const row = document.createElement("tr");

        // index cell
        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        // date cell
        const dateCell = document.createElement("td");
        dateCell.textContent = item.date;

        // issue note code cell
        const codeCell = document.createElement("td");
        codeCell.textContent = item.code;

        // raw material cell
        const rawMaterialCell = document.createElement("td");

        rawMaterialCell.innerHTML = item.rawMaterials
            .map(innerItem =>
                `<span>${innerItem.raw_material_name} &nbsp;&nbsp;</span>`
            )
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
            refillIssueNoteMaster(item);
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
            deleteIssueNoteMaster(item);
        };


        // append cells to row
        row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(codeCell);
        row.appendChild(rawMaterialCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        actionCell.appendChild(refillButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    });


    new DataTable('#issueNoteMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });

}


// master validation function
const checkErrorsIssueNoteMaster = () => {

    let errors = "";

    if (issueNoteMaster.date == null || issueNoteMaster.date == "") {

        errors += "Date Cannot Be Empty \n";

        textDate.classList.add("is-invalid");
        textDate.style.border = "1px solid red";

    }

    if (issueNoteMaster.status == null || issueNoteMaster.status == "") {

        errors += "Status Cannot Be Empty \n";

        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";

    }


    if (issueNoteMaster.job_master_id == null || issueNoteMaster.job_master_id == "") {

        errors += "Job Cannot Be Empty \n";

        textJob.classList.add("is-invalid");
        textJob.style.border = "1px solid red";

    }

    return errors;

}


// save master function
const saveIssueNoteMaster = async () => {

    let errors = checkErrorsIssueNoteMaster();

    if (errors == "") {

        const userConfirm = confirm(`Are You Sure To Add Following Details

Date is ${issueNoteMaster.date}

Status is ${issueNoteMaster.status}

Number of Raw Materials is ${issueNoteMaster.rawMaterials.length}
`);

        if (userConfirm) {

            try {

                const serverResponse = await saveIssueNoteMasterService(issueNoteMaster);

                if (serverResponse.success) {

                    alert("Save Successful");

                    setTimeout(() => {
                        window.location.reload();
                    }, 500);

                } else {

                    alert("Something Went Wrong");

                }

            } catch (error) {

                console.error(error);

                alert(error.message);

            }

        } else {

            alert("User Cancelled the Operation");

        }

    } else {

        alert(`You Have Following Errors \n ${errors}`);

    }

}


// refill master function
const refillIssueNoteMaster = (obj) => {

    issueNoteMaster = JSON.parse(JSON.stringify(obj));

    oldIssueNoteMaster = JSON.parse(JSON.stringify(obj));

    textDate.value = issueNoteMaster.date;

    selectStatus.value = issueNoteMaster.status;

    textJob.value = issueNoteMaster.job_code

    refreshInnerTable();

}


// check master updates
const checkUpdateIssueNoteMaster = () => {

    let updates = "";

    if (oldIssueNoteMaster.date != issueNoteMaster.date) {

        updates += "Date Is Changed \n";

    }

    if (oldIssueNoteMaster.status != issueNoteMaster.status) {

        updates += "Status Is Changed \n";

    }

    if (oldIssueNoteMaster.job_master_id != issueNoteMaster.job_master_id) {

        updates += "Job Is Changed \n";

    }


    // checking raw materials
    if (issueNoteMaster.rawMaterials.length !== oldIssueNoteMaster.rawMaterials.length) {

        updates += "Raw Materials Are Changed \n";

    } else {

        for (let element of issueNoteMaster.rawMaterials) {

            let extIndex = oldIssueNoteMaster.rawMaterials
                .map(item => item.raw_material_master_id)
                .indexOf(element.raw_material_master_id);

            if (extIndex === -1) {

                updates += "Raw Materials Are Changed \n";

            } else {

                const oldRawMaterial = oldIssueNoteMaster.rawMaterials[extIndex];

                if (
                    oldRawMaterial.quantity != element.quantity ||
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
const updateIssueNoteMaster = async () => {

    const updates = checkUpdateIssueNoteMaster();

    if (updates != "") {

        const userConfirm = confirm(`Are You Sure to Update Following Details

${updates}`);

        if (userConfirm) {

            try {

                const serverResponse = await updateIssueNoteMasterService(
                    issueNoteMaster.id,
                    issueNoteMaster
                );

                if (serverResponse.success) {

                    alert("Update Successful");

                    setTimeout(() => {
                        window.location.reload();
                    }, 500);

                } else {

                    alert("Something Went Wrong");

                }

            } catch (error) {

                console.error(error);

                alert(error.message);

            }

        } else {

            alert("User Cancelled the Operation");

        }

    } else {

        alert("Nothing to Update");

    }

}


// delete master function
const deleteIssueNoteMaster = async (obj) => {

    const userConfirm = confirm(`Are You Sure to Delete Issue Note Details

Date is ${obj.date}

Issue Note Code is ${obj.code}

Status is ${obj.status}
`);

    if (userConfirm) {

        try {

            const serverResponse = await deleteIssueNoteMasterService(obj.id, issueNoteMaster);

            if (serverResponse.success) {

                alert("Delete Successful");

                setTimeout(() => {
                    window.location.reload();
                }, 500);

            } else {

                alert("Something Went Wrong");

            }

        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    }

}


// print function
const printIssueNoteMaster = (obj) => {

    // print functionality can be implemented later

}


// inner functions start from here


// refresh inner form
const refreshInnerForm = async () => {

    issueNoteRawMaterial = new Object();

    oldIssueNoteRawMaterial = null;

    selectItem.style.border = "1px solid #ced4da";

    textQuantity.style.border = "1px solid #ced4da";

    textDescription.style.border = "1px solid #ced4da";

    selectItem.value = "";

    textQuantity.value = "";

    textDescription.value = "";


    rawMaterialsList = await getAllRawMaterialService();

    generateDataList(dataListItem, rawMaterialsList.data, "name");


    const textItem = document.getElementById("selectItem");

    textItem.addEventListener("change", () => {

        const selectedValue = textItem.value;

        const selectedItem = rawMaterialsList.data.find(item =>
            item.name.trim() === selectedValue.trim()
        );

        if (selectedItem) {

            issueNoteRawMaterial.raw_material_master_id =
                selectedItem.raw_material_id;

            issueNoteRawMaterial.raw_material_name =
                selectedItem.name;

            textItem.style.border = "1px solid green";

        } else {

            issueNoteRawMaterial.raw_material_master_id = null;

            issueNoteRawMaterial.raw_material_name = null;

            textItem.style.border = "1px solid red";

        }

    });


    await refreshInnerTable();

}


// refresh inner table
const refreshInnerTable = async () => {

    const tableBody = document.getElementById("innerTableTbody");

    tableBody.innerHTML = "";

    issueNoteMaster.rawMaterials.forEach((item, index) => {

        const row = document.createElement("tr");

        // index cell
        const idCell = document.createElement("td");

        idCell.textContent = index + 1;

        idCell.classList.add("py-2");

        // raw material name cell
        const nameCell = document.createElement("td");

        nameCell.textContent = item.raw_material_name || item.name;

        // quantity cell
        const quantityCell = document.createElement("td");

        quantityCell.textContent = item.quantity;

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

        let extIndex = issueNoteMaster.rawMaterials
            .map(item => item.raw_material_master_id)
            .indexOf(obj.raw_material_master_id);

        if (extIndex !== -1) {

            issueNoteMaster.rawMaterials.splice(extIndex, 1);

            alert("Delete Success");

            await refreshInnerTable();

        }

    }

}


// check inner form errors
const checkInnerFormErrors = () => {

    let errors = "";

    if (issueNoteRawMaterial.raw_material_master_id == null) {

        errors += "Raw Material Cannot Be Empty \n";

        selectItem.style.border = "1px solid red";

    }

    if (
        issueNoteRawMaterial.quantity == null ||
        issueNoteRawMaterial.quantity == ""
    ) {

        errors += "Quantity Cannot Be Empty \n";

        textQuantity.style.border = "1px solid red";

    }

    return errors;

}


// add inner row
const buttonInnerAdd = async () => {

    let errors = checkInnerFormErrors();

    if (errors == "") {

        const userConfirm = confirm("Are You Sure to Add This Raw Material?");

        if (userConfirm) {

            await issueNoteMasterDuplicateCheck();

        }

    } else {

        alert(`You Have Following Errors \n ${errors}`);

    }

}


// check duplicate raw materials
const issueNoteMasterDuplicateCheck = async () => {

    const extIndex = issueNoteMaster.rawMaterials
        .map(item => item.raw_material_master_id)
        .indexOf(issueNoteRawMaterial.raw_material_master_id);

    if (extIndex === -1) {

        issueNoteMaster.rawMaterials.push(issueNoteRawMaterial);

        await refreshInnerTable();

        await refreshInnerForm();

    } else {

        alert("This Raw Material Already Exists");

    }

}




// helping functions start from here
const getIdFromJobCode = async () => {
    const jobField = document.getElementById("textJob");
    const val = jobField.value;

    const serverResponse = await getJobIdByCodeService(val);

    if (serverResponse) {
        issueNoteMaster.job_master_id = serverResponse;
        jobField.classList.remove("is-invalid");
        jobField.classList.add("is-valid");
        console.log(serverResponse);
    } else {
        issueNoteMaster.job_master_id = null;
        jobField.classList.remove("is-valid");
        jobField.classList.add("is-invalid");
        console.log(serverResponse);
    }
};





























