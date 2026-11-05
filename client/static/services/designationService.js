 async function getAllDesignations() {

     let baseURL ="http://localhost/project-mit/viru/server/controller/DesignationController.php";
     const response = await fetch(
        `${baseURL}?method=findAll`
    );

    if (!response.ok) {
        throw new Error("Failed to get item sizes");
    }

    return await response.json();
}