window.addEventListener('load', () => {

    refreshInvoiceMasterForm();


//     inner refreshes

    refreshInvoiceInnerTable();
});


const refreshInvoiceMasterForm = async () => {

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
    generateSelectDropDown(selectStatus, statuesList, 'status', 'name')


    //need to implement payment type dynamic

    await refreshInvoiceInnerForm();
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
        nameCell.textContent = item.item_master_id;

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

        const refillButton = document.createElement("button");
        refillButton.textContent = "Refill"
        refillButton.classList.add("bg-emerald-600", "text-white", "px-3", "py-2", "rounded");
        refillButton.onclick = () => {
            refillInnerForm(item)
        }

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
        actionCell.appendChild(refillButton);
        actionCell.appendChild(deleteButton);
        tableBody.appendChild(row);


    });

    new DataTable('#innerItemTable');

}


const refillInnerForm = (obj)=>{

    invoiceItem = JSON.parse(JSON.stringify(obj))
    oldInvoiceItem = JSON.parse(JSON.stringify(obj))


    selectItem.value = obj.item_master_id
    textQuantity.value = obj.invoice_header_has_item_quantity
    textRate.value = obj.invoice_header_has_item_price
    textDiscountedAmount.value = obj.invoice_header_has_item_discount_amount
    textValue.value = obj.invoice_header_has_item_value


}


const deleteInnerRow = (obj)=>{
    const userConfirm = confirm(`Are You Sure to Remove Current Item`)
    if (userConfirm){
        let extIndex = invoiceHeaderMaster.items.map(item=>item.item_master_id).indexOf(obj.item_master_id);
        if (extIndex !== -1){
            invoiceHeaderMaster.items.splice(extIndex,1);
            alert(`item removed successfully`);
            refreshInvoiceInnerTable();
        }
    }
}





const checkInnerFormErrors = ()=>{
    let errors ="";

    if (invoiceItem.item_master_id == null){
        errors+="Item Cannot Be Empty";
        selectItem.classList.add("is-invalid");
        selectItem.style.border="1px solid red";
    }

    if (invoiceItem.invoice_header_has_item_quantity == null){
        errors+="Quantity Cannot Be Empty";
        textQuantity.classList.add("is-invalid");
        textQuantity.style.border="1px solid red";
    }


    if (invoiceItem.invoice_header_has_item_price == null){
        errors+="Rate Cannot Be Empty";
        textRate.classList.add("is-invalid");
        textRate.style.border="1px solid red";
    }


    if (invoiceItem.invoice_header_has_item_value == null){
        errors+="Value Cannot Be Empty";
        textValue.classList.add("is-invalid");
        textValue.style.border="1px solid red";
    }


    return errors;
}



const buttonInnerAdd =async ()=>{
    let errors = checkInnerFormErrors();
    if (errors==""){
        const userConfirm = confirm(`Are You Sure?`)
        if (userConfirm){
            invoiceHeaderMaster.items.push(invoiceItem);
            alert(`Item Added Successfully`);
            refreshInvoiceInnerTable();
            await refreshInvoiceInnerForm()
        }else {
            alert(`User Cancelled the operation`)
        }
    }else {
        alert(`You Have Following Errors ${errors}`);
    }
}



const innerUpdate = async () => {
    let errors = checkInnerFormErrors();

    if (errors === "") {
        let userConfirm = confirm(`
            Are You Sure To Update Following

            Item : ${invoiceItem.item_name || invoiceItem.item_master_id}
            Qty  : ${invoiceItem.invoice_header_has_item_quantity}
        `);

        if (userConfirm) {
            let extIndex = invoiceHeaderMaster.items
                .map(item => item.item_master_id)
                .indexOf(oldInvoiceItem.item_master_id);

            if (extIndex !== -1) {
                invoiceHeaderMaster.items[extIndex] = JSON.parse(JSON.stringify(invoiceItem));

                alert("Item Updated Successfully");

                await refreshInvoiceInnerForm();
            } else {
                alert("Error: Item not found in the invoice list.");
            }
        }
    } else {
        alert(`You Have Following Errors\n${errors}`);
    }
}