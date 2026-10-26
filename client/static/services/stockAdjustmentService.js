async function getAllStockAdjustmentService() {
    let baseURL = "../../server/controller/StockAdjustmentController.php";
    const response = await fetch(`${baseURL}?method=findAll`);
    if (!response.ok) {
        throw new Error("Failed to get invoices")
    } else {
        return await response.json();
    }
}



async function saveStockAdjustmentMasterService(data) {
    let baseURL = "../../server/controller/StockAdjustmentController.php";
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


async function updateStockAdjustmentMasterService(id, data) {
    let baseURL = "../../server/controller/StockAdjustmentController.php";
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



async function deleteStockAdjustmentMasterService(id){
    let baseURL = "../../server/controller/StockAdjustmentController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {method:"DELETE"});
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || `Failed to delete Production`)
    }
    return result;
}








