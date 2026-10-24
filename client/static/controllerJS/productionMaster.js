window.addEventListener('load',()=>{

    refreshProductionMasterForm()


    refreshProductionMasterTable();


})

const refreshProductionMasterForm = async ()=>{

    productionMaster =new Object();
    oldProductionMaster =null
    productionMaster.items = new Array();

    textDate.style.border="2px solid #ced4da";
    selectStatus.style.border="2px solid #ced4da";

    textDate.value = "";
    selectStatus.value = "";

    await refreshProductionInnerForm();

}



const refreshProductionMasterTable = async ()=>{

    let productionList = await getAllInvoiceService();
    console.log("productions",productionList);

    const tableBody = document.getElementById("invoiceMasterTableTbody");
    tableBody.innerHTML="";


    productionList.forEach((item,index)=>{
        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index+1;


        const createdDate = document.createElement("td")
        createdDate.textContent=item.production_master_date;

        const ProductionStatus = document.createElement("td");
        ProductionStatus.textContent = item.production_master_status == 1 ? "Active" : "Inactive";

        const itemNames = document.createElement("td");

        itemNames.innerHTML = item.item_masters
            .map(innerItem => `<li >${innerItem.item_master_name}</li>`)
            .join("");


        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");

        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillProductionMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printProductionMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteProductionMaster(item)
        }



        row.appendChild(idCell);
        row.appendChild(createdDate);
        row.appendChild(itemNames);
        row.appendChild(ProductionStatus);


        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);


        tableBody.appendChild(row);

    });


    new DataTable('#productionMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });





}


const checkErrorsProductionMaster = ()=>{
    let errors = ""

    if (productionMaster.production_master_date == null){
        errors+="Date Cannot Be Empty \n"
        textDate.classList.add("is-invalid");
        textDate.style.border="1px solid red";
    }

    if (productionMaster.production_master_status == null){
        errors+="Status Cannot Be Empty \n"
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border="1px solid red";
    }

    return errors;
}


const saveProductionMaster = async ()=>{
    let errors = checkErrorsProductionMaster();
    if (errors==""){
        const userConfirm = confirm(`Are You Sure To Add Following Details
Date is ${productionMaster.production_master_date} 
Status is ${productionMaster.production_master_status}         
        `);
        if (userConfirm){
            const serverResponse = await saveProductionMasterService(productionMaster);
            if (serverResponse.success){
                alert(`Save Successful`);
                setTimeout(()=>{
                    window.location.reload();
                },500)
            }else {
                alert(`Something Went Wrong \n ${errors}`)
            }
        }else {
            alert(`User Cancelled the Operation`)
        }
    }else {
        alert(`You Have Following Errors \n ${errors}`)
    }
}


const refillProductionMaster = (obj)=>{
    productionMaster = JSON.parse(JSON.stringify(obj));
    oldProductionMaster = JSON.parse(JSON.stringify(obj));

    textDate.value = productionMaster.production_master_date;
    selectStatus.value = productionMaster.production_master_status;

    refreshProductionInnerTable();

}


const checkUpdateProductionMaster = ()=>{

    let updates = "";

    if (oldProductionMaster.production_master_date != productionMaster.production_master_date){
        updates+="Date Is Changed \n"
    }

    if (oldProductionMaster.production_master_status != productionMaster.production_master_status){
        updates+="Status Is Changed \n"
    }

    if (productionMaster.items.length !== oldProductionMaster.items.length){
        updates+="Items are Changed \n"
    }else{


        for (let element of productionMaster.items){
            let extIndex = oldProductionMaster.items.map(item=>item.item_master_id).indexOf(element.item_master_id);
            // -1 is a special value returned by JavaScript's .indexOf() when the item cannot be found.
            if (extIndex === -1){
                updates+="Items are Changed \n"
            }
            const oldItem = oldProductionMaster.items[extIndex];
            if (
                oldItem.production_master_has_item_quantity !== element.production_master_has_item_quantity ||
                oldItem.production_master_has_item_description !== element.production_master_has_item_description ||
                oldItem.production_master_has_item_item_name !== element.production_master_has_item_item_name
            ){
                updates+=`Items are Changed \n`
                break
            }
        }
    }
    return updates;
}


const updateProductionMaster = async ()=>{
    const updates = checkUpdateProductionMaster();
    if (updates!=""){
        const userConfirm = confirm(`Are You Sure to Update following Details \n ${updates}`);
        if (userConfirm){
            const serverResponse = await updateProductionMasterService(productionMaster.production_master_id,productionMaster);
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



const deleteProductionMaster = async (obj)=>{
    const userConfirm = confirm(`Are You Sure to delete Production details
Date is ${obj.production_master_date} 
Status is ${obj.production_master_status}   
    `);

    if (userConfirm){
        const serverResponse = await deleteProductionMasterService(obj.production_master_id);
        if (serverResponse.success){
            alert(`Delete Successful`);
            setTimeout(()=>{
                window.location.reload();
            })
        }
    }
}


const printProductionMaster = ()=>{



}




// inner functions start from here
const refreshProductionInnerForm = async ()=>{

    productionItem = new Object();
    oldProductionItem = null;

    selectItem.style.border="2px solid #ced4da";
    textQuantity.style.border="2px solid #ced4da";
    textDescription.style.border="2px solid #ced4da";

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
            productionItem.item_master_id = selectedItem.id;
            productionItem.production_master_has_item_item_name = selectedItem.item_master_short_name
            textItem.style.border="1px solid green";
        } else {
            productionItem.item_master_id = null;
            textItem.style.border="1px solid red";
        }

    });






    await refreshProductionInnerTable();
}





const refreshProductionInnerTable = async ()=>{

    const tableBody = document.getElementById("innerTableTbody");
    tableBody.innerHTML = ""

    productionMaster.items.forEach((item, index) => {


        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;
        idCell.classList.add("py-2");

        const nameCell = document.createElement("td");
        nameCell.textContent = item.production_master_has_item_item_name;

        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.production_master_has_item_quantity;

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = item.production_master_has_item_description;

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
        let extIndex = productionMaster.items.map(item=>item.item_master_id).indexOf(obj.item_master_id);
        if (extIndex!==-1){
            productionMaster.items.splice(extIndex,1);
            alert(`Delete Success`);
            await refreshProductionInnerForm();
        }
    }
}


const checkInnerFormErrors = ()=>{
    let errors=""

    if (productionItem.item_master_id == null){
        errors+="Item Cannot be Empty \n"
        selectItem.style.border="1px solid red";
    }

    if (productionItem.production_master_has_item_quantity == null){
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
            productionMaster.items.push(productionItem);
            await refreshProductionInnerTable();
            await refreshProductionInnerForm();
        }
    }else {
        alert(`You Have Following Errors \n ${errors}`)
    }
}


















