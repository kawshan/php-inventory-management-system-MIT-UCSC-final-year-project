async function getAllUserService() {
    let baseURL = "../../server/controller/UserMasterController.php";
    const response = await fetch(
        `${baseURL}?method=findAll`
    );
    if (!response.ok) {
        throw new Error("Failed to get items");
    }
    return await response.json();
}

async function createUserService(data) {
    let baseURL = "../../server/controller/UserMasterController.php";
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


async function updateUserService(id, data) {
    let baseURL = "../../server/controller/UserMasterController.php";
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


async function deleteUserService(id){
    let baseURL = "../../server/controller/UserMasterController.php";
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




async function loginService(data) {

    const baseURL = "../../server/controller/UserMasterController.php?method=login";

    const response = await fetch(baseURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}