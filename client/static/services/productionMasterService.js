async function getAllInvoiceService() {
    let baseURL = "../../server/controller/ProductionMasterController.php";
    const response = await fetch(`${baseURL}?method=findAll`);
    if (!response.ok) {
        throw new Error("Failed to get invoices")
    } else {
        return await response.json();
    }
}



async function saveProductionMasterService(data) {
    let baseURL = "../../server/controller/ProductionMasterController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to Create Production")
    }
    return result;
}


async function updateProductionMasterService(id, data) {
    let baseURL = "../../server/controller/ProductionMasterController.php";
    const response = await fetch(`${baseURL}?method=update&id=${id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update Production");
    }
  return result;
}



async function deleteProductionMasterService(id){
    let baseURL = "../../server/controller/ProductionMasterController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {method:"DELETE"});
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || `Failed to delete Production`)
    }
    return result;
}








