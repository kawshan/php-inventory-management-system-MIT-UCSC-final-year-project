<?php

session_start();

// Remove all session variables
$_SESSION = [];

// Remove the session cookie
if (ini_get("session.use_cookies")) {  //This checks whether PHP is configured to use cookies to manage sessions.  ini_get() is a built-in PHP function that retrieves the value of a PHP configuration directive.
//eken venne php cookie sessions ganna eka
    $params = session_get_cookie_params();

    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destroy the session
session_destroy();

echo json_encode([
    "success" => true,
    "message" => "Logged out successfully!"
]);

exit;