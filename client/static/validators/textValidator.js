const textValidator = (fieldID, pattern, object, property) =>{
    const regPattern  = new RegExp(pattern);
    if (fieldID.value !== ""){
        if (regPattern.test(fieldID.value)){
            window[object][property] = fieldID.value;
            fieldID.style.border="1px solid green"
            console.log("valid");
        }else {
            window[object][property]=null;
            fieldID.style.border="1px solid red";
            console.log("error");
        }
    }else {
        if (fieldID.required){
            fieldID.style.border="1px solid red";
        }else {
            fieldID.style.border='1px solid #ced4da'
        }
    }
}