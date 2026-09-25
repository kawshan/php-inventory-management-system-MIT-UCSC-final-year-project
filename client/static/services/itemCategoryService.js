const baseURL ="http://localhost/project-mit/viru/server/controller/ItemCategoryController.php";

export async function getAllItemCategories() {
    const response = await fetch(
        `${baseURL}?method=getAllItemCategoryMaster`
    );

    if (!response.ok) {
        throw new Error("Failed to get item categories");
    }

    return await response.json();
}