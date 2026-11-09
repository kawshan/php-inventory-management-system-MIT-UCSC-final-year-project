 async function getAllRolesService() {

     let baseURL ="http://localhost/project-mit/viru/server/controller/RoleController.php";
     const response = await fetch(
        `${baseURL}?method=findAll`
    );

    if (!response.ok) {
        throw new Error("Failed to get item sizes");
    }

    return await response.json();
}



 async function getAllRolesWithoutAdminAndOwnerService() {

     let baseURL ="http://localhost/project-mit/viru/server/controller/RoleController.php";
     const response = await fetch(
         `${baseURL}?method=getAllRolesWithoutAdminAndOwner`
     );

     if (!response.ok) {
         throw new Error("Failed to get item sizes");
     }

     return await response.json();
 }