<?php
require_once "../config/database.php";
require_once "../models/JobMaster.php";

$database = new Database();
$connection = $database->connect();
$jobMaster = new JobMaster($connection);

class JobMasterController {

    private $jobMaster;

    public function __construct($jobMaster) {
        $this->jobMaster = $jobMaster;
    }

    public function findAll() {
        try {
            $jobs = $this->jobMaster->findAll();
            header("Content-type: application/json");
            http_response_code(200);
            echo json_encode($jobs);
        } catch (Throwable $error) {
            echo $error;
        }
    }


    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $this->jobMaster->create($data);
            header("Content-type: application/json");
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Job Master created",
                "id" => $id
            ]);
        } catch (Throwable $error) {
            http_response_code(501);
            echo json_encode([
                "success" => false,
                "message" => $error->getMessage()
            ]);
        }
    }


    public function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->jobMaster->update($id, $data);
        header("Content-type: application/json");
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Job Master updated",
            "result" => $result
        ]);
    }

    public function delete($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->jobMaster->delete($id, $data);

        header("Content-type: application/json");
        http_response_code(200);

        echo json_encode([
            "success" => true,
            "message" => "Job Master deleted",
            "result" => $result
        ]);

    }


}


$controller = new JobMasterController($jobMaster);
$method = $_GET['method'] ?? "";

switch ($method) {
    case "findAll":
        $controller->findAll();
        break;

    case "create":
        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $controller->create();
        }
        break;
    case "update":
        if ($_SERVER['REQUEST_METHOD'] == "PUT") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Missing id"
                ]);
                exit;
            }
            $controller->update($_GET["id"]);
        }
        break;


    case "delete":
        if ($_SERVER['REQUEST_METHOD'] == "DELETE") {
            if (!isset($_GET["id"])) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Missing id"
                ]);
            }
            $controller->delete($_GET["id"]);
        }
        break;

    default:
        http_response_code(404);
        header("Content-type: application/json");
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed"
        ]);
        break;
}





