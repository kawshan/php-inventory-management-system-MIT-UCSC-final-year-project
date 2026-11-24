async function getAllJobService() {
    let baseURL = "../../server/controller/JobMasterController.php";
    const response = await fetch(`${baseURL}?method=findAll`);
    if (!response.ok) {
        throw new Error("Failed to get jobs")
    } else {
        return await response.json();
    }
}



async function saveJobMasterService(data) {
    let baseURL = "../../server/controller/JobMasterController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to Create jobs")
    }
    return result;
}


async function updateJobMasterService(id, data) {
    let baseURL = "../../server/controller/JobMasterController.php";
    const response = await fetch(`${baseURL}?method=update&id=${id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update jobs");
    }
  return result;
}



async function deleteJobMasterService(id){
    let baseURL = "../../server/controller/JobMasterController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {method:"DELETE"});
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || `Failed to delete jobs`)
    }
    return result;
}








