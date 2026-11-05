window.addEventListener('load', function () {

    refreshEmployeeMasterForm();
    refreshEmployeeMasterTable();


})

const refreshEmployeeMasterForm = async () => {
    employeeMaster = new Object();

    textEmployeeName.value = "";
    textDOB.value = "";
    textNic.value = "";
    selectGender.value = "";
    textEmail.value = "";
    textAddress.value = "";
    selectCivilStatus.value = "";
    selectDesignation.value = "";
    selectStatus.value = "";


    textEmployeeName.style.border = "1px solid #cred4da";
    textDOB.style.border = "1px solid #cred4da";
    textNic.style.border = "1px solid #cred4da";
    selectGender.style.border = "1px solid #cred4da";
    textEmail.style.border = "1px solid #cred4da";
    textAddress.style.border = "1px solid #cred4da";
    selectCivilStatus.style.border = "1px solid #cred4da";
    selectDesignation.style.border = "1px solid #cred4da";
    selectStatus.style.border = "1px solid #cred4da";

    designationsList = await getAllDesignations();
    generateSelectDropDown(selectDesignation, designationsList, "status", "name");


}
const refreshEmployeeMasterTable = async () => {
    const employeeList = await getAllEmployeeService();
    console.log("Employee List", employeeList);

    const tableBody = document.getElementById("employeeMasterTableBody");
    tableBody.innerHTML = ""

    employeeList.employees.forEach((item, index) => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        const nameCell = document.createElement("td");
        nameCell.textContent = item.employee_name;

        const dobCell = document.createElement("td");
        dobCell.textContent = item.dob;

        const nicCell = document.createElement("td");
        nicCell.textContent = item.nic;

        const genderCell = document.createElement("td");
        genderCell.textContent = item.gender == 1 ? "Male" : "Female";

        const emailCell = document.createElement("td");
        emailCell.textContent = item.email;

        const addressCell = document.createElement("td");
        addressCell.textContent = item.address;


        const statusCell = document.createElement("td");
        statusCell.textContent = item.status == 1 ? "Active" : "Inactive";

        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillEmployeeMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printEmployeeMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteEmployeeMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(dobCell);
        row.appendChild(nicCell);
        row.appendChild(genderCell);
        row.appendChild(emailCell);
        row.appendChild(addressCell);
        row.appendChild(statusCell);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);
    });


    new DataTable('#tableEmployeeMaster', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });

}

const refillEmployeeMaster = (obj) => {
    console.log(obj);

    employeeMaster = JSON.parse(JSON.stringify(obj));
    oldEmployeeMaster = JSON.parse(JSON.stringify(obj));

    textEmployeeName.value = employeeMaster.employee_name
    textDOB.value = employeeMaster.dob
    textNic.value = employeeMaster.nic
    selectGender.value = employeeMaster.gender
    textEmail.value = employeeMaster.email
    textAddress.value = employeeMaster.address
    selectCivilStatus.value = employeeMaster.civil_status
    selectDesignation.value = employeeMaster.designation_id
    selectStatus.value = employeeMaster.employee_status


}
const printEmployeeMaster = () => {

}
const deleteEmployeeMaster = async (obj) => {
    console.log("Delete", obj);
    const userConfirm = confirm(`Are You Sure To delete Following Data?
Name is ${obj.employee_name}
Status is ${obj.employee_status}`)
    if (userConfirm) {

        const deleteServerResponse = await deleteEmployeeService(obj.id);
        if (deleteServerResponse.success) {
            alert(`Delete Success`);
            setTimeout(() => {
                window.location.reload();
            }, 500)
        } else {
            alert(`Delete Unsuccessful ${deleteServerResponse.message}`)
        }
    } else {
        alert("Operation Cancelled By User")

    }
}


const checkErrorsEmployeeMaster = () => {

    let errors = ""

    if (employeeMaster.employee_name == null) {
        errors += "Name Cannot Be Empty \n"
        textEmployeeName.classList.add("is-invalid");
        textEmployeeName.style.border = "1px solid red";
    }

    if (employeeMaster.dob == null) {
        errors += "Date of Birth Cannot Be Empty \n"
        textDOB.classList.add("is-invalid");
        textDOB.style.border = "1px solid red";
    }

    if (employeeMaster.nic == null) {
        errors += "NIC Cannot Be Empty \n"
        textNic.classList.add("is-invalid");
        textNic.style.border = "1px solid red";
    }


    if (employeeMaster.gender == null) {
        errors += "Gender Cannot Be Empty \n"
        selectGender.classList.add("is-invalid");
        selectGender.style.border = "1px solid red";
    }

    if (employeeMaster.address == null) {
        errors += "Address Cannot Be Empty \n"
        textAddress.classList.add("is-invalid");
        textAddress.style.border = "1px solid red";
    }

    if (employeeMaster.civil_status == null) {
        errors += "Civil Status Cannot Be Empty \n"
        selectCivilStatus.classList.add("is-invalid");
        selectCivilStatus.style.border = "1px solid red";
    }

    if (employeeMaster.designation_id == null) {
        errors += "Designation Status Cannot Be Empty \n"
        selectDesignation.classList.add("is-invalid");
        selectDesignation.style.border = "1px solid red";
    }

    if (employeeMaster.employee_status == null) {
        errors += "Status Cannot Be Empty \n"
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";
    }

    return errors;
}



const saveEmployeeMaster = async () => {
    const errors = checkErrorsEmployeeMaster();
    if (errors !== "") {
        alert(`you have following errors \n ${errors}`);
    } else {
        const userConfirm = confirm(`Are You Sure To Add Following Data
Name is ${employeeMaster.employee_name}
DOB is ${employeeMaster.dob}
NIC is ${employeeMaster.nic}
Gender is ${employeeMaster.gender == 1 ? "Male" : "Female"}
Address is ${employeeMaster.address}
Civil Status is ${employeeMaster.civil_status == 1 ? "Married" : "Unmarried"}
Employee Status is ${employeeMaster.civil_status == 1 ? "Active" : "Inactive"}`)
        if (userConfirm) {
            const serverResponse = await createEmployeeService(employeeMaster);

            if (serverResponse.success) {
                alert("Save Success")
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            }else {
                alert(`Something Went Wrong: ${serverResponse.message}`);
            }
        }else {
            alert(`Operation Cancelled by user`)
        }
    }
}


const checkUpdatesEmployeeMaster = () => {

    let updates = ""

    if (employeeMaster.employee_name !== oldEmployeeMaster.employee_name) {
        updates += "Name is Updated \n"
    }

    if (employeeMaster.dob !== oldEmployeeMaster.dob) {
        updates += "DOB is Updated \n"
    }

    if (employeeMaster.nic !== oldEmployeeMaster.nic) {
        updates += "NIC is updated \n"
    }

    if (employeeMaster.gender !== oldEmployeeMaster.gender) {
        updates += "Gender is updated \n"
    }
    if (employeeMaster.email !== oldEmployeeMaster.email) {
        updates += "Email is updated \n"
    }

    if (employeeMaster.address !== oldEmployeeMaster.address) {
        updates += "Address is updated \n"
    }

    if (employeeMaster.civil_status !== oldEmployeeMaster.civil_status) {
        updates += "Civil status is Updated \n"
    }

    if (employeeMaster.designation_id !== oldEmployeeMaster.designation_id) {
        updates += "Designation is Updated \n"
    }

    if (employeeMaster.employee_status !== oldEmployeeMaster.employee_status) {
        updates += "Status is Updated \n"
    }
    return updates;
}


const updateEmployeeMaster = async () => {
    const updates = checkUpdatesEmployeeMaster();

    if (updates !== "") {
        const userConfirm = confirm(`Are You Sure to Proceed with Following Changes ${updates}`)
        if (userConfirm) {
            const updateServerResponse = await updateEmployeeService(employeeMaster.id, employeeMaster);
            if (updateServerResponse.success) {
                alert(`Update Success`);
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            } else {
                alert(`Something Went Wrong: ${updateServerResponse.message}`);
            }
        } else {
            alert("User Cancelled The Operation?")
        }
    } else {
        alert("Hmm...... Looks like Nothing To Update")
    }
}


