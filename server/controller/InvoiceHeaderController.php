<?php

require_once "../config/database.php";
require_once "../models/InvoiceHeader.php";

$database = new Database();
$connection = $database->connect();
$invoiceHeader = new InvoiceHeader($connection);

class InvoiceHeaderController {

    private $invoiceHeader;

    public function __construct($invoiceHeader) {
        $this->invoiceHeader = $invoiceHeader;
    }


    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"),true);
            $id = $this->invoiceHeader->create($data);
            header("Content-Type: application/json");
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Invoice created successfully.",
                "id" => $id
            ]);
        }catch (Throwable $error){
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $error->getMessage()
            ]);
        }
    }
}


$controller = new InvoiceHeaderController($invoiceHeader);

$method = $_GET["method"] ?? "";

switch ($method) {
    case "create":
        if ($_SERVER["REQUEST_METHOD"]=="POST"){
            $controller->create();
        }
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














