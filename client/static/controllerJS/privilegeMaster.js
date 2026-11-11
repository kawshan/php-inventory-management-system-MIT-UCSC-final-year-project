window.addEventListener('load',function () {


    refreshPrivilegeMasterForm()
    refreshPrivilegeMasterTable()


})


const refreshPrivilegeMasterForm = async ()=>{
    privilegeMaster = new Object();


    comboSelect.style.border = "1px solid #ced4da";
    comboCreate.style.border = "1px solid #ced4da";
    comboUpdate.style.border = "1px solid #ced4da";
    comboDelete.style.border = "1px solid #ced4da";
    selectRole.style.border = "1px solid #ced4da";
    selectModule.style.border = "1px solid #ced4da";



    comboSelect.value = "";
    comboCreate.value = "";
    comboUpdate.value = "";
    comboDelete.value = "";
    selectRole.value = "";
    selectModule.value = "";


    const rolesList = await getAllRolesService();
    generateSelectDropDown(selectRole, rolesList, "data", "name");

    const modulesList = await getAllModulesService();
    generateSelectDropDown(selectModule, modulesList, "data", "name");


}
const refreshPrivilegeMasterTable = async ()=>{

    const privilegeList = await getAllPrivilegeService();
    console.log("PrivilegeList", privilegeList);

    const tableBody = document.getElementById("privilegeMasterTableBody");
    tableBody.innerHTML = ""

    privilegeList.data.forEach((item, index) => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        const selectCell = document.createElement("td");
        selectCell.textContent = item.sel == 1 ? "Active" : "Inactive";

        const insertCell = document.createElement("td");
        insertCell.textContent = item.inst == 1 ? "Active" : "Inactive";

        const updateCell = document.createElement("td");
        updateCell.textContent = item.upd == 1 ? "Active" : "Inactive";

        const deleteCell = document.createElement("td");
        deleteCell.textContent = item.del == 1 ? "Active" : "Inactive";

        const roleCell = document.createElement("td");
        roleCell.textContent = item.role_name;

        const moduleCell = document.createElement("td");
        moduleCell.textContent = item.module_name;


        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillPrivilegeMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printPrivilegeMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deletePrivilegeMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(selectCell);
        row.appendChild(insertCell);
        row.appendChild(updateCell);
        row.appendChild(deleteCell);
        row.appendChild(roleCell);
        row.appendChild(moduleCell);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    })

    new DataTable('#tablePrivilegeMaster', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });

}


const refillPrivilegeMaster = (obj)=>{
    privilegeMaster = JSON.parse(JSON.stringify(obj));
    oldPrivilegeMaster = JSON.parse(JSON.stringify(obj));

    comboSelect.value = privilegeMaster.sel;
    comboCreate.value = privilegeMaster.inst;
    comboUpdate.value = privilegeMaster.upd;
    comboDelete.value = privilegeMaster.del;
    selectRole.value = privilegeMaster.role_id;
    selectModule.value = privilegeMaster.module_id;


}
const printPrivilegeMaster = (obj)=>{



}
const deletePrivilegeMaster = async (obj)=>{
    console.log("Delete", obj);
    const userConfirm = confirm(`Are You Sure To delete Following Data?
Role is ${obj.role_id}
Module is ${obj.module_id}`)
    if (userConfirm) {

        const deleteServerResponse = await deletePrivilegeService(obj.id);
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






const checkErrorsPrivilegeMaster = () => {

    let errors = ""

    if (privilegeMaster.sel == null) {
        errors += "Select Cannot Be Empty \n"
        comboSelect.classList.add("is-invalid");
        comboSelect.style.border = "1px solid red";
    }

    if (privilegeMaster.inst == null) {
        errors += "Insert Cannot Be Empty \n"
        comboCreate.classList.add("is-invalid");
        comboCreate.style.border = "1px solid red";
    }

    if (privilegeMaster.upd == null) {
        errors += "Update Cannot Be Empty \n"
        comboUpdate.classList.add("is-invalid");
        comboUpdate.style.border = "1px solid red";
    }


    if (privilegeMaster.del == null) {
        errors += "Delete Cannot Be Empty \n"
        comboDelete.classList.add("is-invalid");
        comboDelete.style.border = "1px solid red";
    }

    if (privilegeMaster.role_id == null) {
        errors += "Role Cannot Be Empty \n"
        selectRole.classList.add("is-invalid");
        selectRole.style.border = "1px solid red";
    }


    if (privilegeMaster.module_id == null) {
        errors += "Status Cannot Be Empty \n"
        selectModule.classList.add("is-invalid");
        selectModule.style.border = "1px solid red";
    }

    return errors;
}



const savePrivilegeMaster = async () => {
    console.log(privilegeMaster)
    const errors = checkErrorsPrivilegeMaster();
    if (errors !== "") {
        alert(`you have following errors \n ${errors}`);
    } else {
        const userConfirm = confirm(`Are You Sure To Add Following Data
Select is ${privilegeMaster.sel == 1 ? "Active" : "Inactive"}
Insert is ${privilegeMaster.inst == 1 ? "Active" : "Inactive"}
Update is ${privilegeMaster.upd == 1 ? "Active" : "Inactive"}
Delete is ${privilegeMaster.del == 1 ? "Active" : "Inactive"}
Module is ${privilegeMaster.module_id}
Role is ${privilegeMaster.role_id}

`)
        if (userConfirm) {
            const serverResponse = await createPrivilegeService(privilegeMaster);

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




const checkUpdatesPrivilegeMaster = () => {

    let updates = ""

    if (privilegeMaster.sel !== oldPrivilegeMaster.sel) {
        updates += "Select is Updated \n"
    }

    if (privilegeMaster.inst !== oldPrivilegeMaster.inst) {
        updates += "Insert is Updated \n"
    }

    if (privilegeMaster.upd !== oldPrivilegeMaster.upd) {
        updates += "Update is Updated \n"
    }

    if (privilegeMaster.del !== oldPrivilegeMaster.del) {
        updates += "Delete is updated \n"
    }

    if (privilegeMaster.role_id !== oldPrivilegeMaster.role_id) {
        updates += "Role is updated \n"
    }
    if (privilegeMaster.module_id !== oldPrivilegeMaster.module_id) {
        updates += "Module is updated \n"
    }

    return updates;
}


const updatePrivilegeMaster = async () => {
    const updates = checkUpdatesPrivilegeMaster();

    if (updates !== "") {
        const userConfirm = confirm(`Are You Sure to Proceed with Following Changes ${updates}`)
        if (userConfirm) {
            const updateServerResponse = await updatePrivilegeService(privilegeMaster.id, privilegeMaster);
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






























