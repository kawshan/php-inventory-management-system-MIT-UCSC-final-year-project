window.addEventListener('load', () => {

    refreshInvoiceMasterForm();


//     inner refreshes
    refreshInvoiceInnerForm();
    refreshInvoiceInnerTable();
});


const refreshInvoiceMasterForm = async () => {

    invoiceHeaderMaster = new Object();

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


}


// inner table functions are start from here
const refreshInvoiceInnerForm = async () => {

    items = new Object();

    selectItem.style.border = "1px solid #ced4da";
    textQuantity.style.border = "1px solid #ced4da";
    textRate.style.border = "1px solid #ced4da";
    textDiscountedAmount.style.border = "1px solid #ced4da";
    textValue.style.border = "1px solid #ced4da";


    itemsList = await getAllItems();
    generateSelectDropDown(selectItem, itemsList, 'data', 'item_master_name')

    textQuantity.value = "";
    textRate.value = "";
    textDiscountedAmount.value = "";
    textValue.value = "";
}


const refreshInvoiceInnerTable = () => {


    let items = [
        {
            id: 1,
            invoice_header_invoice_header_id: 1,
            item_master_id: 101,
            item_name: "Wireless Mouse", // Helpful extra field for your UI table
            invoice_header_has_item_price: 500.00,
            invoice_header_has_item_quantity: 2,
            invoice_header_has_item_discount_amount: 0.00,
            invoice_header_has_item_value: 1000.00
        },
        {
            id: 2,
            invoice_header_invoice_header_id: 1,
            item_master_id: 102,
            item_name: "Mechanical Keyboard", // Helpful extra field for your UI table
            invoice_header_has_item_price: 500.00,
            invoice_header_has_item_quantity: 1,
            invoice_header_has_item_discount_amount: 0.00,
            invoice_header_has_item_value: 500.00
        }
    ]

    const tableBody = document.getElementById("innerTableTbody");
    tableBody.innerHTML = ""

    items.forEach((item, index) => {


        const row = document.createElement("tr")

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;
        idCell.classList.add("py-2")

        const nameCell = document.createElement("td");
        nameCell.textContent = item.item_name;

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
            deleteInnerItem(item)
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



