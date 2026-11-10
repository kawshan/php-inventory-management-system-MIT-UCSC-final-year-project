window.addEventListener('load',function (){


    refreshRawMaterialForm();
    refreshRawMaterialTable();


})

const refreshRawMaterialForm =async ()=>{
    rawMaterialMaster = new Object();

    selectRawMaterialCategory.style.border="1px solid #ced4da";
    textRawMaterialName.style.border="1px solid #ced4da";
    textRawMaterialPacking.style.border="1px solid #ced4da";
    textRate.style.border="1px solid #ced4da";
    textReOrderLevel.style.border="1px solid #ced4da";
    selectStatus.style.border="1px solid #ced4da";
    textDescription.style.border="1px solid #ced4da";

    selectRawMaterialCategory.value= "";
    textRawMaterialName.value= "";
    textRawMaterialPacking.value= "";
    textRate.value= "";
    textReOrderLevel.value= "";
    selectStatus.value= "";
    textDescription.value= "";

    const rawMaterialCategoriesList = await getAllRawMaterialCategoryService();
    generateSelectDropDown(selectRawMaterialCategory, rawMaterialCategoriesList, "data", "name");


}
const refreshRawMaterialTable = async ()=>{

    const rawMaterialList = await getAllRawMaterialService();
    console.log("rawMaterial List", rawMaterialList);

    const tableBody = document.getElementById("rawMaterialCategoryTableBody");
    tableBody.innerHTML = ""

    rawMaterialList.data.forEach((item, index) => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        const nameCell = document.createElement("td");
        nameCell.textContent = item.raw_material_name;

        const codeCell = document.createElement("td");
        codeCell.textContent = item.code;

        const packingCell = document.createElement("td");
        packingCell.textContent = item.packing;

        const rateCell = document.createElement("td");
        rateCell.textContent = item.rate;

        const reOrderCell = document.createElement("td");
        reOrderCell.textContent = item.re_order_level;


        const statusCell = document.createElement("td");
        statusCell.textContent = item.status == 1 ? "Active" : "Inactive";

        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillRawMaterialMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printRawMaterialMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteRawMaterialMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(codeCell);
        row.appendChild(packingCell);
        row.appendChild(rateCell);
        row.appendChild(reOrderCell);
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


const refillRawMaterialMaster = (obj)=>{
    rawMaterialMaster = JSON.parse(JSON.stringify(obj));
    oldRawMaterialMaster = JSON.parse(JSON.stringify(obj));

    selectRawMaterialCategory.value = rawMaterialMaster.raw_material_category_id
    textRawMaterialName.value = rawMaterialMaster.raw_material_name
    textRawMaterialPacking.value = rawMaterialMaster.packing
    textRate.value = rawMaterialMaster.rate
    textReOrderLevel.value = rawMaterialMaster.re_order_level
    selectStatus.value = rawMaterialMaster.status
    textDescription.value = rawMaterialMaster.description



}
const printRawMaterialMaster = ()=>{




}
const deleteRawMaterialMaster = async (obj)=>{
    console.log("Delete", obj);
    const userConfirm = confirm(`Are You Sure To delete Following Data?
Name is ${obj.raw_material_name}
Status is ${obj.status}`)
    if (userConfirm) {

        const deleteServerResponse = await deleteRawMaterialService(obj.raw_material_id);
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



const checkErrorsRawMaterialMaster = () => {

    let errors = ""

    if (rawMaterialMaster.name == null) {
        errors += "Name Cannot Be Empty \n"
        textRawMaterialName.classList.add("is-invalid");
        textRawMaterialName.style.border = "1px solid red";
    }

    if (rawMaterialMaster.raw_material_category_id == null) {
        errors += "Category Cannot Be Empty \n"
        selectRawMaterialCategory.classList.add("is-invalid");
        selectRawMaterialCategory.style.border = "1px solid red";
    }

    if (rawMaterialMaster.packing == null) {
        errors += "Packing Cannot Be Empty \n"
        textRawMaterialPacking.classList.add("is-invalid");
        textRawMaterialPacking.style.border = "1px solid red";
    }


    if (rawMaterialMaster.rate == null) {
        errors += "Rate Cannot Be Empty \n"
        textRate.classList.add("is-invalid");
        textRate.style.border = "1px solid red";
    }

    if (rawMaterialMaster.status == null) {
        errors += "Status Cannot Be Empty \n"
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";
    }

    return errors;
}



const saveRawMaterialMaster = async () => {
    const errors = checkErrorsRawMaterialMaster();
    if (errors !== "") {
        alert(`you have following errors \n ${errors}`);
    } else {
        const userConfirm = confirm(`Are You Sure To Add Following Data
Name is ${rawMaterialMaster.name}
Status is ${rawMaterialMaster.status == 1 ? "Active" : "Inactive"}`)
        if (userConfirm) {
            const serverResponse = await createRawMaterialService(rawMaterialMaster);

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



const checkUpdatesRawMaterialMaster = () => {

    let updates = ""

    if (rawMaterialMaster.name !== oldRawMaterialMaster.name) {
        updates += "Name is Updated \n"
    }

    if (rawMaterialMaster.packing !== oldRawMaterialMaster.packing) {
        updates += "Packing is Updated \n"
    }

    if (rawMaterialMaster.rate !== oldRawMaterialMaster.rate) {
        updates += "Rate is updated \n"
    }

    if (rawMaterialMaster.re_order_level !== oldRawMaterialMaster.re_order_level) {
        updates += "Re Order Level is updated \n"
    }
    if (rawMaterialMaster.status !== oldRawMaterialMaster.status) {
        updates += "Status is updated \n"
    }

    if (rawMaterialMaster.description !== oldRawMaterialMaster.description) {
        updates += "Description is updated \n"
    }

    if (rawMaterialMaster.raw_material_category_id !== oldRawMaterialMaster.raw_material_category_id) {
        updates += "Category is updated \n"
    }


    return updates;
}


const updateEmployeeMaster = async () => {
    console.log(rawMaterialMaster)
    const updates = checkUpdatesRawMaterialMaster();

    if (updates !== "") {
        const userConfirm = confirm(`Are You Sure to Proceed with Following Changes ${updates}`)
        if (userConfirm) {
            const updateServerResponse = await updateRawMaterialService(rawMaterialMaster.raw_material_id, rawMaterialMaster);
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




