<?php
require_once "../config/database.php";
require_once "../models/PaymentType.php";


$database = new Database();
$connection = $database->connect();
$paymentType = new PaymentType($connection);



class PaymentTypeController{

    private $paymentTypes;

    public function __construct($paymentTypes) {
        $this->paymentTypes = $paymentTypes;
    }


    public function getAllPaymentTypes() {
        $paymentTypes = $this->paymentTypes->getAllPaymentTypes();
        header("Content-type: application/json");
        if ($paymentTypes){
            echo json_encode([
               "success" => true,
               "paymentTypes" => $paymentTypes
            ]);
        }else{
            echo json_encode([
                "success" => false,
                "message" => "No payment types found."
            ]);
        }
    }
}

$controller = new PaymentTypeController($paymentType);
$method  = $_GET["method"] ?? "";

switch ($method) {
    case "getAllPaymentTypes":
        $controller->getAllPaymentTypes();
        break;
    default:
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed."
        ]);
}






