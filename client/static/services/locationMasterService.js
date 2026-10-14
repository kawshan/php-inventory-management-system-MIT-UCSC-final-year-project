async function getAllLocationService() {

    let baseURL = "../../server/controller/LocationMasterController.php";
    const response = await fetch(
        `${baseURL}?method=getAllLocations`
    );

    if (!response.ok) {
        throw new Error("Failed to get locations");
    }

    return await response.json();
}


async function createLocationService(data){
    let baseURL = "../../server/controller/LocationMasterController.php";
    const response = await fetch(`${baseURL}?method=createLocation`,
        {method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify(data)})

    const result = await response.json();

    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to create location");
    }
    return result;
}



async function updateLocationService(id,data){
    let baseURL = "../../server/controller/LocationMasterController.php";
    const response = await fetch(`${baseURL}?method=updateLocation&id=${encodeURIComponent(id)}`,
        {
            method:"PUT",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to update location")
    }
return result;
}




async function deleteLocationMasterService(id){
    let baseURL = "../../server/controller/LocationMasterController.php";
    const response  = await fetch(`${baseURL}?method=deleteLocation&id=${encodeURIComponent(id)}`,{method:"DELETE"});

    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to delete location")
    }
    return result;

}