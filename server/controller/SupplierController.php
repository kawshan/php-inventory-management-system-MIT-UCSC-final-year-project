<?php



require_once "../config/database.php";
require_once "../models/Supplier.php";

$database = new Database();
$connection= $database->connect();
$supplier = new Supplier($connection);

class SupplierController {
        private $supplier;
      public function __construct($supplier) {
        $this->supplier = $supplier;
    }


    public function getAllSupplier() {
          $resultList = $this->supplier->getAllSupplier();
          header('Content-Type: application/json');
          if ($resultList) {
              echo json_encode([
                  "success" => true,
                  "data" => $resultList
              ]);
          }else{
              echo json_encode([
                  "success" => false,
                  "message" => "No items found."
              ]);
          }
    }
}
$controller = new SupplierController($supplier);
$method = $_GET["method"] ?? "";

switch ($method) {
    case "findAll":
        if ($_SERVER["REQUEST_METHOD"]=="GET"){
            $controller->getAllSupplier();
        }
        break;



    default:
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Endpoint not found."
        ]);
        break;
}










