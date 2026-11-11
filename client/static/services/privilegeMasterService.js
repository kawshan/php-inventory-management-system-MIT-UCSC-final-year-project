async function getAllPrivilegeService() {
    let baseURL = "../../server/controller/PrivilegeMasterController.php";
    const response = await fetch(
        `${baseURL}?method=findAll`
    );
    if (!response.ok) {
        throw new Error("Failed to get data");
    }
    return await response.json();
}

async function createPrivilegeService(data) {
    let baseURL = "../../server/controller/PrivilegeMasterController.php";
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


async function updatePrivilegeService(id, data) {
    let baseURL = "../../server/controller/PrivilegeMasterController.php";
    const response = await fetch(`${baseURL}?method=update&id=${encodeURIComponent(id)}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update privilege");
    }
    return result;
}


async function deletePrivilegeService(id){
    let baseURL = "../../server/controller/PrivilegeMasterController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {
            method:"DELETE",
        });

    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Delete Privilege")
    }
    return result;
}