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
            refillItemMaster(item)
        }


        const printButton = document.createElement("button");
        printButton.textContent = "print"
        printButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        printButton.onclick = () => {
            printItemMaster(item)
        }


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete"
        deleteButton.classList.add("bg-emerald-700", "text-white", "px-3", "py-2", "rounded");
        deleteButton.onclick = () => {
            deleteItemMaster(item)
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
