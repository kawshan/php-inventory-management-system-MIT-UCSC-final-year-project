<?php

require_once "../config/database.php";
require_once "../models/StockAdjustmentMaster.php";

$database = new Database();
$connection = $database->connect();
$stockAdjustmentMaster = new StockAdjustmentMaster($connection);


class StockAdjustmentController {

    private $stockAdjustmentMaster;

    public function __construct($stockAdjustmentMaster) {
        $this->stockAdjustmentMaster = $stockAdjustmentMaster;
    }


    public function findAll() {
        try {
            $adjustments = $this->stockAdjustmentMaster->findAll();
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode($adjustments);
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
            $id = $this->stockAdjustmentMaster->create($data);
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Stock Adjustment created",
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
        $result = $this->stockAdjustmentMaster->update($id, $data);
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Stock Adjustment updated",
        ]);
    }


    public function delete($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->stockAdjustmentMaster->delete($id, $data);
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Stock Adjustment deleted",
        ]);
    }
}


$controller = new StockAdjustmentController($stockAdjustmentMaster);
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