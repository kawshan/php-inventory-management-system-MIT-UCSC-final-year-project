function dropdownValidator(fieldId,objectName,propertyName){
    window[objectName][propertyName] = fieldId.value !== "" ? fieldId.value : null;
    if (fieldId.value !== ""){
        fieldId.classList.remove('is-invalid');
        fieldId.classList.add('is-valid');
        fieldId.style.border="1px solid green"
        console.log('valid')
    }else {
        fieldId.classList.remove('is-valid');
        fieldId.classList.add('is-invalid');
        fieldId.style.border="1px solid red";
        console.log('invalid');
    }
}