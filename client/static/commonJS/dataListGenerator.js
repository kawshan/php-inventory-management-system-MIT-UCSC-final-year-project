const generateDataList = (fieldID,dataset,propertyValue) => {

    fieldID.innerHTML = "";

    dataset.forEach(item=>{
        const option = document.createElement("option");
        option.value = item[propertyValue];
        fieldID.appendChild(option);
    })





}