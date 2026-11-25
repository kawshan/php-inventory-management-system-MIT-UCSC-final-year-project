window.addEventListener('load', function () {

    refreshAssignToPeopleMasterForm();
    refreshAssignToPeopleMasterTable();

});


// master form refresh function
const refreshAssignToPeopleMasterForm = async () => {

    assignMaster = new Object();
    oldAssignMaster = null;
    assignMaster.asset = new Array();

    textDate.value = "";
    selectStatus.value = "";

    textDate.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";

    await refreshInnerForm();

}


// master table refresh function
const refreshAssignToPeopleMasterTable = async () => {

    let assignListResponse = await getAllAssetAssignmentService();

    let assignList = assignListResponse.data ?? assignListResponse;

    console.log("Asset Assignments", assignList);

    const tableBody = document.getElementById("assignToPeopleMasterTableTbody");

    tableBody.innerHTML = "";

    assignList.forEach((item, index) => {

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

        // asset cell
        const assetCell = document.createElement("td");

        assetCell.innerHTML = item.asset
            .map(innerItem =>
                `<span>${innerItem.asset_name} &nbsp;&nbsp;</span>`
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
            refillAssignToPeopleMaster(item);
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
            deleteAssignToPeopleMaster(item);
        };


        // append cells to row
        row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(codeCell);
        row.appendChild(assetCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        actionCell.appendChild(refillButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    });


    new DataTable('#assignToPeopleMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });

}


// master validation function
const checkErrorsAssignToPeopleMaster = () => {

    let errors = "";

    if (assignMaster.date == null || assignMaster.date == "") {

        errors += "Date Cannot Be Empty \n";

        textDate.classList.add("is-invalid");
        textDate.style.border = "1px solid red";

    }

    if (assignMaster.status == null || assignMaster.status === "") {

        errors += "Status Cannot Be Empty \n";

        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";

    }

    if (assignMaster.asset.length == 0) {

        errors += "At Least One Asset Must Be Added \n";

    }

    return errors;

}


// save master function
const saveAssignToPeopleMaster = async () => {

    let errors = checkErrorsAssignToPeopleMaster();

    if (errors == "") {

        const userConfirm = confirm(`Are You Sure To Add Following Details

Date is ${assignMaster.date}

Status is ${assignMaster.status}

Number of Assets is ${assignMaster.asset.length}
`);

        if (userConfirm) {

            try {

                const serverResponse = await saveAssetAssignmentMasterService(assignMaster);

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
const refillAssignToPeopleMaster = (obj) => {

    assignMaster = JSON.parse(JSON.stringify(obj));

    oldAssignMaster = JSON.parse(JSON.stringify(obj));

    textDate.value = assignMaster.date;

    selectStatus.value = assignMaster.status;

    refreshInnerTable();

}


// check master updates
const checkUpdateAssignToPeopleMaster = () => {

    let updates = "";

    if (oldAssignMaster.date != assignMaster.date) {

        updates += "Date Is Changed \n";

    }

    if (oldAssignMaster.status != assignMaster.status) {

        updates += "Status Is Changed \n";

    }


    // checking assets
    if (assignMaster.asset.length !== oldAssignMaster.asset.length) {

        updates += "Assets Are Changed \n";

    } else {

        for (let element of assignMaster.asset) {

            let extIndex = oldAssignMaster.asset
                .map(item => item.asset_master_id)
                .indexOf(element.asset_master_id);

            if (extIndex === -1) {

                updates += "Assets Are Changed \n";

                break;

            } else {

                const oldAsset = oldAssignMaster.asset[extIndex];

                if (
                    oldAsset.from_location != element.from_location ||
                    oldAsset.to_location != element.to_location ||
                    oldAsset.department_master_id != element.department_master_id ||
                    oldAsset.employee_id != element.employee_id ||
                    oldAsset.description != element.description
                ) {

                    updates += "Asset Assignment Details Are Changed \n";

                    break;

                }

            }

        }

    }

    return updates;

}


// update master function
const updateAssignToPeopleMaster = async () => {

    const updates = checkUpdateAssignToPeopleMaster();

    if (updates != "") {

        const userConfirm = confirm(`Are You Sure to Update Following Details

${updates}`);

        if (userConfirm) {

            try {

                const serverResponse = await updateAssetAssignmentMasterService(
                    assignMaster.id,
                    assignMaster
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
const deleteAssignToPeopleMaster = async (obj) => {

    const userConfirm = confirm(`Are You Sure to Delete Assignment Details

Date is ${obj.date}

Assignment Code is ${obj.code}

Status is ${obj.status}
`);

    if (userConfirm) {

        try {

            const serverResponse = await deleteAssetAssignmentMasterService(obj.id,obj);

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
const printAssignToPeopleMaster = (obj) => {

    // print functionality can be implemented later

}


// inner functions start from here


// refresh inner form
const refreshInnerForm = async () => {

    assignAsset = new Object();

    oldAssignAsset = null;

    selectItem.style.border = "1px solid #ced4da";

    selectFromLocation.style.border = "1px solid #ced4da";

    selectToLocation.style.border = "1px solid #ced4da";

    selectDepartment.style.border = "1px solid #ced4da";

    selectItem.value = "";

    selectFromLocation.value = "";

    selectToLocation.value = "";

    selectDepartment.value = "";


    // get all assets
    assetList = await getAllAsseMasterService();

    generateDataList(dataListItem, assetList.data, "name");


    // get all locations
    const locationList = await getAllLocationService();

    generateSelectDropDown(
        selectFromLocation,
        locationList,
        "locations",
        "location_master_name"
    );

    generateSelectDropDown(
        selectToLocation,
        locationList,
        "locations",
        "location_master_name"
    );


    // get all departments
    const departmentList = await getAllDepartmentService();

    generateSelectDropDown(
        selectDepartment,
        departmentList,
        "data",
        "name"
    );


    // asset selection
    const textItem = document.getElementById("selectItem");

    textItem.onchange = () => {

        const selectedValue = textItem.value;

        const selectedItem = assetList.data.find(item =>
            item.name.trim() === selectedValue.trim()
        );

        if (selectedItem) {

            assignAsset.asset_master_id = selectedItem.id;

            assignAsset.asset_name = selectedItem.name;

            textItem.style.border = "1px solid green";

        } else {

            assignAsset.asset_master_id = null;

            assignAsset.asset_name = null;

            textItem.style.border = "1px solid red";

        }

    };


    await refreshInnerTable();

}


// refresh inner table
const refreshInnerTable = async () => {

    if (DataTable.isDataTable('#innerItemTable')) {

        new DataTable('#innerItemTable').destroy();

    }

    const tableBody = document.getElementById("innerTableTbody");

    tableBody.innerHTML = "";

    assignMaster.asset.forEach((item, index) => {

        const row = document.createElement("tr");

        // index cell
        const idCell = document.createElement("td");

        idCell.textContent = index + 1;

        idCell.classList.add("py-2");

        // asset name cell
        const nameCell = document.createElement("td");

        nameCell.textContent = item.asset_name;

        // from location cell
        const fromLocationCell = document.createElement("td");

        fromLocationCell.textContent = item.from_location_name || item.from_location;

        // to location cell
        const toLocationCell = document.createElement("td");

        toLocationCell.textContent = item.to_location_name || item.to_location;

        // department cell
        const departmentCell = document.createElement("td");

        departmentCell.textContent = item.department_name || item.department_master_id;

        // employee cell
        const employeeCell = document.createElement("td");

        employeeCell.textContent = item.employee_name || item.employee_id;

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

        row.appendChild(fromLocationCell);

        row.appendChild(toLocationCell);

        row.appendChild(departmentCell);

        // row.appendChild(employeeCell);

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

        let extIndex = assignMaster.asset
            .map(item => item.asset_master_id)
            .indexOf(obj.asset_master_id);

        if (extIndex !== -1) {

            assignMaster.asset.splice(extIndex, 1);

            alert("Delete Success");

            await refreshInnerTable();

        }

    }

}


// check inner form errors
const checkInnerFormErrors = () => {

    let errors = "";

    if (assignAsset.asset_master_id == null) {

        errors += "Asset Cannot Be Empty \n";

        selectItem.style.border = "1px solid red";

    }

    if (assignAsset.from_location == null || assignAsset.from_location == "") {

        errors += "From Location Cannot Be Empty \n";

        selectFromLocation.style.border = "1px solid red";

    }

    if (assignAsset.to_location == null || assignAsset.to_location == "") {

        errors += "To Location Cannot Be Empty \n";

        selectToLocation.style.border = "1px solid red";

    }

    if (
        assignAsset.from_location != null &&
        assignAsset.to_location != null &&
        assignAsset.from_location == assignAsset.to_location
    ) {

        errors += "From Location and To Location Cannot Be Same \n";

        selectToLocation.style.border = "1px solid red";

    }

    return errors;

}


// add inner row
const buttonInnerAdd = async () => {
// //table ekata user ta show karanna one nisa mewa danne. actual db eke mewa save venne na....
//
// // get selected dropdown values
//     assignAsset.from_location = selectFromLocation.value;
//
//     assignAsset.to_location = selectToLocation.value;
//
//     assignAsset.department_master_id =
//         selectDepartment.value == "" ? null : selectDepartment.value;
//
// // employee and description are not currently available in HTML
//     assignAsset.employee_id = null;
//
//     assignAsset.description = null;





    let errors = checkInnerFormErrors();

    if (errors == "") {

        const userConfirm = confirm("Are You Sure to Add This Asset?");

        if (userConfirm) {

            await assignToPeopleMasterDuplicateCheck();

        }

    } else {

        alert(`You Have Following Errors \n ${errors}`);

    }

}


// check duplicate assets
const assignToPeopleMasterDuplicateCheck = async () => {

    const extIndex = assignMaster.asset
        .map(item => item.asset_master_id)
        .indexOf(assignAsset.asset_master_id);

    if (extIndex === -1) {

        console.log(assignAsset);
        assignMaster.asset.push(assignAsset);

        await refreshInnerTable();

        await refreshInnerForm();
        alert("save success");
    } else {

        alert("This Asset Already Exists");

    }

}