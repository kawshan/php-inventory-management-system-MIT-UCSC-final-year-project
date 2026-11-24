async function getAllPurchaseOrderService() {
    let baseURL = "../../server/controller/ourPoMasterController.php";
    const response = await fetch(`${baseURL}?method=findAll`);
    if (!response.ok) {
        throw new Error("Failed to get POS")
    } else {
        return await response.json();
    }
}


async function getAllPurchaseOrderIdByCodeService(code) {
    let baseURL = "../../server/controller/ourPoMasterController.php";
    const response = await fetch(`${baseURL}?method=getAllOurPoMasterIDFromCode&code=${code}`);
    if (!response.ok) {
        throw new Error("Failed to get POS")
    } else {
        return await response.json();
    }
}





async function savePurchaseOrderMasterService(data) {
    let baseURL = "../../server/controller/ourPoMasterController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to Create purchase")
    }
    return result;
}


async function updatePurchaseOrderMasterService(id, data) {
    let baseURL = "../../server/controller/ourPoMasterController.php";
    const response = await fetch(`${baseURL}?method=update&id=${id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update purchase");
    }
  return result;
}



async function deletePurchaseOrderMasterService(id){
    let baseURL = "../../server/controller/ourPoMasterController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {method:"DELETE"});
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || `Failed to delete purchase`)
    }
    return result;
}




async function getCodeFromIdService(id) {
    let baseURL = "../../server/controller/ourPoMasterController.php";
    const response = await fetch(`${baseURL}?method=getCodeFromId&id=${encodeURIComponent(id)}`);
    if (!response.ok) {
        throw new Error("Failed to get code")
    } else {
        return await response.json();
    }
}




