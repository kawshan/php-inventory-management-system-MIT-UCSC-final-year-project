window.addEventListener('load',function (){

    refreshRawMaterialCategoryForm();
    refreshRawMaterialCategoryTable();



})

const refreshRawMaterialCategoryForm = ()=>{
    rawMaterialCategory = new Object();

    textRawMaterialCategoryName.style.border = "1px solid #ced4da";
    textRawMaterialSize.style.border = "1px solid #ced4da";
    textRawMaterialShape.style.border = "1px solid #ced4da";
    textVolume.style.border = "1px solid #ced4da";
    textRawMaterialMarginalOrderQuantity.style.border = "1px solid #ced4da";
    textRawMaterialPacking.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";
    textDescription.style.border = "1px solid #ced4da";

    textRawMaterialCategoryName.value = "";
    textRawMaterialSize.value = "";
    textRawMaterialShape.value = "";
    textVolume.value = "";
    textRawMaterialMarginalOrderQuantity.value = "";
    textRawMaterialPacking.value = "";
    selectStatus.value = "";
    textDescription.value = "";



}
const refreshRawMaterialCategoryTable = async ()=>{

    const rawMaterialCategoriesList = await getAllRawMaterialCategoryService();
    console.log("raw material categories list",rawMaterialCategoriesList);

    const tableBody = document.getElementById("rawMaterialCategoryTableBody");
    tableBody.innerHTML = ""

    rawMaterialCategoriesList.data.forEach((item, index) => {

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        const codeCell = document.createElement("td");
        codeCell.textContent = item.code;

        const sizeCell = document.createElement("td");
        sizeCell.textContent = item.size;

        const shapeCell = document.createElement("td");
        shapeCell.textContent = item.shape;

        const volumeCell = document.createElement("td");
        volumeCell.textContent = item.volume;

        const moqCell = document.createElement("td");
        moqCell.textContent = item.marginal_order_quantity;

        const packingCell = document.createElement("td");
        packingCell.textContent = item.packing;

        const statusCell = document.createElement("td");
        statusCell.textContent = item.status == 1 ? "Active" : "Inactive";

        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillRawMaterialCategoryMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printRawMaterialCategory(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteRawMaterialCategoryMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(codeCell);
        row.appendChild(sizeCell);
        row.appendChild(shapeCell);
        row.appendChild(volumeCell);
        row.appendChild(moqCell);
        row.appendChild(packingCell);
        row.appendChild(statusCell);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);
    });


    new DataTable('#tableRawMaterialCategory', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });


}




const refillRawMaterialCategoryMaster = (obj) => {
    console.log(obj);

    rawMaterialCategory = JSON.parse(JSON.stringify(obj));
    oldRawMaterialCategory = JSON.parse(JSON.stringify(obj));


    textRawMaterialCategoryName.value = rawMaterialCategory.name;
    textRawMaterialSize.value = rawMaterialCategory.size;
    textRawMaterialShape.value = rawMaterialCategory.shape;
    textVolume.value = rawMaterialCategory.volume
    textRawMaterialMarginalOrderQuantity.value = rawMaterialCategory.marginal_order_quantity
    textRawMaterialPacking.value = rawMaterialCategory.packing
    selectStatus.value = rawMaterialCategory.status
    textDescription.value = rawMaterialCategory.description
}


const deleteRawMaterialCategoryMaster = async (obj) => {
    console.log("Delete", obj);
    const userConfirm = confirm(`Are You Sure To delete Following Data?
Name is ${obj.name}
Status is ${obj.status}`)
    if (userConfirm) {

        const deleteServerResponse = await deleteRawMaterialCategoryService(obj.id);
        if (deleteServerResponse.success) {
            alert(`Delete Success`);
            setTimeout(()=>{
              window.location.reload();
            },500)
        } else {
            alert(`Delete Unsuccessful ${deleteServerResponse.message}`)
        }
    } else {
        alert("Operation Cancelled By User")

    }
}


const printRawMaterialCategory = ()=>{

}





const printItemMaster = (obj) => {
    console.log(obj)
}


const checkErrors = () => {

    let errors = ""

    if (rawMaterialCategory.name == null) {
        errors += "Name Cannot Be Empty \n"
        textRawMaterialCategoryName.classList.add("is-invalid");
        textRawMaterialCategoryName.style.border="1px solid red";
    }

    if (rawMaterialCategory.status == null) {
        errors += "Short Name Cannot Be Empty \n"
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border="1px solid red";
    }
    return errors;
}


const saveRawMaterialCategory = async () => {
    const errors = checkErrors();

    if (errors !== "") {
        alert(`you have following errors \n ${errors}`);
    }
    const userConfirm = confirm(`Are You Sure To Add Following Data
Name is ${rawMaterialCategory.name}
Status ${rawMaterialCategory.status}`)
    if (!userConfirm) {
        alert("Operation Cancelled By User")
    }

    try {
        const serverResponse = await createRawMaterialCategoryService(rawMaterialCategory);

        if (serverResponse.success) {
            alert("Save Success")
            setTimeout(()=>{
                window.location.reload();
            },500)
        } else {
            alert(`Something Went Wrong: ${serverResponse.message}`);
        }
    } catch (error) {
        alert(`Something Went Wrong: ${error.message}`);
    }
};










const checkUpdatesRawMaterialCategory = () => {

    let updates = ""

    if (oldRawMaterialCategory.name !== rawMaterialCategory.name) {
        updates += "Name is Updated \n"
    }

    if (oldRawMaterialCategory.size !== rawMaterialCategory.size) {
        updates += "Size is Updated \n"
    }

    if (oldRawMaterialCategory.shape !== rawMaterialCategory.shape) {
        updates += "Shape is updated \n"
    }

    if (oldRawMaterialCategory.description !== rawMaterialCategory.description) {
        updates += "Description is updated \n"
    }
    if (oldRawMaterialCategory.volume !== rawMaterialCategory.volume) {
        updates += "Volume is updated \n"
    }

    if (oldRawMaterialCategory.marginal_order_quantity !== rawMaterialCategory.marginal_order_quantity) {
        updates += "MOQ is updated \n"
    }

    if (oldRawMaterialCategory.packing !== rawMaterialCategory.packing) {
        updates += "Packing is Updated \n"
    }

    if (oldRawMaterialCategory.status !== rawMaterialCategory.status) {
        updates += "Status is Updated \n"
    }
    return updates;
}


const updateRawMaterialCategory = async () => {
    const updates = checkUpdatesRawMaterialCategory();

    if (updates !== "") {
        const userConfirm = confirm(`Are You Sure to Proceed with Following Changes ${updates}`)
        if (userConfirm) {
            console.log(rawMaterialCategory.id)
            const updateServerResponse = await updateRawMaterialCategoryService(rawMaterialCategory.id, rawMaterialCategory);
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





