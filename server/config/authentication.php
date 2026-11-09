<?php

session_start();

if (!isset($_SESSION["user"])) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "user" => $_SESSION["user"]
]);