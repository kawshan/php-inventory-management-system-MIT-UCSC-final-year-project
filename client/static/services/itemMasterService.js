async function getAllItems() {
    let baseURL = "http://localhost/project-mit/viru/server/controller/ItemMasterController.php";
    const response = await fetch(
        `${baseURL}?method=findAll`
    );
    if (!response.ok) {
        throw new Error("Failed to get items");
    }
    return await response.json();
}

async function createItemService(data) {
    let baseURL = "http://localhost/project-mit/viru/server/controller/ItemMasterController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {method:"POST",headers:{"Content-Type": "application/json"},body:JSON.stringify(data)});

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to Create Item");
    }

    return result;
}