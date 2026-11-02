<?php
require_once "../config/database.php";
require_once "../models/StockTransferMaster.php";

$database = new Database();
$connection = $database->connect();
$stockTransferMaster = new StockTransferMaster($connection);


class StockTransferController {

    private $stockTransferMaster;

    public function __construct($stockTransferMaster) {
        $this->stockTransferMaster = $stockTransferMaster;
    }


    public function findAll() {
        try {
            $transfers = $this->stockTransferMaster->findAll();
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode($transfers);
        } catch (Throwable $error) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                "success" => false,
                "message" => $error->getMessage(),
            ]);
        }
    }

    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $this->stockTransferMaster->create($data);
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Stock Transfer created",
                "id" => $id
            ]);
        } catch (Throwable $error) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                "success" => false,
                "message" => $error->getMessage(),
            ]);
        }
    }


    public function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->stockTransferMaster->update($id, $data);
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Stock Transfer updated",
        ]);
    }


    public function delete($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->stockTransferMaster->delete($id, $data);
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Stock Transfer deleted",
        ]);
    }
}


$controller = new StockTransferController($stockTransferMaster);
$method = $_GET['method'] ?? "";

switch ($method) {
    case "findAll":
        $controller->findAll();
        break;

    case "create":
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $controller->create();
        }
        break;

    case "update":
        if ($_SERVER['REQUEST_METHOD'] == "PUT") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Missing Id",
                ]);
                exit;
            }
            $controller->update($_GET["id"]);
        }
        break;
    case "delete":
        if ($_SERVER['REQUEST_METHOD'] == "DELETE") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Missing Id",
                ]);
                exit;
            }
            $controller->delete($_GET["id"]);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Method Not Allowed",
        ]);
        break;
}