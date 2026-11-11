window.addEventListener('load',function (){
    refreshUserMasterForm();
    refreshUserMasterTable();


})





const refreshUserMasterForm = async ()=>{

    userMaster = new Object();

    textUserName.style.border="1px solid #ced4da";
    textPassword.style.border="1px solid #ced4da";
    textRePassword.style.border="1px solid #ced4da";
    textEmail.style.border="1px solid #ced4da";
    selectStatus.style.border="1px solid #ced4da";
    selectEmployee.style.border="1px solid #ced4da";
    selectRole.style.border="1px solid #ced4da";


    textUserName.value = "";
    textPassword.value = "";
    textRePassword.value = "";
    textEmail.value = "";
    selectStatus.value = "";
    selectEmployee.value = "";
    selectRole.value = "";


    const getAllEmployeesWithoutUserAccount = await getAllEmployeesWithoutUserAccountService();
    generateSelectDropDown(selectEmployee, getAllEmployeesWithoutUserAccount, "employees", "employee_name");

    const getAllRolesWithoutAdminAndOwner = await getAllRolesWithoutAdminAndOwnerService();
    generateSelectDropDown(selectRole, getAllRolesWithoutAdminAndOwner, "data", "name");



}


const refreshUserMasterTable = async ()=> {

    const usersList = await getAllUserService();
    console.log("users List", usersList);

    const tableBody = document.getElementById("userMasterTableBody");
    tableBody.innerHTML = ""

    usersList.users.forEach((item, index) => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        const userNameCell = document.createElement("td");
        userNameCell.textContent = item.user_name;

        const emailCell = document.createElement("td");
        emailCell.textContent = item.email;

        const EmployeeNameCell = document.createElement("td");
        EmployeeNameCell.textContent = item.employee_name;

        const roleCell = document.createElement("td");
        roleCell.textContent = item.role_name;

        const statusCell = document.createElement("td");
        statusCell.textContent = item.status == 1 ? "Active" : "Inactive";

        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillUserMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printUserMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteUserMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(userNameCell);
        row.appendChild(emailCell);
        row.appendChild(EmployeeNameCell);
        row.appendChild(roleCell);
        row.appendChild(statusCell);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    })

    new DataTable('#tableUserMaster', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });

}




const refillUserMaster = async (obj)=>{

    userMaster = JSON.parse(JSON.stringify(obj));
    oldUserMaster = JSON.parse(JSON.stringify(obj));

    textUserName.value = userMaster.user_name
    textEmail.value = userMaster.email
    selectStatus.value = userMaster.status






    const getAllEmployees = await getAllEmployeeService();
    generateSelectDropDown(selectEmployee, getAllEmployees, "employees", "employee_name");
    selectEmployee.value = userMaster.employee_id



    const getAllRolesWithoutAdminAndOwner = await getAllRolesWithoutAdminAndOwnerService();
    generateSelectDropDown(selectRole, getAllRolesWithoutAdminAndOwner, "data", "name");
    selectRole.value = userMaster.role_id;


}
const printUserMaster = (obj)=>{





}
const deleteUserMaster = async (obj)=>{

    console.log("Delete", obj);
    const userConfirm = confirm(`Are You Sure To delete Following Data?
Name is ${obj.user_name}
Status is ${obj.status}`)
    if (userConfirm) {

        const deleteServerResponse = await deleteUserService(obj.user_id);
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





const checkErrorsUserMaster = () => {

    let errors = ""

    if (userMaster.user_name == null) {
        errors += "Username Cannot Be Empty \n"
        textUserName.classList.add("is-invalid");
        textUserName.style.border = "1px solid red";
    }

    if (userMaster.password == null) {
        errors += "password Cannot Be Empty \n"
        textPassword.classList.add("is-invalid");
        textPassword.style.border = "1px solid red";
    }

    if (userMaster.repassword == null) {
        errors += "Repassword Cannot Be Empty \n"
        textRePassword.classList.add("is-invalid");
        textRePassword.style.border = "1px solid red";
    }


    if (userMaster.email == null) {
        errors += "Email Cannot Be Empty \n"
        textEmail.classList.add("is-invalid");
        textEmail.style.border = "1px solid red";
    }

    if (userMaster.status == null) {
        errors += "Status Cannot Be Empty \n"
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";
    }


    if (userMaster.employee_id == null) {
        errors += "Status Cannot Be Empty \n"
        selectEmployee.classList.add("is-invalid");
        selectEmployee.style.border = "1px solid red";
    }


    if (userMaster.role_id == null) {
        errors += "Status Cannot Be Empty \n"
        selectRole.classList.add("is-invalid");
        selectRole.style.border = "1px solid red";
    }

    return errors;
}



const saveUserMaster = async () => {
    console.log(userMaster)
    const errors = checkErrorsUserMaster();
    if (errors !== "") {
        alert(`you have following errors \n ${errors}`);
    } else {
        const userConfirm = confirm(`Are You Sure To Add Following Data
UserName is ${userMaster.user_name}
Email is ${userMaster.email}
Gender is ${userMaster.status == 1 ? "Active" : "Inactive"}`)
        if (userConfirm) {
            const serverResponse = await createUserService(userMaster);

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




const checkUpdatesUserMaster = () => {

    let updates = ""

    if (userMaster.user_name !== oldUserMaster.user_name) {
        updates += "Username is Updated \n"
    }

    if (userMaster.email !== oldUserMaster.email) {
        updates += "Email is Updated \n"
    }

    if (userMaster.password !== oldUserMaster.password) {
        updates += "Password is Updated \n"
    }

    if (userMaster.status !== oldUserMaster.status) {
        updates += "Status is updated \n"
    }

    if (userMaster.employee_id !== oldUserMaster.employee_id) {
        updates += "Employee is updated \n"
    }
    if (userMaster.role_id !== oldUserMaster.role_id) {
        updates += "Role is updated \n"
    }

    return updates;
}


const updateUserMaster = async () => {
    const updates = checkUpdatesUserMaster();

    if (updates !== "") {
        const userConfirm = confirm(`Are You Sure to Proceed with Following Changes ${updates}`)
        if (userConfirm) {
            const updateServerResponse = await updateUserService(userMaster.user_id, userMaster);
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






function validatePasswords(){

    let password = document.getElementById("textPassword");
    let rePassword = document.getElementById("textRePassword");

    if (password.value === rePassword.value){
        userMaster.password = password.value;
        userMaster.repassword = rePassword.value;
        console.log(`passwords are valid`);

        textPassword.style.border = "1px solid green";
        textRePassword.style.border = "1px solid green";


    }else {
        userMaster.password = null;
        userMaster.repassword = null;
        console.log(`passwords are invalid`);

        textPassword.style.border = "1px solid red";
        textRePassword.style.border = "1px solid red";

    }
}