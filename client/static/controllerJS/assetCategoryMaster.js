window.addEventListener('load',async function (){


    refreshAssertCategoryMasterForm();
    await refreshAssertCategoryMasterTable();

})


const refreshAssertCategoryMasterForm  = ()=>{

    assetCategoryMaster = new Object();


    textAssetName.value = "";
    selectStatus.value = "";
    textDescription.value = "";


    textAssetName.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";
    textDescription.style.border = "1px solid #ced4da";



}


const refreshAssertCategoryMasterTable = async ()=>{



    const assetCategoryList = await getAllAssetCategoryService();
    console.log(assetCategoryList);

    const tableBody = document.getElementById("assetCategoryTableBody");
    tableBody.innerHTML = ""

    assetCategoryList.data.forEach((category,index)=>{

        const row = document.createElement("tr");

        const idCell = document.createElement("td")
        idCell.textContent = index+1;

        const categoryNameCell = document.createElement("td");
        categoryNameCell.textContent=category.name;

        const categoryCodeCell = document.createElement("td");
        categoryCodeCell.textContent=category.code;

        const categoryDescriptionCell = document.createElement("td");
        categoryDescriptionCell.textContent=category.description;

        const categoryStatusCell = document.createElement("td");
        categoryStatusCell.textContent=category.status === "1" ? "Active" : "inactive";


        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillAssetCategoryCategoryMaster(category);
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printAssetCategoryCategoryMaster(category);
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteAssetCategoryCategoryMaster(category);
        }

        row.appendChild(idCell);
        row.appendChild(categoryNameCell);
        row.appendChild(categoryCodeCell);
        row.appendChild(categoryDescriptionCell);
        row.appendChild(categoryStatusCell);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);

        tableBody.appendChild(row);

    });

    new DataTable('#tableAssetCategoryMaster', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });
}





const refillAssetCategoryCategoryMaster = (obj)=>{

    assetCategoryMaster = JSON.parse(JSON.stringify(obj));
    oldAssetCategoryMaster = JSON.parse(JSON.stringify(obj));

    textAssetName.value = assetCategoryMaster.name
    selectStatus.value = assetCategoryMaster.status
    textDescription.value = assetCategoryMaster.description
}
const printAssetCategoryCategoryMaster = (obj)=>{



}
const deleteAssetCategoryCategoryMaster = async (obj)=>{
    const userConfirm = confirm(`Are You Sure To Delete Following Data
Name is ${obj.name}
Status is ${obj.status}`);

    if (userConfirm){
        const serverResponse = await deleteAssetCategoryService(obj.id);
        if (serverResponse.success){
            alert(`Delete Success`);
            setTimeout(()=>{
                window.location.reload();
            },500)
        }else {
            alert(`Something Went Wrong`)
        }
    }else {
        alert(`User Cancelled The Operation`)
    }


}

const checkErrors = ()=>{
    let errors = "";

    if (assetCategoryMaster.name == null) {
        errors += "Name Cannot Be Empty \n"
        textAssetName.classList.add("is-invalid");
        textAssetName.style.border="1px solid red";
    }

    if (assetCategoryMaster.status == null) {
        errors += "Status Cannot Be Empty \n"
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border="1px solid red";
    }
    return errors;
}





const saveAssetMasterCategory = async ()=>{
    const errors  = checkErrors();
    if (errors==""){
        const userConfirm = confirm(`Are You Sure To Add Following Data
Name is ${assetCategoryMaster.name}
Status Name is ${assetCategoryMaster.status}`);

        if (userConfirm){
            const serverResponse = await createAssetCategoryService(assetCategoryMaster);
            if (serverResponse.success){
                alert(`Save Success`);
                setTimeout(()=>{
                    window.location.reload();
                },500)
            }else {
                alert(`Something Went Wrong ${serverResponse.message}`)
            }
        }else {
            alert(`User Cancelled the Operation`);
        }
    }else {
        alert(`You Have Following Errors \n ${errors}`);
    }


}





const checkUpdates = ()=>{

    let updates = ""

    if (oldAssetCategoryMaster.name !== assetCategoryMaster.name) {
        updates += "Name is Updated \n"
    }


    if (oldAssetCategoryMaster.status !== assetCategoryMaster.status) {
        updates += "Status is Updated \n"
    }


    if (oldAssetCategoryMaster.description !== assetCategoryMaster.description) {
        updates += "Description is Updated \n"
    }

    return updates;
}




const updateAssetCategoryMaster =async ()=>{
    const updates = checkUpdates();

    if (updates !== ""){
        const userConfirm = confirm(`Are You Sure to Change Following Details \n ${updates}`);
        if (userConfirm){
            const serverResponse = await updateAssetCategoryService(assetCategoryMaster.id, assetCategoryMaster);
            if (serverResponse.success){
                alert(`Update success`);
                setTimeout(()=>{
                    window.location.reload();
                },500)
            }else {
                alert(`Something Went Wrong ${serverResponse.message}`);
            }
        }else {
            alert(`User Cancelled the Operation`)
        }
    }else {
        alert(`Nothing to Update`)
    }



}