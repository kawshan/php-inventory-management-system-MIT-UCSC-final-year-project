const textValidator = (fieldID, pattern, object, property) =>{
    const regPattern  = new RegExp(pattern);
    if (fieldID.value !== ""){
        if (regPattern.test(fieldID.value)){
            window[object][property] = fieldID.value;
            fieldID.style.border="1px solid green"
            console.log("valid");
            fieldID.classList.remove("is-invalid");
            fieldID.classList.add("is-valid");
        }else {
            window[object][property]=null;
            fieldID.style.border="1px solid red";
            console.log("error");
            fieldID.classList.remove("is-valid");
            fieldID.classList.add("is-invalid");
        }
    }else {
        if (fieldID.required){
            fieldID.style.border="1px solid red";
            fieldID.classList.remove("is-valid");
            fieldID.classList.add("is-invalid");
        }else {
            fieldID.style.border='1px solid #ced4da'
        }
    }
}