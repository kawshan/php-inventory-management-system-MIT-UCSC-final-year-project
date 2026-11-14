<?php

require_once "../config/database.php";
require_once "../models/GrnMaster.php";

$database = new Database();
$connection = $database->connect();
$grnMaster = new GrnMaster($connection);


class GrnMasterController {

    private $grnMaster;

    public function __construct($grnMaster) {
        $this->grnMaster = $grnMaster;
    }


    public function getAllGrnMaster() {
        try {
            $grnList = $this->grnMaster->findAll();
            header("Content-type: application/json");
            echo json_encode($grnList);
        } catch (Throwable $th) {
            echo $th->getMessage();
        }
    }

    public function createGrnMaster() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $this->grnMaster->create($data);
            header("Content-type: application/json");
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "GrnMaster has been created.",
                "id" => $id
            ]);
        } catch (Throwable $th) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $th->getMessage()
            ]);
        }
    }


    public function updateGrnMaster($id) {

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $this->grnMaster->update($id, $data);
            header("Content-type: application/json");
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "GrnMaster has been updated.",
                "id" => $id
            ]);
        } catch (Throwable $th) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $th->getMessage()
            ]);
        }

    }


    public function deleteGrnMaster($id) {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $this->grnMaster->delete($id,$data);
            header("Content-type: application/json");
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "GrnMaster has been deleted.",
                "id" => $id
            ]);
        } catch (Throwable $th) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $th->getMessage()
            ]);
        }
    }
}


$controller = new GrnMasterController($grnMaster);
$method = $_GET["method"] ?? "";
switch ($method) {

    case "findAll":
        $controller->getAllGrnMaster();
        break;

    case "create":
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $controller->createGrnMaster();
        }
        break;

    case "update":
        if ($_SERVER["REQUEST_METHOD"] == "PUT") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Id is required."
                ]);
                exit;
            }
            $controller->updateGrnMaster($_GET["id"]);
        }
        break;

    case "delete":
        $controller->deleteGrnMaster($_GET["id"]);
        break;

    default:
        http_response_code(404);
        header("content-type: application/json");
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed."
        ]);
        break;
}