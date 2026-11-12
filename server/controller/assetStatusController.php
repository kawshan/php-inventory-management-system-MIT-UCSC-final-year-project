<?php

require_once "../config/database.php";
require_once "../models/AssetStatusMaster.php";

$database = new Database();
$connection= $database->connect();
$assetStatus = new AssetStatusMaster($connection);

class AssetStatusController {
        private $assetStatus;
      public function __construct($assetStatus) {
        $this->assetStatus = $assetStatus;
    }


    public function getAllAssetStatus() {
          $itemStatuses = $this->assetStatus->getAllAssetStatus();
          header('Content-Type: application/json');
          if ($itemStatuses) {
              echo json_encode([
                  "success" => true,
                  "data" => $itemStatuses
              ]);
          }else{
              echo json_encode([
                  "success" => false,
                  "message" => "No items found."
              ]);
          }
    }
}
$controller = new AssetStatusController($assetStatus);
$method = $_GET["method"] ?? "";

switch ($method) {
    case "findAll":
        if ($_SERVER["REQUEST_METHOD"]=="GET"){
            $controller->getAllAssetStatus();
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










