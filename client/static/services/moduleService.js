 async function getAllModulesService() {

     let baseURL ="http://localhost/project-mit/viru/server/controller/ModuleController.php";
     const response = await fetch(
        `${baseURL}?method=findAll`
    );

    if (!response.ok) {
        throw new Error("Failed to get data");
    }

    return await response.json();
}



