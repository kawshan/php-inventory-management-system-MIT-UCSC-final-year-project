<?php
require_once "../config/database.php";
require_once "../models/InvoiceStatus.php";

$database = new Database();
$connection = $database->connect();
$invoiceStatus = new InvoiceStatus($connection);


class InvoiceStatusController{

    private $invoiceStatus;

    public function __construct($invoiceStatus) {
        $this->invoiceStatus = $invoiceStatus;
    }


    public function getAllInvoiceStatusesList() {
        $invoiceStatuses = $this->invoiceStatus->getAllInvoiceStatuses();
        header("Content-type: application/json");
        if ($invoiceStatuses){
            echo json_encode([
               "success" => true,
               "status" => $invoiceStatuses
            ]);
        }else{
            echo json_encode([
                "success" => false,
                "message" => "No invoice_statuses were found!"
            ]);
        }
    }
}


$controller = new InvoiceStatusController($invoiceStatus);
$method = $_GET["method"] ?? "";


switch ($method) {
    case "getAllInvoiceStatusesList":
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $controller->getAllInvoiceStatusesList();
        }
        break;

        default:
            http_response_code(405);
            echo json_encode([
                "success" => false,
                "message" => "Method not allowed"
            ]);
            break;



}
