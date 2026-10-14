window.addEventListener('load', () => {

    refreshInvoiceMasterForm();


//     inner refreshes
    refreshInvoiceInnerForm();

});


const refreshInvoiceMasterForm = async () => {

    invoiceHeaderMaster = new Object();

    selectBranchName.style.border="1px solid #ced4da";
    textDiscountPercentage.style.border="1px solid #ced4da";
    textDate.style.border="1px solid #ced4da";
    textPoNumber.style.border="1px solid #ced4da";
    textDispatchNumber.style.border="1px solid #ced4da";
    textInvoiceValue.style.border="1px solid #ced4da";
    textPayedAmount.style.border="1px solid #ced4da";
    textBalanceAmount.style.border="1px solid #ced4da";
    selectStatus.style.border="1px solid #ced4da";


    textDiscountPercentage.value="";
    textDate.value="";
    textPoNumber.value="";
    textDispatchNumber.value="";
    textInvoiceValue.value="";
    textPayedAmount.value="";
    textBalanceAmount.value="";

    branchersList = await getAllLocationService();
    generateSelectDropDown(selectBranchName,branchersList,'locations','location_master_name');

    statuesList = await getAllInvoiceStatuesService();
    generateSelectDropDown(selectStatus,statuesList,'status','name')


    //need to implement payment type dynamic


}




















































// inner table functions are start from here
const refreshInvoiceInnerForm = async ()=>{

    items = new Object();

    selectItem.style.border="1px solid #ced4da";
    textQuantity.style.border="1px solid #ced4da";
    textRate.style.border="1px solid #ced4da";
    textDiscountedAmount.style.border="1px solid #ced4da";
    textValue.style.border="1px solid #ced4da";


    itemsList = await getAllItems();
    generateSelectDropDown(selectItem,itemsList,'data','item_master_name')

    textQuantity.value="";
    textRate.value="";
    textDiscountedAmount.value="";
    textValue.value="";
}






