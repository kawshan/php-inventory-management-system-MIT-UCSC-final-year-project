<?php
require_once "../config/database.php";
require_once "../models/RawMaterialCategory.php";

$database = new Database();
$connection = $database->connect();
$rawMaterialCategory = new RawMaterialCategory($connection);

class RawMaterialCategoryController {

    private $rawMaterialCategory;

    public function __construct($rawMaterialCategory) {
        $this->rawMaterialCategory = $rawMaterialCategory;
    }


    public function findAll() {
        $rawMaterialCategory = $this->rawMaterialCategory->getAll();

        header("Content-Type: application/json");

        echo json_encode([
            "success" => true,
            "data" => $rawMaterialCategory
        ]);
    }


    public function getById($id) {
        $rawMaterialCategory = $this->rawMaterialCategory->getById($id);

        header("Content-Type: application/json");

        if ($rawMaterialCategory) {

            echo json_encode([
                "success" => true,
                "data" => $rawMaterialCategory
            ]);

        } else {

            http_response_code(404);

            echo json_encode([
                "success" => false,
                "message" => "Item not found"
            ]);
        }
    }


    public function create() {
        try {
            $data = json_decode(
                file_get_contents("php://input"),
                true
            );

            $id = $this->rawMaterialCategory->create($data);

            header("Content-Type: application/json");

            http_response_code(201);

            echo json_encode([
                "success" => true,
                "message" => "Item created successfully",
                "id" => $id
            ]);

        } catch (Throwable $error) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $error->getMessage(),
            ]);
        }
    }


    public function update($id) {
        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $result = $this->rawMaterialCategory->update($id, $data);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => $result,
            "message" => "Item updated successfully"
        ]);
    }


    public function delete($id) {
        $result = $this->rawMaterialCategory->delete($id);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => $result,
            "message" => "Item deleted successfully"
        ]);
    }
}

$controller = new RawMaterialCategoryController($rawMaterialCategory);
$method = $_GET["method"] ?? "";

switch ($method) {

    case "findAll":

        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            $controller->findAll();
        }

        break;

    case "getById":

        if ($_SERVER["REQUEST_METHOD"] === "GET") {

            if (!isset($_GET["id"])) {

                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "ID is required"
                ]);

                exit;
            }

            $controller->getById($_GET["id"]);
        }

        break;


    case "create":

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $controller->create();
        }

        break;

    case "update":

        if ($_SERVER["REQUEST_METHOD"] === "PUT") {

            if (!isset($_GET["id"])) {

                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "ID is required"
                ]);

                exit;
            }

            $controller->update($_GET["id"]);
        }

        break;


    case "delete":

        if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

            if (!isset($_GET["id"])) {

                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "ID is required"
                ]);

                exit;
            }

            $controller->delete($_GET["id"]);
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




