 async function getAllDepartmentService() {

     let baseURL ="http://localhost/project-mit/viru/server/controller/DepartmentCotnroller.php";
     const response = await fetch(
        `${baseURL}?method=findAll`
    );

    if (!response.ok) {
        throw new Error("Failed to get departments");
    }

    return await response.json();
}