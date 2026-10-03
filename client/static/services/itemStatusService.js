 async function getAllItemStatus() {

     let baseURL ="http://localhost/project-mit/viru/server/controller/ItemStatusController.php";
     const response = await fetch(
        `${baseURL}?method=getAllItemStatus`
    );

    if (!response.ok) {
        throw new Error("Failed to get item sizes");
    }

    return await response.json();
}