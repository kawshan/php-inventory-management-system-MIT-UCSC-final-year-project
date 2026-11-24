async function getAllIssueNoteService() {
    let baseURL = "../../server/controller/IssueNoteMasterController.php";
    const response = await fetch(`${baseURL}?method=findAll`);
    if (!response.ok) {
        throw new Error("Failed to get issue notes")
    } else {
        return await response.json();
    }
}



async function saveIssueNoteMasterService(data) {
    let baseURL = "../../server/controller/IssueNoteMasterController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to Create Issue notes")
    }
    return result;
}


async function updateIssueNoteMasterService(id, data) {
    let baseURL = "../../server/controller/IssueNoteMasterController.php";
    const response = await fetch(`${baseURL}?method=update&id=${id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update Issue Notes");
    }
  return result;
}



async function deleteIssueNoteMasterService(id){
    let baseURL = "../../server/controller/IssueNoteMasterController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {method:"DELETE"});
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || `Failed to delete Issue Note`)
    }
    return result;
}








