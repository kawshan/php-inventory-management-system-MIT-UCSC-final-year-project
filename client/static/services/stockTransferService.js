async function getAllStockTransferService() {
    let baseURL = "../../server/controller/StockTransferController.php";
    const response = await fetch(`${baseURL}?method=findAll`);
    if (!response.ok) {
        throw new Error("Failed to get transfers")
    } else {
        return await response.json();
    }
}



async function saveStockTransferMasterService(data) {
    let baseURL = "../../server/controller/StockTransferController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to Create Transfer");
    }
    return result;
}


async function updateStockTransferMasterService(id, data) {
    let baseURL = "../../server/controller/StockTransferController.php";
    const response = await fetch(`${baseURL}?method=update&id=${id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update Transfer");
    }
    return result;
}



async function deleteStockTransferMasterService(id){
    let baseURL = "../../server/controller/StockTransferController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {method:"DELETE"});
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || `Failed to delete Transfer`)
    }
    return result;
}








