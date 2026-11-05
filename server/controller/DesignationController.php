<?php

require_once "../config/database.php";
require_once "../models/Designation.php";

$database = new Database();
$connection= $database->connect();
$designation = new Designation($connection);

class DesignationController{
        private $designation;
      public function __construct($designation) {
        $this->designation = $designation;
    }


    public function getAllDesignations() {
          $designations = $this->designation->getAllDesignations();
          header('Content-Type: application/json');
          if ($designations) {
              echo json_encode([
                  "success" => true,
                  "status" => $designations
              ]);
          }else{
              echo json_encode([
                  "success" => false,
                  "message" => "No items found."
              ]);
          }
    }
}
$controller = new DesignationController($designation);
$method = $_GET["method"] ?? "";

switch ($method) {
    case "findAll":
        if ($_SERVER["REQUEST_METHOD"]=="GET"){
            $controller->getAllDesignations();
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










