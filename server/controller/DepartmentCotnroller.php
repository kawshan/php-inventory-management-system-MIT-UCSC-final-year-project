<?php


require_once "../config/database.php";
require_once "../models/Department.php";

$database = new Database();
$connection= $database->connect();
$department = new Department($connection);

class DepartmentCotnroller{
        private $department;
      public function __construct($department) {
        $this->department = $department;
    }


    public function getAllDepartments() {
          $result = $this->department->getAllDepartments();
          header('Content-Type: application/json');
          if ($result) {
              echo json_encode([
                  "data" => $result
              ]);
          }else{
              echo json_encode([
                  "success" => false,
                  "message" => "No items found."
              ]);
          }
    }
}
$controller = new DepartmentCotnroller($department);
$method = $_GET["method"] ?? "";

switch ($method) {
    case "findAll":
        if ($_SERVER["REQUEST_METHOD"]=="GET"){
            $controller->getAllDepartments();
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










