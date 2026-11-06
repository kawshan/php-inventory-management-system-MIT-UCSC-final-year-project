<?php
require_once "../config/database.php";
require_once "../models/UserMaster.php";

$database = new Database();
$connection = $database->connect();
$userMaster = new UserMaster($connection);

class UserMasterController {

    private $userMaster;

    public function __construct($userMaster) {
        $this->userMaster = $userMaster;
    }


    public function findAll() {
        $users = $this->userMaster->findAll();
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "employees" => $users
        ]);
    }


    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $this->userMaster->create($data);
            header('Content-Type: application/json');

            if ($id === null) {

                http_response_code(409);

                echo json_encode([
                    "success" => false,
                    "message" => "User Name already exists! "
                ]);

                return;
            }



            http_response_code(200);
            echo json_encode([
                "success" => true,
                "employeeId" => $id,
                "message" => "User created!"
            ]);
        } catch (Throwable $error) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $error->getMessage(),
            ]);
        }
    }


    public function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->userMaster->update($id, $data);
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode([
            "success" => $result,
            "message" => "User updated!"
        ]);
    }


    public function delete($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->userMaster->delete($id,$data);
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode([
            "success" => $result,
            "message" => "User deleted!"
        ]);
    }

}

$controller = new UserMasterController($userMaster);
$method = $_GET["method"] ?? "";
switch ($method) {

    case "findAll":

        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            $controller->findAll();
        }
        break;

    case "create":

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $controller->create();
        }

        break;


    case "update":

        if ($_SERVER["REQUEST_METHOD"] === "PUT") {

            if (!isset($_GET["id"])) {

                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "ID is required"
                ]);

                exit;
            }
            $controller->update($_GET["id"]);
        }

        break;

    case "delete":

        if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

            if (!isset($_GET["id"])) {

                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "ID is required"
                ]);

                exit;
            }

            $controller->delete($_GET["id"]);
        }

        break;


    default:

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Endpoint not found"
        ]);

        break;


}