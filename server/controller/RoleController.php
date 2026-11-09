<?php
require_once "../config/database.php";
require_once "../models/RoleMaster.php";

$database = new Database();
$connection= $database->connect();
$role = new RoleMaster($connection);

class RoleController{
        private $role;
      public function __construct($role) {
        $this->role = $role;
    }


    public function getAllRoles() {
          $roles = $this->role->getallRoles();
          header('Content-Type: application/json');
          if ($roles) {
              echo json_encode([
                  "success" => true,
                  "data" => $roles
              ]);
          }else{
              echo json_encode([
                  "success" => false,
                  "message" => "No items found."
              ]);
          }
    }


    public function getAllRolesWithoutAdminAndOwner() {
        $roles = $this->role->getAllRolesWithoutAdminAndOwner();
        header('Content-Type: application/json');
        if ($roles) {
            echo json_encode([
                "success" => true,
                "data" => $roles
            ]);
        }else{
            echo json_encode([
                "success" => false,
                "message" => "No items found."
            ]);
        }
    }












}
$controller = new RoleController($role);
$method = $_GET["method"] ?? "";

switch ($method) {
    case "findAll":
        if ($_SERVER["REQUEST_METHOD"]=="GET"){
            $controller->getAllRoles();
        }
        break;



    case "getAllRolesWithoutAdminAndOwner":
        if ($_SERVER["REQUEST_METHOD"]=="GET"){
            $controller->getAllRolesWithoutAdminAndOwner();
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










