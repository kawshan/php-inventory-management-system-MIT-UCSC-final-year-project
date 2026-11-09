async function checkSession() {

    const response = await fetch("../../server/config/authentication.php");

    if (!response.ok) {

        window.location.href = "login.html";

        return false;
    }

    const result = await response.json();

    return result.success;
}