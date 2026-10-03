<?php

require_once "../config/database.php";
require_once "../models/ItemSize.php";

$database = new Database();
$connection = $database->connect();
$itemSize = new ItemSize($connection);

class ItemSizeController {
    private $itemSize;

    public function __construct($itemSize) {
        $this->itemSize = $itemSize;
    }

    public function getAllItemSize() {
        $itemSizes = $this->itemSize->getAllItemSize();
        header('Content-Type: application/json');
        if ($itemSizes) {
            echo json_encode([
                "success" => true,
                "item" => $itemSizes
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "No item size available"
            ]);
        }
    }

    public function getItemSizeById($id) {
        $itemSize = $this->itemSize->getItemSizeById($id);
        header('Content-Type: application/json');
        if ($itemSize) {
            echo json_encode([
                "success" => true,
                "item" => $itemSize
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "No item size available"
            ]);
        }
    }


    public function createItemSize() {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $this->itemSize->createItemSize($data);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "message" => "Item size added successfully",
            "id" => $id
        ]);
    }


    public function updateItemSize($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->itemSize->updateItemSize($id, $data);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $result,
            "message" => "Item size updated successfully",
        ]);
    }


    public function deleteItemSize($id) {
        $result = $this->itemSize->deleteItemSize($id);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $result,
            "message" => "Item size deleted successfully",
        ]);
    }
}

$controller = new ItemSizeController($itemSize);
$method = $_GET['method'] ?? "";

switch ($method) {
    case "getAllItemSize":
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $controller->getAllItemSize();
        }
        break;

    case "getItemSizeById":
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Item size id required"
                ]);
            } else {
                $controller->getItemSizeById($_GET["id"]);
            }
        }
        break;

    case "createItemSize":
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $controller->createItemSize();
        }
        break;

    case "updateItemSize":
        if ($_SERVER["REQUEST_METHOD"] == "PUT") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Item size id required"
                ]);
            } else {
                $controller->updateItemSize($_GET["id"]);
            }
        }
        break;

    case "deleteItemSize":
        if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Item size id required"
                ]);
            } else {
                $controller->deleteItemSize($_GET["id"]);
            }
        }
        break;
    default:
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Endpoint not found"
        ]);
        break;
}