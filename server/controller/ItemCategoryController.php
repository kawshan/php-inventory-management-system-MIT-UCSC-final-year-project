<?php

require_once "../config/database.php";
require_once "../models/ItemCategoryMaster.php";

$database = new Database();

$connection = $database->connect();

$itemCategoryMaster = new ItemCategoryMaster($connection);


class ItemCategoryController {
    private $itemCategoryMaster;

    public function __construct($itemCategoryMaster) {
        $this->itemCategoryMaster = $itemCategoryMaster;
    }


    public function getAllItemCategoryMaster() {
        $itemCategories = $this->itemCategoryMaster->getAllItemCategories();
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "items" => $itemCategories
        ]);

    }


    public function getById($id) {
        $itemCategory = $this->itemCategoryMaster->getItemCategoryById($id);
        header('Content-Type: application/json');
        if ($itemCategory) {
            echo json_encode([
                "success" => true,
                "item" => $itemCategory
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Item Category not found"
            ]);
        }
    }


    public function createItemCategoryMaster() {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $this->itemCategoryMaster->createItemCategory($data);
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Item Category successfully created",
            "id" => $id
        ]);
    }


    public function updateItemCategoryMaster($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->itemCategoryMaster->updateItemCategory($id, $data);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $result,
            "message" => "Item Category successfully updated",
        ]);
    }


    public function deleteItemCategoryMaster($id) {
        $result = $this->itemCategoryMaster->deleteItemCategory($id);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $result,
            "message" => "Item Category successfully deleted"
        ]);
    }

}


$controller = new ItemCategoryController($itemCategoryMaster);

$method = $_GET["method"] ?? "";
switch ($method) {
    case  "getAllItemCategoryMaster":
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $controller->getAllItemCategoryMaster();
        }
        break;
    case  "getById":

        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Item Category not found"
                ]);
                exit;
            }
            $controller->getById($_GET["id"]);
        }

        break;

    case "createItemCategoryMaster":
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $controller->createItemCategoryMaster();
        }
        break;
    case "updateItemCategoryMaster":
        if ($_SERVER["REQUEST_METHOD"] == "PUT") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Id required for update"
                ]);
                exit;
            }
            $controller->updateItemCategoryMaster($_GET["id"]);
        }
        break;

    case "deleteItemCategoryMaster":
        if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Id required for delete"
                ]);
                exit;
            }
            $controller->deleteItemCategoryMaster($_GET["id"]);
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