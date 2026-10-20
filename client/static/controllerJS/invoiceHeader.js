window.addEventListener('load', () => {

    refreshInvoiceMasterForm();
    refreshInvoiceMasterTable();

//     inner refreshes

    refreshInvoiceInnerTable();
});


const refreshInvoiceMasterForm = async () => {

    runningInvoiceValue = 0;

    invoiceHeaderMaster = new Object();
    oldInvoiceHeaderMaster = null
    invoiceHeaderMaster.items = new Array();

    selectBranchName.style.border = "1px solid #ced4da";
    textDiscountPercentage.style.border = "1px solid #ced4da";
    textDate.style.border = "1px solid #ced4da";
    textPoNumber.style.border = "1px solid #ced4da";
    textDispatchNumber.style.border = "1px solid #ced4da";
    textInvoiceValue.style.border = "1px solid #ced4da";
    textPayedAmount.style.border = "1px solid #ced4da";
    textBalanceAmount.style.border = "1px solid #ced4da";
    selectStatus.style.border = "1px solid #ced4da";


    textDiscountPercentage.value = "";
    textDate.value = "";
    textPoNumber.value = "";
    textDispatchNumber.value = "";
    textInvoiceValue.value = "";
    textPayedAmount.value = "";
    textBalanceAmount.value = "";

    branchersList = await getAllLocationService();
    generateSelectDropDown(selectBranchName, branchersList, 'locations', 'location_master_name');

    statuesList = await getAllInvoiceStatuesService();
    generateSelectDropDown(selectStatus, statuesList, 'status', 'name');


    //need to implement payment type dynamic
    paymentTypeList = await getAllPaymentTypeService();
    generateSelectDropDown(selectPaymentType, paymentTypeList, 'paymentTypes', 'payment_type_name')



    await refreshInvoiceInnerForm();
}


const refreshInvoiceMasterTable = async ()=>{
let invoiceList = await getAllInvoiceService();
    console.log("invoices",invoiceList);

    const tableBody = document.getElementById("invoiceMasterTableTbody");
    tableBody.innerHTML="";


    invoiceList.forEach((item,index)=>{
        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index+1;

        const createdDate = document.createElement("td")
        createdDate.textContent=item.invoice_header_created_date;

        const invoiceStatus = document.createElement("td");
        invoiceStatus.textContent = item.invoice_status_invoice_status_id == 1 ? "Active" : "Inactive";

        const locationName = document.createElement("td");
        locationName.textContent=item.locations.name;

        const paymentType = document.createElement("td");
        paymentType.textContent=item.payment_type.name;

        const itemNames = document.createElement("td");

        itemNames.innerHTML = item.items
            .map(innerItem => `<p>${innerItem.item_master_name}</p>`)
            .join("");


        const invoiceValue = document.createElement("td");
        invoiceValue.textContent=item.invoice_header_invoice_amount;

        const payedValue = document.createElement("td");
        payedValue.textContent=item.invoice_header_payed_amount;

        const balanceValue = document.createElement("td");
        balanceValue.textContent=item.invoice_header_balance_amount

        const actionCell = document.createElement("td");
        actionCell.classList.add("flex", "justify-center", "items-center", "gap-2");

        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillInvoiceMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printInvoiceMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteInvoiceMaster(item)
        }



        row.appendChild(idCell);
        row.appendChild(createdDate);
        row.appendChild(locationName);
        row.appendChild(paymentType);
        row.appendChild(itemNames);
        row.appendChild(invoiceValue);
        row.appendChild(payedValue);
        row.appendChild(balanceValue);
        row.appendChild(invoiceStatus);

        row.appendChild(actionCell);
        actionCell.appendChild(refillButton);
        actionCell.appendChild(printButton);
        actionCell.appendChild(deleteButton);


        tableBody.appendChild(row);

            });


    new DataTable('#invoiceMasterTable', {
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });


}


const checkErrors = ()=>{
    let errors = ""

    if (invoiceHeaderMaster.invoice_status_invoice_status_id == null){
        errors+="Status Cannot Be Empty \n";
        selectStatus.classList.add("is-invalid");
        selectStatus.style.border="1px solid red";
    }


    if (invoiceHeaderMaster.location_master_id == null){
        errors+="Branch Name Cannot be Empty \n";
        selectBranchName.classList.add("is-invalid");
        selectBranchName.style.border="1px solid red";
    }


    if (invoiceHeaderMaster.payment_type_id == null){
        errors+="Payment Cannot be Empty \n";
        selectPaymentType.classList.add("is-invalid");
        selectPaymentType.style.border="1px solid red";
    }

    if (invoiceHeaderMaster.invoice_header_payed_amount == null){
        errors+="Payed Amount Cannot be Empty \n";
        textPayedAmount.classList.add("is-invalid");
        textPayedAmount.style.border="1px solid red";
    }


    if (invoiceHeaderMaster.invoice_header_invoice_amount == null){
        errors+="Invoice Amount Cannot be Empty \n";
        textInvoiceValue.classList.add("is-invalid");
        textInvoiceValue.style.border="1px solid red";
    }


    if (invoiceHeaderMaster.invoice_header_balance_amount == null){
        errors+="Balance Amount Cannot be Empty \n";
        textBalanceAmount.classList.add("is-invalid");
        textBalanceAmount.style.border="1px solid red";
    }
    return errors;
}



const saveInvoiceHeader  = async ()=>{
    const errors = checkErrors();
    if (errors==""){
        const userConfirm = confirm(`Are You Sure to Add Following Information
Branch Code is ${invoiceHeaderMaster.location_master_id}
Status is ${invoiceHeaderMaster.invoice_status_invoice_status_id}
Payment Type is ${invoiceHeaderMaster.payment_type_id}
Invoice Amount is ${invoiceHeaderMaster.invoice_header_invoice_amount}
Payment Amount is ${invoiceHeaderMaster.invoice_header_payed_amount}
Balance Amount is ${invoiceHeaderMaster.invoice_header_balance_amount}`);

        if (userConfirm){

            try {
                const serverResponse  = await createInvoiceService(invoiceHeaderMaster);
                if (serverResponse.success){
                    alert(`Save Success`);
                    setTimeout(()=>{
                        window.location.reload();
                    },500)
                }
            }catch (error){
                console.error("INVOICE SAVE ERROR",error)
                alert(error.message);
            }




        }else {
            alert(`User Cancelled the Operation`)
        }


    }else {
        alert(`You Have following Errors \n ${errors}`);
    }


}



const refillInvoiceMaster =(obj)=>{
    invoiceHeaderMaster = JSON.parse(JSON.stringify(obj))
    oldInvoiceHeaderMaster = JSON.parse(JSON.stringify(obj))

    selectBranchName.value = invoiceHeaderMaster.locations.id
    textDiscountPercentage.value = invoiceHeaderMaster.invoice_header_discount_percentage
    textDate.value = invoiceHeaderMaster.invoice_header_created_date
    textPoNumber.value = invoiceHeaderMaster.invoice_header_po_number
    textDispatchNumber.value = invoiceHeaderMaster.invoice_header_dispatch_number
    textInvoiceValue.value = invoiceHeaderMaster.invoice_header_invoice_amount
    textPayedAmount.value = invoiceHeaderMaster.invoice_header_payed_amount
    textBalanceAmount.value = invoiceHeaderMaster.invoice_header_balance_amount
    selectStatus.value = invoiceHeaderMaster.status.id
    selectPaymentType.value = invoiceHeaderMaster.payment_type.id

    refreshInvoiceInnerTable();

}


const checkUpdatesInvoiceMaster = ()=>{

    let updates = ""

    if (oldInvoiceHeaderMaster.invoice_header_created_date !== invoiceHeaderMaster.invoice_header_created_date){
        updates+="Date is Changed \n"
    }

    if (oldInvoiceHeaderMaster.invoice_header_discount_percentage !== invoiceHeaderMaster.invoice_header_discount_percentage){
        updates+="Discount is Changed \n"
    }

    if (oldInvoiceHeaderMaster.invoice_status_invoice_status_id !== invoiceHeaderMaster.invoice_status_invoice_status_id){
        updates+="Status is Changed \n"
    }

    if (oldInvoiceHeaderMaster.location_master_id !== invoiceHeaderMaster.location_master_id){
        updates+="Location is Changed \n"
    }

    if (oldInvoiceHeaderMaster.invoice_header_po_number !== invoiceHeaderMaster.invoice_header_po_number){
        updates+="Po number is Changed \n"
    }

    if (oldInvoiceHeaderMaster.invoice_header_dispatch_number !== invoiceHeaderMaster.invoice_header_dispatch_number){
        updates+="Dispatch is changed \n"
    }

    if (oldInvoiceHeaderMaster.payment_type_id !== invoiceHeaderMaster.payment_type_id){
        updates+="Payment Type is changed \n"
    }

    if (oldInvoiceHeaderMaster.invoice_header_payed_amount !== invoiceHeaderMaster.invoice_header_payed_amount){
        updates+="Payed Amount is Changed \n"
    }

    if (oldInvoiceHeaderMaster.invoice_header_invoice_amount !== invoiceHeaderMaster.invoice_header_invoice_amount){
        updates+="Invoice Amount is Changed \n"
    }

    if (oldInvoiceHeaderMaster.invoice_header_balance_amount !== invoiceHeaderMaster.invoice_header_balance_amount){
        updates+="Balance is Changed \n"
    }


    return updates;
}



const updateInvoiceHeader = async ()=>{

    const updates = checkUpdatesInvoiceMaster();
    if (updates!=""){
        const userConfirm = confirm(`Are You Sure to Change those Values \n ${updates}`);
        if (userConfirm){
            const serverResponse = await updateInvoiceHeaderService(invoiceHeaderMaster.invoice_header_id,invoiceHeaderMaster);
            if (serverResponse.success){
                alert("update success")
                setTimeout(()=>{
                    window.location.reload();
                },500);
            }
        }
    }else {
        alert("Nothing to Update")
    }




}















const deleteInvoiceMaster = async (obj)=>{
    console.log(obj)
const userConfirm = confirm(`are you sure to delete following invoice 
Invoice Number ${obj.invoice_header_id}`)
    if (userConfirm){
        const serverResponse = await deleteInvoiceService(obj.invoice_header_id);
        if (serverResponse.success){
            alert(`Delete Success`)
            setTimeout(()=>{
                window.location.reload();
            },500)
        }else {
            alert(`Something Went Wrong ${serverResponse.message}`);
        }
    }


}


const printInvoiceMaster = (obj)=>{

}












// inner table functions are start from here
const refreshInvoiceInnerForm = async () => {

    invoiceItem = new Object();
    oldInvoiceItem = null

    selectItem.style.border = "1px solid #ced4da";
    textQuantity.style.border = "1px solid #ced4da";
    textRate.style.border = "1px solid #ced4da";
    textDiscountedAmount.style.border = "1px solid #ced4da";
    textValue.style.border = "1px solid #ced4da";


    selectItem.value = "";
    selectItem.innerHTML="";
    itemsList = await getAllItems();
    generateSelectDropDown(selectItem, itemsList, 'data', 'item_master_name')


    textQuantity.value = "";
    textRate.value = "";
    textDiscountedAmount.value = "";
    textValue.value = "";

    refreshInvoiceInnerTable();

}


const refreshInvoiceInnerTable = () => {


    const tableBody = document.getElementById("innerTableTbody");
    tableBody.innerHTML = ""

    invoiceHeaderMaster.items.forEach((item, index) => {


        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;
        idCell.classList.add("py-2")

        const nameCell = document.createElement("td");
        nameCell.textContent = item.itemName;

        const priceCell = document.createElement("td");
        priceCell.textContent = item.invoice_header_has_item_price;

        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.invoice_header_has_item_quantity;

        const discountCell = document.createElement("td");
        discountCell.textContent = item.invoice_header_has_item_discount_amount;

        const valueCell = document.createElement("td");
        valueCell.textContent = item.invoice_header_has_item_value;

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
        row.appendChild(priceCell);
        row.appendChild(quantityCell);
        row.appendChild(discountCell);
        row.appendChild(valueCell);

        row.appendChild(actionCell);
        // actionCell.appendChild(refillButton);
        actionCell.appendChild(deleteButton);
        tableBody.appendChild(row);


    });

    new DataTable('#innerItemTable');

}



const deleteInnerRow = (obj) => {

    const userConfirm = confirm("Are You Sure to Remove Current Item");

    if (userConfirm) {

        let extIndex = invoiceHeaderMaster.items
            .map(item => item.item_master_id)
            .indexOf(obj.item_master_id);

        if (extIndex !== -1) {

            // Subtract the deleted item's value
            runningInvoiceValue -= Number(invoiceHeaderMaster.items[extIndex].invoice_header_has_item_value);
            invoiceHeaderMaster.invoice_header_invoice_amount = runningInvoiceValue;
            textInvoiceValue.style.border=`1px solid green`;
            textInvoiceValue.classList.add('is-valid');

            // Remove the item from the array
            invoiceHeaderMaster.items.splice(extIndex, 1);

            // Update the invoice total input
            textInvoiceValue.value = runningInvoiceValue.toFixed(2);

            alert("Item removed successfully");

            refreshInvoiceInnerTable();
        }
    }
};





const checkInnerFormErrors = ()=>{
    let errors ="";


    if (invoiceItem.item_master_id == null){
        errors+="Item Cannot Be Empty \n";
        selectItem.classList.add("is-invalid");
        selectItem.style.border="1px solid red";
    }

    if (invoiceItem.invoice_header_has_item_quantity == null){
        errors+="Quantity Cannot Be Empty \n";
        textQuantity.classList.add("is-invalid");
        textQuantity.style.border="1px solid red";
    }


    if (invoiceItem.invoice_header_has_item_price == null){
        errors+="Rate Cannot Be Empty \n";
        textRate.classList.add("is-invalid");
        textRate.style.border="1px solid red";
    }


    if (invoiceItem.invoice_header_has_item_value == null){
        errors+="Value Cannot Be Empty \n";
        textValue.classList.add("is-invalid");
        textValue.style.border="1px solid red";
    }


    return errors;
}






const buttonInnerAdd = async () => {

    let errors = checkInnerFormErrors();

    if (errors == "") {
        const userConfirm = confirm("Are You Sure?");

        if (userConfirm) {

            invoiceHeaderMaster.items.push(invoiceItem);

            alert("Item Added Successfully");

            // Calculate the total of all invoice items
            runningInvoiceValue = invoiceHeaderMaster.items.reduce((total, item) => total + Number(item.invoice_header_has_item_value || 0),0);

            textInvoiceValue.value = runningInvoiceValue.toFixed(2);
            invoiceHeaderMaster.invoice_header_invoice_amount = runningInvoiceValue;
            textInvoiceValue.style.border=`1px solid green`;
            textInvoiceValue.classList.add('is-valid');

            refreshInvoiceInnerTable();

            await refreshInvoiceInnerForm();

        } else {
            alert("User Cancelled the operation");
        }
    } else {
        alert(`You Have Following Errors ${errors}`);
    }
};













// helping js funcions
function getInnerText(field){
const selectedText = field.options[field.selectedIndex].text;
    console.log(selectedText);
    invoiceItem.itemName= selectedText;
}




function getBalance(fieldName){
    let invoiceValue = Number(textInvoiceValue.value);
    let payedValue = Number(fieldName.value);

    let balanceAmount = payedValue-invoiceValue;
    invoiceHeaderMaster.invoice_header_balance_amount = balanceAmount.toFixed(2);
    textBalanceAmount.value=invoiceHeaderMaster.invoice_header_balance_amount
    textBalanceAmount.style.border=`1px solid green`;
    textBalanceAmount.classList.add('is-valid');

}




