const baseURL ="http://localhost/project-mit/viru/server/controller/ItemSizeController.php";

export async function getAllItemSizes() {
    const response = await fetch(
        `${baseURL}?method=getAllItemSize`
    );

    if (!response.ok) {
        throw new Error("Failed to get item sizes");
    }

    return await response.json();
}