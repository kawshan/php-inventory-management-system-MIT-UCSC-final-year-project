const generateSelectDropDown = (fieldID,dataSet,dataSetProperty,propertyValue)=>{

    console.log(dataSet);
    const dummyOption = document.createElement("option")
    dummyOption.value=null;
    dummyOption.selected;

    dummyOption.textContent="Select An Option";
    fieldID.appendChild(dummyOption);

    dataSet[dataSetProperty].forEach(item=>{
        const option = document.createElement("option");
        option.value=item.id;
        option.textContent=item[propertyValue];
        fieldID.appendChild(option);
    });


}