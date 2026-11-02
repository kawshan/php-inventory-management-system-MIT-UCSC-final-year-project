window.addEventListener('load',function (){

   refreshStockTransferForm();
   refreshStockTransferTable();


});


const refreshStockTransferForm = async ()=>{

    stockTransfer = new Object();
    oldStockTransfer = null;
    stockTransfer.items  = new Array();

    textDate.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";

    textDate.value = ""
    selectStatus.value = ""




    await refreshStockTransferInnerForm();

}


const refreshStockTransferTable = async ()=>{

    let transfersList = await getAllStockTransferService();
    console.log("Transfers", transfersList);

    const tableBody = document.getElementById("stockTransferMasterTableTbody");
    tableBody.innerHTML = "";


    transfersList.forEach((item, index) => {
        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;


        const createdDate = document.createElement("td")
        createdDate.textContent = item.stock_transfer_master_date;

        const fromLocation = document.createElement("td")
        fromLocation.textContent = item.location.from_location_name;
        fromLocation.classList.add("text-center")


        const toLocation = document.createElement("td")
        toLocation.textContent = item.location.to_location_name;
        toLocation.classList.add("text-center")

        const stockTransferStatus = document.createElement("td");
        stockTransferStatus.innerHTML = `<p class="text-center">${item.stock_transfer_master_status == 1 ? "Active" : "Inactive"}</p>`;

        const itemNames = document.createElement("td");

        itemNames.innerHTML = item.items
            .map(innerItem => `<span class="text-center">${innerItem.item_master_short_name} &nbsp &nbsp </span>`)
            .join("");


        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");

        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("rounded", "bg-emerald-800", "px-3", "py-2", "text-neutral-50", "hover:bg-black");
        refillButton.onclick = () => {
            refillStockTransferMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("rounded", "bg-emerald-800", "px-3", "py-2", "text-neutral-50", "hover:bg-black");
        printButton.onclick = () => {
            printStockTransferMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("rounded", "bg-emerald-800", "px-3", "py-2", "text-neutral-50", "hover:bg-black");
        deleteButton.onclick = () => {
            deleteStockTransferMaster(item)
        }


        row.appendChild(idCell);
        row.appendChild(createdDate);
        row.appendChild(fromLocation);
        row.appendChild(toLocation);
        row.appendChild(itemNames);
        row.appendChild(stockTransferStatus);


        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);


        tableBody.appendChild(row);

    });


    new DataTable('#stockTransferMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });


}



const checkErrorsStockTransferMaster = () => {
    let errors = "";

    if (stockTransfer.stock_transfer_master_date == null) {
        errors += "Date Cannot Be Empty \n"
        textDate.classList.add("is-invalid");
        textDate.style.border = "1px solid red";
    }


    if (stockTransfer.stock_transfer_master_status == null) {
        errors += "Status Cannot Be Empty \n"
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border = "1px solid red";
    }

    return errors;
}




const saveStockTransferMaster = async () => {
    let errors = checkErrorsStockTransferMaster();
    if (errors == "") {
        const userConfirm = confirm(`Are You Sure To Add Following Details
Date is ${stockTransfer.stock_transfer_master_date} 
Status is ${stockTransfer.stock_transfer_master_status}`);


        if (userConfirm) {
            const serverResponse = await saveStockTransferMasterService(stockTransfer);
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










const refillStockTransferMaster = (obj)=>{
    stockTransfer = JSON.parse(JSON.stringify(obj))
    oldStockTransfer = JSON.parse(JSON.stringify(obj))


    textDate.value = stockTransfer.stock_transfer_master_date
    selectStatus.value = stockTransfer.stock_transfer_master_status

    refreshStockTransferInnerTable();

}



const checkUpdateStockTransferMaster = ()=>{
    let updates = "";

    if (oldStockTransfer.stock_transfer_master_date != stockTransfer.stock_transfer_master_date){
        updates+=`Date is Changed \n`
    }

    if (oldStockTransfer.stock_transfer_master_status != stockTransfer.stock_transfer_master_status){
        updates+=`Status is Changed \n`
    }


    if (stockTransfer.items.length !== oldStockTransfer.items.length){
        updates+=`Items are changed \n`
    }else {

        for (let element of stockTransfer.items){
            let extIndex = oldStockTransfer.items.map(item=>item.item_master_id).indexOf(element.item_master_id);
            if (extIndex === -1){
                updates+=`Items Are Changed \n`
            }
            const oldItem = oldStockTransfer.items[extIndex];
            if (
                oldItem.stock_transfer_master_has_item_master_quantity !== element.stock_transfer_master_has_item_master_quantity ||
                oldItem.stock_transfer_master_has_item_master_description !== element.stock_transfer_master_has_item_master_description||
                oldItem.from_location !== element.from_location||
                oldItem.to_location !== element.to_location
            ){
                updates+=`Items are Changed \n`
                break;
            }
        }
    }
    return updates;
}




const updateStockTransferMaster = async ()=>{
    const updates = checkUpdateStockTransferMaster();
    if (updates!=""){
        const userConfirm = confirm(`Are You Sure to Update following Details \n ${updates}`);
        if (userConfirm){
            const serverResponse = await updateStockTransferMasterService(stockTransfer.stock_transfer_master_id,stockTransfer);
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


const deleteStockTransferMaster = async (obj)=>{
    const userConfirm = confirm(`Are You Sure to delete Transfer details
Date is ${obj.stock_transfer_master_date} 
Status is ${obj.stock_transfer_master_status}   
    `);

    if (userConfirm){
        const serverResponse = await deleteStockTransferMasterService(obj.stock_transfer_master_id);
        if (serverResponse.success){
            alert(`Delete Successful`);
            setTimeout(()=>{
                window.location.reload();
            })
        }
    }

}




const printStockTransferMaster = ()=>{


}



















// inner item functions stats from here
const refreshStockTransferInnerForm = async ()=>{

    stockTransferItem = new Object();
    oldStockTransferItem = null;


    selectItem.style.border="2px solid #ced4da";
    textQuantity.style.border="2px solid #ced4da";
    textDescription.style.border="2px solid #ced4da";
    selectFromLocation.style.border="2px solid #ced4da";
    selectToLocation.style.border="2px solid #ced4da";

    selectItem.value="";
    textQuantity.value="";
    textDescription.value="";
    selectFromLocation.value="";
    selectToLocation.value="";


    branchersList = await getAllLocationService();
    generateSelectDropDown(selectFromLocation, branchersList, 'locations', 'location_master_name');
    generateSelectDropDown(selectToLocation, branchersList, 'locations', 'location_master_name');






    itemsList = await getAllItems();
    generateDataList(dataListItem,itemsList.data,"item_master_short_name");

    const textItem = document.getElementById("selectItem");

    textItem.addEventListener("change", () => {

        const selectedValue = textItem.value;

        const selectedItem = itemsList.data.find(item =>
            item.item_master_short_name === selectedValue
        );

        if (selectedItem) {
            stockTransferItem.item_master_id = selectedItem.id;
            stockTransferItem.item_master_short_name = selectedItem.item_master_short_name;
            textItem.style.border="1px solid green";
        } else {
            stockTransferItem.item_master_id = null;
            textItem.style.border="1px solid red";
        }

    });

















}


const refreshStockTransferInnerTable = ()=>{

    const tableBody = document.getElementById("innerTableTbody");
    tableBody.innerHTML = ""

    stockTransfer.items.forEach((item, index) => {


        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;
        idCell.classList.add("py-2");

        const nameCell = document.createElement("td");
        nameCell.textContent = item.item_master_short_name;

        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.stock_transfer_master_has_item_master_quantity;

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = item.stock_transfer_master_has_item_master_description;

        const fromCell = document.createElement("td");
        fromCell.textContent = item.from_location;

        const toCell = document.createElement("td");
        toCell.textContent = item.to_location;

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
        row.appendChild(fromCell);
        row.appendChild(toCell);
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
        let extIndex = stockTransfer.items.map(item=>item.item_master_id).indexOf(obj.item_master_id);
        if (extIndex!==-1){
            stockTransfer.items.splice(extIndex,1);
            alert(`Delete Success`);
            await refreshStockTransferInnerForm();
        }
    }
}


const checkInnerFormErrors = ()=>{
    let errors=""

    if (stockTransferItem.item_master_id == null){
        errors+="Item Cannot be Empty \n"
        selectItem.style.border="1px solid red";
    }

    if (stockTransferItem.from_location == null){
        errors+="From Location Cannot be Empty \n"
        selectFromLocation.style.border="1px solid red";
    }


    if (stockTransferItem.to_location == null){
        errors+="To Location Cannot be Empty \n"
        selectToLocation.style.border="1px solid red";
    }


    if (stockTransferItem.stock_transfer_master_has_item_master_quantity == null){
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
            stockTransfer.items.push(stockTransferItem);
            refreshStockTransferInnerTable();
            await refreshStockTransferInnerForm();
        }
    }else {
        alert(`You Have Following Errors \n ${errors}`)
    }
}


