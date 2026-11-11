<?php

require_once "../config/database.php";
require_once "../models/AssetCategoryMaster.php";

$database = new Database();

$connection = $database->connect();

$assetCategoryMaster = new AssetCategoryMaster($connection);


class AssetCategoryController {
    private $assetCategoryMaster;

    public function __construct($assetCategoryMaster) {
        $this->assetCategoryMaster = $assetCategoryMaster;
    }


    public function getAllAssetCategoryMaster() {
        $assetCategoriesList = $this->assetCategoryMaster->getAll();
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "data" => $assetCategoriesList
        ]);

    }


    public function getById($id) {
        $assetCategory = $this->assetCategoryMaster->getAssetCategoryById($id);
        header('Content-Type: application/json');
        if ($assetCategory) {
            echo json_encode([
                "success" => true,
                "data" => $assetCategory
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Item Category not found"
            ]);
        }
    }


    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $this->assetCategoryMaster->create($data);
            header('Content-Type: application/json');

            if ($id === null) {

                http_response_code(409);

                echo json_encode([
                    "success" => false,
                    "message" => "Asset category already exists!"
                ]);

                return;
            }



            http_response_code(200);
            echo json_encode([
                "success" => true,
                "assetCat" => $id,
                "message" => "Category created!"
            ]);
        } catch (Throwable $error) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $error->getMessage(),
            ]);
        }
    }


    public function updateAssetCategoryMaster($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->assetCategoryMaster->update($id, $data);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $result,
            "message" => "Asset Category successfully updated",
        ]);
    }


    public function deleteAssetCategoryMaster($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->assetCategoryMaster->deleteAssetCategory($id, $data);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $result,
            "message" => "Asset Category successfully delete",
        ]);
    }

}


$controller = new AssetCategoryController($assetCategoryMaster);

$method = $_GET["method"] ?? "";
switch ($method) {
    case  "findAll":
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $controller->getAllAssetCategoryMaster();
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

    case "create":
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $controller->create();
        }
        break;
    case "update":
        if ($_SERVER["REQUEST_METHOD"] == "PUT") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Id required for update"
                ]);
                exit;
            }
            $controller->updateAssetCategoryMaster($_GET["id"]);
        }
        break;

    case "delete":
        if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Id required for delete"
                ]);
                exit;
            }
            $controller->deleteAssetCategoryMaster($_GET["id"]);
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