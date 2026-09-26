<?php

require_once "../config/database.php";
require_once "../models/ItemStatus.php";

$database = new Database();
$connection= $database->connect();
$itemStatus = new ItemStatus($connection);

class ItemStatusController {
        private $itemStatus;
      public function __construct($itemStatus) {
        $this->itemStatus = $itemStatus;
    }


    public function getAllItemStatus() {
          $itemStatuses = $this->itemStatus->getAllItemStatus();
          header('Content-Type: application/json');
          if ($itemStatuses) {
              echo json_encode([
                  "success" => true,
                  "status" => $itemStatuses
              ]);
          }else{
              echo json_encode([
                  "success" => false,
                  "message" => "No items found."
              ]);
          }
    }
}
$controller = new ItemStatusController($itemStatus);
$method = $_GET["method"] ?? "";

switch ($method) {
    case "getAllItemStatus":
        if ($_SERVER["REQUEST_METHOD"]=="GET"){
            $controller->getAllItemStatus();
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










