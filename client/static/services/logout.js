async function logoutService() {

    const response = await fetch("../../server/config/logout.php", {
        method: "POST"
    });

    return await response.json();
}