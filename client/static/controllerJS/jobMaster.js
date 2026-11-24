window.addEventListener('load', function () {

    refreshJobMasterForm();
    refreshJobMasterTable();

});


// master form refresh function
const refreshJobMasterForm = async () => {

    jobMaster = new Object();
    oldJobMaster = null;
    jobMaster.items = new Array();

    textDate.value = "";
    selectStatus.value = "";

    textDate.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";

    await refreshInner();

}


// master table refresh function
const refreshJobMasterTable = async () => {

    let jobList = await getAllJobService();

    console.log("Jobs", jobList);

    const tableBody = document.getElementById("jobMasterTableTbody");

    tableBody.innerHTML = "";

    jobList.forEach((item, index) => {

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

        // item cell
        const itemCell = document.createElement("td");

        itemCell.innerHTML = item.items
            .map(innerItem => `<span>${innerItem.item_master_short_name} &nbsp;&nbsp;</span>`)
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
            refillJobMaster(item);
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
            deleteJobMaster(item);
        };


        // append cells to row
        row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(codeCell);
        row.appendChild(itemCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        actionCell.appendChild(refillButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    });


    new DataTable('#jobMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });

}


// master validation function
const checkErrorsJobMaster = () => {

    let errors = "";

    if (jobMaster.date == null || jobMaster.date == "") {

        errors += "Date Cannot Be Empty \n";

        textDate.classList.add("is-invalid");
        textDate.style.border = "1px solid red";

    }

    if (jobMaster.status == null || jobMaster.status == "") {

        errors += "Status Cannot Be Empty \n";

        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";

    }

    return errors;

}


// save master function
const saveJobMaster = async () => {

    let errors = checkErrorsJobMaster();

    if (errors == "") {

        const userConfirm = confirm(`Are You Sure To Add Following Details

Date is ${jobMaster.date}

Status is ${jobMaster.status}

Number of Items is ${jobMaster.items.length}
`);

        if (userConfirm) {

            const serverResponse = await saveJobMasterService(jobMaster);

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
const refillJobMaster = (obj) => {

    jobMaster = JSON.parse(JSON.stringify(obj));

    oldJobMaster = JSON.parse(JSON.stringify(obj));

    textDate.value = jobMaster.date;

    selectStatus.value = jobMaster.status;

    refreshInnerTable();

}


// check master updates
const checkUpdateJobMaster = () => {

    let updates = "";

    if (oldJobMaster.date != jobMaster.date) {

        updates += "Date Is Changed \n";

    }

    if (oldJobMaster.status != jobMaster.status) {

        updates += "Status Is Changed \n";

    }


    // checking items
    if (jobMaster.items.length !== oldJobMaster.items.length) {

        updates += "Items Are Changed \n";

    } else {

        for (let element of jobMaster.items) {

            let extIndex = oldJobMaster.items
                .map(item => item.item_master_id)
                .indexOf(element.item_master_id);

            if (extIndex === -1) {

                updates += "Items Are Changed \n";

                break;

            } else {

                const oldItem = oldJobMaster.items[extIndex];

                if (
                    oldItem.quantity != element.quantity ||
                    oldItem.description != element.description
                ) {

                    updates += "Items Are Changed \n";

                    break;

                }

            }

        }

    }

    return updates;

}


// update master function
const updateJobMaster = async () => {

    const updates = checkUpdateJobMaster();

    if (updates != "") {

        const userConfirm = confirm(`Are You Sure to Update Following Details

${updates}`);

        if (userConfirm) {

            const serverResponse = await updateJobMasterService(
                jobMaster.id,
                jobMaster
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
const deleteJobMaster = async (obj) => {

    const userConfirm = confirm(`Are You Sure to Delete Job Details

Date is ${obj.date}

Code is ${obj.code}

Status is ${obj.status}
`);

    if (userConfirm) {

        const serverResponse = await deleteJobMasterService(obj.id);

        if (serverResponse.success) {

            alert("Delete Successful");

            setTimeout(() => {
                window.location.reload();
            }, 500);

        }

    }

}


// print function
const printJobMaster = (obj) => {

    // print functionality can be implemented later

}



// inner functions start from here


// refresh inner form
const refreshInner = async () => {

    jobItem = new Object();

    oldJobItem = null;

    selectItem.style.border = "1px solid #ced4da";

    textQuantity.style.border = "1px solid #ced4da";

    textDescription.style.border = "1px solid #ced4da";

    selectItem.value = "";

    textQuantity.value = "";

    textDescription.value = "";


    itemsList = await getAllItems();

    generateDataList(dataListItem, itemsList.data, "item_master_short_name");


    // item selection
    selectItem.onchange = () => {

        const selectedValue = selectItem.value;

        const selectedItem = itemsList.data.find(item =>
            item.item_master_short_name.trim() === selectedValue.trim()   // ai trim damme. acccidentional spaces thiyenne pluwan anthimata. ekayi
        );

        if (selectedItem) {

            jobItem.item_master_id = selectedItem.id;

            jobItem.name = selectedItem.item_master_short_name;

            selectItem.style.border = "1px solid green";

        } else {

            jobItem.item_master_id = null;

            jobItem.name = null;

            selectItem.style.border = "1px solid red";

        }

    };


    await refreshInnerTable();

}


// refresh inner table
const refreshInnerTable = async () => {

    const tableBody = document.getElementById("innerTableTbody");

    tableBody.innerHTML = "";

    jobMaster.items.forEach((item, index) => {

        const row = document.createElement("tr");

        // index cell
        const idCell = document.createElement("td");

        idCell.textContent = index + 1;

        idCell.classList.add("py-2");

        // item name cell
        const nameCell = document.createElement("td");

        nameCell.textContent = item.item_master_short_name || item.name;

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

        let extIndex = jobMaster.items
            .map(item => item.item_master_id)
            .indexOf(obj.item_master_id);

        if (extIndex !== -1) {

            jobMaster.items.splice(extIndex, 1);

            alert("Delete Success");

            await refreshInnerTable();

        }

    }

}


// check inner form errors
const checkInnerFormErrors = () => {

    let errors = "";

    if (jobItem.item_master_id == null) {

        errors += "Item Cannot Be Empty \n";

        selectItem.style.border = "1px solid red";

    }

    if (jobItem.quantity == null || jobItem.quantity == "") {

        errors += "Quantity Cannot Be Empty \n";

        textQuantity.style.border = "1px solid red";

    }

    return errors;

}


// add inner row
const buttonInnerAdd = async () => {

    let errors = checkInnerFormErrors();

    if (errors == "") {

        const userConfirm = confirm("Are You Sure to Add This Item?");

        if (userConfirm) {

            await jobMasterDuplicateCheck();

        }

    } else {

        alert(`You Have Following Errors \n ${errors}`);

    }

}


// check duplicate items
const jobMasterDuplicateCheck = async () => {

    const extIndex = jobMaster.items
        .map(item => item.item_master_id)
        .indexOf(jobItem.item_master_id);

    if (extIndex === -1) {

        jobMaster.items.push(jobItem);

        await refreshInnerTable();

        await refreshInner();

    } else {

        alert("This Item Already Exists");

    }

}