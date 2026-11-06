async function getAllEmployeeService() {
    let baseURL = "../../server/controller/EmployeeController.php";
    const response = await fetch(
        `${baseURL}?method=findAll`
    );
    if (!response.ok) {
        throw new Error("Failed to get items");
    }
    return await response.json();
}

async function createEmployeeService(data) {
    let baseURL = "../../server/controller/EmployeeController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});

    let result = await response.json();

    if (!response.ok || !result.success) {
        result = {
            success : false,
            "message" : result.message
        }
    }

    return result;
}


async function updateEmployeeService(id, data) {
    let baseURL = "../../server/controller/EmployeeController.php";
    const response = await fetch(`${baseURL}?method=update&id=${encodeURIComponent(id)}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update Employee");
    }
    return result;
}


async function deleteEmployeeService(id){
    let baseURL = "../../server/controller/EmployeeController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {
            method:"DELETE",
        });

    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Delete Employee")
    }
    return result;
}




