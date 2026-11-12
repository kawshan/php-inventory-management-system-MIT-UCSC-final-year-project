<?php

require_once "../config/database.php";
require_once "../models/AssetMaster.php";

$database = new Database();

$connection = $database->connect();

$assetMaster = new AssetMaster($connection);


class AssetMasterController {
    private $assetMaster;

    public function __construct($assetMaster) {
        $this->assetMaster = $assetMaster;
    }


    public function getAllAssetMaster() {
        $assetMasterList = $this->assetMaster->getAll();
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "data" => $assetMasterList
        ]);

    }


    public function getById($id) {
        $assetMaster = $this->assetMaster->getById($id);
        header('Content-Type: application/json');
        if ($assetMaster) {
            echo json_encode([
                "success" => true,
                "data" => $assetMaster
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
            $id = $this->assetMaster->create($data);
            header('Content-Type: application/json');

            if ($id === null) {

                http_response_code(409);

                echo json_encode([
                    "success" => false,
                    "message" => "Asset already exists!"
                ]);

                return;
            }



            http_response_code(200);
            echo json_encode([
                "success" => true,
                "assetCat" => $id,
                "message" => "Asset created!"
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
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->assetMaster->update($id, $data);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $result,
            "message" => "Asset successfully updated",
        ]);
    }


    public function deleteAssetMaster($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->assetMaster->delete($id, $data);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $result,
            "message" => "Asset successfully delete",
        ]);
    }

}


$controller = new AssetMasterController($assetMaster);

$method = $_GET["method"] ?? "";
switch ($method) {
    case  "findAll":
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $controller->getAllAssetMaster();
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
            $controller->update($_GET["id"]);
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
            $controller->deleteAssetMaster($_GET["id"]);
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