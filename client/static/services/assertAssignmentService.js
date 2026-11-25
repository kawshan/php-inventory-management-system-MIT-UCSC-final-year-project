async function getAllAssetAssignmentService() {
    let baseURL = "../../server/controller/AssertAssignmentMasterController.php";
    const response = await fetch(`${baseURL}?method=findAll`);
    if (!response.ok) {
        throw new Error("Failed to get assignments")
    } else {
        return await response.json();
    }
}



async function saveAssetAssignmentMasterService(data) {
    let baseURL = "../../server/controller/AssertAssignmentMasterController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to Create assignment")
    }
    return result;
}


async function updateAssetAssignmentMasterService(id, data) {
    let baseURL = "../../server/controller/AssertAssignmentMasterController.php";
    const response = await fetch(`${baseURL}?method=update&id=${id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update assignment");
    }
  return result;
}



async function deleteAssetAssignmentMasterService(id){
    let baseURL = "../../server/controller/AssertAssignmentMasterController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {method:"DELETE"});
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || `Failed to delete assignment`)
    }
    return result;
}








