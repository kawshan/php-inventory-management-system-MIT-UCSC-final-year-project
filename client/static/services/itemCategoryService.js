async function getAllItemCategories() {
    let baseURL = "http://localhost/project-mit/viru/server/controller/ItemCategoryController.php";
    const response = await fetch(
        `${baseURL}?method=getAllItemCategoryMaster`
    );

    if (!response.ok) {
        throw new Error("Failed to get item categories");
    }

    return await response.json();
}


async function createItemCategoryService(data) {
    let baseURL = "http://localhost/project-mit/viru/server/controller/ItemCategoryController.php";

    const response = await fetch(`${baseURL}?method=createItemCategoryMaster`,
        {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to Create Item")
    }


    return result;
}


async function updateItemCategory(id, data) {
    let baseURL = "http://localhost/project-mit/viru/server/controller/ItemCategoryController.php";
    const response = await fetch(`${baseURL}?method=updateItemCategoryMaster&id=${encodeURIComponent(id)}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to Update Item Master Category`);
    }
    return result;
}


async function deleteItemCategoryMasterService(id) {
    let baseURL = "http://localhost/project-mit/viru/server/controller/ItemCategoryController.php";
    const response = await fetch(`${baseURL}?method=deleteItemCategoryMaster&id=${encodeURIComponent(id)}`,
        {
            method: "DELETE"
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to Delete Item Category Master`);
    }
    return result;
}







