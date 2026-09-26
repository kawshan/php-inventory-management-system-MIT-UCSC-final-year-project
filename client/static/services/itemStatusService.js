const baseURL ="http://localhost/project-mit/viru/server/controller/ItemStatusController.php";

export async function getAllItemStatus() {
    const response = await fetch(
        `${baseURL}?method=getAllItemStatus`
    );

    if (!response.ok) {
        throw new Error("Failed to get item sizes");
    }

    return await response.json();
}