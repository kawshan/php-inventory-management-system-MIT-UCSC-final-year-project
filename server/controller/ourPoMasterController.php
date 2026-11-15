<?php

require_once "../config/database.php";
require_once "../models/ourPoMaster.php";

$database = new Database();
$connection = $database->connect();
$ourPoMaster = new OurPoMaster($connection);


class OurPoMasterController {

    private $ourPoMaster;

    public function __construct($ourPoMaster) {
        $this->ourPoMaster = $ourPoMaster;
    }


    public function getAllOurPoMaster() {
        try {
            $poList = $this->ourPoMaster->getAllOurPoMaster();
            header("Content-type: application/json");
            echo json_encode($poList);
        } catch (Throwable $th) {
            echo $th->getMessage();
        }
    }


    public function createPoMaster() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $this->ourPoMaster->createOurPoMaster($data);
            header("Content-type: application/json");
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "purchase order has been created.",
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


    public function updatePoMaster($id) {

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $this->ourPoMaster->updateOurPoMaster($id, $data);
            header("Content-type: application/json");
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "purchase order has been updated.",
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

    public function deletePoMaster($id) {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $this->ourPoMaster->deleteOurPoMaster($id, $data);
            header("Content-type: application/json");
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "purchase order has been deleted.",
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

$controller = new OurPoMasterController($ourPoMaster);
$method = $_GET["method"] ?? "";
switch ($method) {

    case "findAll":
        $controller->getAllOurPoMaster();
        break;

    case "create":
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $controller->createPoMaster();
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
            $controller->updatePoMaster($_GET["id"]);
        }
        break;


    case "delete":
        $controller->deletePoMaster($_GET["id"]);
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