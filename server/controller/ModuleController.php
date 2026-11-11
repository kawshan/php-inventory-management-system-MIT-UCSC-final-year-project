<?php
require_once "../config/database.php";
require_once "../models/ModuleMaster.php";

$database = new Database();
$connection= $database->connect();
$module = new ModuleMaster($connection);

class ModuleController{
        private $module;
      public function __construct($module) {
        $this->module = $module;
    }


    public function getAllModules() {
          $modulesList = $this->module->getAllModules();
          header('Content-Type: application/json');
          if ($modulesList) {
              echo json_encode([
                  "success" => true,
                  "data" => $modulesList
              ]);
          }else{
              echo json_encode([
                  "success" => false,
                  "message" => "No items found."
              ]);
          }
    }
}



$controller = new ModuleController($module);
$method = $_GET["method"] ?? "";

switch ($method) {
    case "findAll":
        if ($_SERVER["REQUEST_METHOD"]=="GET"){
            $controller->getAllModules();
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










