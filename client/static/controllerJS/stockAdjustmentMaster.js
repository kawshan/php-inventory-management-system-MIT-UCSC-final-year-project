window.addEventListener("load", () => {

    refreshStockAdjustmentForm();


    refreshStockAdjustmentTable();


});

const refreshStockAdjustmentForm = async () => {

    stockAdjustment = new Object();
    oldStockAdjustment = null;
    stockAdjustment.items = new Array();

    textDate.style.border = "1px solid #ced$da";
    selectBranchName.style.border = "1px solid #ced$da";
    selectStatus.style.border = "1px solid #ced$da";


    textDate.value = ""
    selectBranchName.value = ""
    selectStatus.value = ""


    branchersList = await getAllLocationService();
    generateSelectDropDown(selectBranchName, branchersList, 'locations', 'location_master_name');

    await refreshStockAdjustmentInnerForm();

}


const refreshStockAdjustmentTable = async () => {

    let adjustmentList = await getAllStockAdjustmentService();
    console.log("Adjustments", adjustmentList);

    const tableBody = document.getElementById("stockAdjustmentMasterTableTbody");
    tableBody.innerHTML = "";


    adjustmentList.forEach((item, index) => {
        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;


        const createdDate = document.createElement("td")
        createdDate.textContent = item.stock_adjustment_master_date;

        const branchName = document.createElement("td")
        branchName.textContent = item.location_master.location_master_name;
        branchName.classList.add("text-center")

        const stockAdjustmentStatus = document.createElement("td");
        stockAdjustmentStatus.innerHTML = `<p class="text-center">${item.stock_adjustment_status == 1 ? "Active" : "Inactive"}</p>`;

        const itemNames = document.createElement("td");

        itemNames.innerHTML = item.item_master
            .map(innerItem => `<span class="text-center">${innerItem.item_master_short_name} &nbsp &nbsp </span>`)
            .join("");


        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");

        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("rounded", "bg-emerald-800", "px-3", "py-2", "text-neutral-50", "hover:bg-black");
        refillButton.onclick = () => {
            refillStockAdjustmentMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("rounded", "bg-emerald-800", "px-3", "py-2", "text-neutral-50", "hover:bg-black");
        printButton.onclick = () => {
            printStockAdjustmentMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("rounded", "bg-emerald-800", "px-3", "py-2", "text-neutral-50", "hover:bg-black");
        deleteButton.onclick = () => {
            deleteStockAdjustmentMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(createdDate);
        row.appendChild(branchName);
        row.appendChild(itemNames);
        row.appendChild(stockAdjustmentStatus);


        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);


        tableBody.appendChild(row);

    });


    new DataTable('#stockAdjustmentMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });


}



const checkErrorsStockAdjustmentMaster = () => {
    let errors = "";

    if (stockAdjustment.stock_adjustment_master_date == null) {
        errors += "Date Cannot Be Empty \n"
        textDate.classList.add("is-invalid");
        textDate.style.border = "1px solid red";
    }


    if (stockAdjustment.stock_adjustment_master_status == null) {
        errors += "Status Cannot Be Empty \n"
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";
    }

    if (stockAdjustment.location_master_id == null) {
        errors += "Status Cannot Be Empty \n"
        selectBranchName.classList.add("is-invalid");
        selectBranchName.style.border = "1px solid red";
    }

    return errors;
}


const saveStockAdjustmentMaster = async () => {
    let errors = checkErrorsStockAdjustmentMaster();
    if (errors == "") {
        const userConfirm = confirm(`Are You Sure To Add Following Details
Date is ${stockAdjustment.stock_adjustment_master_date} 
Location is ${stockAdjustment.location_master_id} 
Status is ${stockAdjustment.stock_adjustment_master_status}`);


        if (userConfirm) {
            const serverResponse = await saveStockAdjustmentMasterService(stockAdjustment);
            if (serverResponse.success) {
                alert(`Save Successful`);
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            } else {
                alert(`Something Went Wrong \n ${errors}`)
            }
        } else {
            alert(`User Cancelled the Operation`)
        }
    } else {
        alert(`You Have Following Errors \n ${errors}`)
    }


}




const refillStockAdjustmentMaster = (obj) => {

    stockAdjustment = JSON.parse(JSON.stringify(obj))
    oldStockAdjustment = JSON.parse(JSON.stringify(obj))


    textDate.value = stockAdjustment.stock_adjustment_master_date
    selectBranchName.value = stockAdjustment.location_master_id
    selectStatus.value = stockAdjustment.stock_adjustment_master_status

    refreshStockAdjustmentInnerTable();
}




const checkUpdateStockAdjustmentMaster = ()=>{
    let updates = "";

    if (oldStockAdjustment.stock_adjustment_master_date != stockAdjustment.stock_adjustment_master_date){
        updates+=`Date is Changed \n`
    }

    if (oldStockAdjustment.location_master_id != stockAdjustment.location_master_id){
        updates+=`Location is Changed \n`
    }

    if (oldStockAdjustment.stock_adjustment_master_status != stockAdjustment.stock_adjustment_master_status){
        updates+=`Status is Changed \n`
    }


    if (stockAdjustment.items.length !== oldStockAdjustment.items.length){
        updates+=`Items are changed \n`
    }else {

        for (let element of stockAdjustment.items){
            let extIndex = oldStockAdjustment.items.map(item=>item.item_master_id).indexOf(element.item_master_id);
            if (extIndex === -1){
                updates+=`Items Are Changed \n`
            }
            const oldItem = oldStockAdjustment.items[extIndex];
            if (
                oldItem.stock_adjustment_master_has_item_master_quantity !== element.stock_adjustment_master_has_item_master_quantity ||
                oldItem.stock_adjustment_master_has_item_master_description !== element.stock_adjustment_master_has_item_master_description
            ){
            updates+=`Items are Changed \n`
                break;
            }
        }
    }
    return updates;
}


const updateStockAdjustmentMaster = async ()=>{
    const updates = checkUpdateStockAdjustmentMaster();
    if (updates!=""){
        const userConfirm = confirm(`Are You Sure to Update following Details \n ${updates}`);
        if (userConfirm){
            const serverResponse = await updateStockAdjustmentMasterService(stockAdjustment.stock_adjustment_id,stockAdjustment);
            if (serverResponse.success){
                alert(`Update Successful`);
                setTimeout(()=>{
                    window.location.reload();
                },500);
            }else {
                alert(`Something Went Wrong `)
            }
        }else {
            alert(`Something Went Wrong`)
        }
    }else {
        alert(`Nothing to Update \n`)
    }
}




const deleteStockAdjustmentMaster = async (obj) => {
    const userConfirm = confirm(`Are You Sure to delete Adjustment details
Date is ${obj.stock_adjustment_master_date} 
Location is ${obj.location_master_id} 
Status is ${obj.stock_adjustment_master_status}   
    `);

    if (userConfirm){
        const serverResponse = await deleteStockAdjustmentMasterService(obj.stock_adjustment_id);
        if (serverResponse.success){
            alert(`Delete Successful`);
            setTimeout(()=>{
                window.location.reload();
            })
        }
    }
}





const printStockAdjustmentMaster = (obj) => {


}






// inner item functions are starts from here
const refreshStockAdjustmentInnerForm = async ()=>{
    stockAdjustmentItem = new Object();
    oldStockAdjustmentItem = null;

    selectItem.style.border="2px solid #ced4da";
    textQuantity.style.border="2px solid #ced4da";
    textDescription.style.border="2px solid #ced4da";

    selectItem.value="";
    textQuantity.value="";
    textDescription.value="";


    itemsList = await getAllItems();
    generateDataList(dataListItem,itemsList.data,"item_master_short_name");

    const textItem = document.getElementById("selectItem");

    textItem.addEventListener("change", () => {

        const selectedValue = textItem.value;

        const selectedItem = itemsList.data.find(item =>
            item.item_master_short_name === selectedValue
        );

        if (selectedItem) {
            stockAdjustmentItem.item_master_id = selectedItem.id;
            stockAdjustmentItem.item_master_short_name = selectedItem.item_master_short_name;
            textItem.style.border="1px solid green";
        } else {
            stockAdjustmentItem.item_master_id = null;
            textItem.style.border="1px solid red";
        }

    });

    refreshStockAdjustmentInnerTable();
}








const refreshStockAdjustmentInnerTable =  ()=>{


    const tableBody = document.getElementById("innerTableTbody");
    tableBody.innerHTML = ""

    stockAdjustment.items.forEach((item, index) => {


        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;
        idCell.classList.add("py-2");

        const nameCell = document.createElement("td");
        nameCell.textContent = item.item_master_short_name;

        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.stock_adjustment_master_has_item_master_quantity;

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = item.stock_adjustment_master_has_item_master_description;

        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-600", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteInnerRow(item)
        }

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


const deleteInnerRow = async (obj) =>{
    const userConfirm = confirm(`Are You Sure to Delete`);
    if (userConfirm){
        let extIndex = stockAdjustment.items.map(item=>item.item_master_id).indexOf(obj.item_master_id);
        if (extIndex!==-1){
            stockAdjustment.items.splice(extIndex,1);
            alert(`Delete Success`);
            await refreshStockAdjustmentInnerForm();
        }
    }
}


const checkInnerFormErrors = ()=>{
    let errors=""

    if (stockAdjustmentItem.item_master_id == null){
        errors+="Item Cannot be Empty \n"
        selectItem.style.border="1px solid red";
    }

    if (stockAdjustmentItem.stock_adjustment_master_has_item_master_quantity == null){
        errors+=`Quantity Cannot Be Empty \n`
        textQuantity.style.border="1px solid red";
    }

    return errors;
}





const buttonInnerAdd = async ()=>{
    let errors = checkInnerFormErrors();
    if (errors==""){
        const userConfirm = confirm(`Are You Sure to add`)
        if (userConfirm){
            stockAdjustment.items.push(stockAdjustmentItem);
            refreshStockAdjustmentInnerTable();
            await refreshStockAdjustmentInnerForm();
        }
    }else {
        alert(`You Have Following Errors \n ${errors}`)
    }
}

