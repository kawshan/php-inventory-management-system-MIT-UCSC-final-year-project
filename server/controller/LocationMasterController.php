<?php

require_once "../config/database.php";
require_once "../models/LocationMaster.php";

$database = new Database();
$connection = $database->connect();
$locationMaster = new LocationMaster($connection);
class LocationMasterController {

    private $locationMaster;
    public function __construct($locationMaster) {
        $this->locationMaster = $locationMaster;
    }

    public function getAllLocations() {
        $locations = $this->locationMaster->getAllLocations();
        header('Content-type: application/json');
        if($locations){
          echo json_encode([
              "success" => true,
              "locations" => $locations
          ]);
        }else{
            echo json_encode([
                "success" => false,
                "message" => "No locations found."
            ]);
        }
    }


    public function createLocation() {
        try {

            $data = json_decode(file_get_contents("php://input"),true);
            $id = $this->locationMaster->createLocation($data);
            header('Content-type: application/json');
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Location created.",
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

    public function updateLocation($id) {
        $data = json_decode(file_get_contents("php://input"),true);
        $result = $this->locationMaster->updateLocation($id, $data);
        header('Content-type: application/json');
        echo json_encode([
            "success" => true,
            "message" => "Location updated.",
        ]);
    }

    public function deleteLocation($id) {
        $result = $this->locationMaster->deleteLocation($id);
        header('Content-type: application/json');
        echo json_encode([
            "success" => true,
            "message" => "Location deleted."
        ]);
    }
}


$controller = new LocationMasterController($locationMaster);
$method = $_GET["method"] ?? "";

switch ($method) {
    case "getAllLocations":
        $controller->getAllLocations();
        break;
    case "createLocation":
        if ($_SERVER["REQUEST_METHOD"]=="POST") {
            $controller->createLocation();
        }
        break;
    case "updateLocation"   :
        if ($_SERVER["REQUEST_METHOD"]=="PUT"){
            if (!isset($_GET["id"])){
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Location id not set."
                ]);
                exit();
            }
            $controller->updateLocation($_GET["id"]);
        }
        break;
    case "deleteLocation"   :
        if ($_SERVER["REQUEST_METHOD"]=="DELETE"){
            if (!isset($_GET["id"])){
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Location id not set."
                ]);
                exit();
            }
            $controller->deleteLocation($_GET["id"]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed."
        ]);
        break;
}

