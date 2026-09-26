const baseURL ="http://localhost/project-mit/viru/server/controller/ItemMasterController.php";

export async function getAllItems() {
    const response = await fetch(
        `${baseURL}?method=findAll`
    );

    if (!response.ok) {
        throw new Error("Failed to get items");
    }

    return await response.json();
}