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
            "users" => $users
        ]);
    }



public function createAdmin() {

    $admin = $this->userMaster->createAdmin();

    header('Content-Type: application/json');

    echo json_encode([
        "success" => $admin["success"],
        "data" => $admin
    ]);
}



    public function findByUsername($username) {
        $result = $this->userMaster->getByUserName($username);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "exists" => $result
        ]);
    }


    public function login() {

        $data = json_decode(file_get_contents("php://input"), true);

        $user = $this->userMaster->login($data);

        if (!$user) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid username or password!"
            ]);

            exit();
        }

        session_start();

        session_regenerate_id(true);

        $_SESSION["user"] = $user;

        echo json_encode([
            "success" => true,
            "message" => "User logged in successfully!",
            "user" => $user
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
                    "message" => "User already exists!"
                ]);

                return;
            }



            http_response_code(200);
            echo json_encode([
                "success" => true,
                "employeeId" => $id,
                "message" => "user created!"
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


        if (!$result) {

            http_response_code(409);

            echo json_encode([
                "success" => false,
                "message" => "User Name already exists! "
            ]);

            return;
        }





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


    public function changePassword() {

        session_start();

        if (!isset($_SESSION["user"])) {

            http_response_code(401);

            echo json_encode([
                "success" => false,
                "message" => "Unauthorized!"
            ]);

            exit();

        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data["current_password"]) ||
            empty($data["new_password"]) ||
            empty($data["confirm_password"])
        ) {

            echo json_encode([
                "success" => false,
                "message" => "All fields are required!"
            ]);

            exit();

        }

        if ($data["new_password"] !== $data["confirm_password"]) {

            echo json_encode([
                "success" => false,
                "message" => "New passwords do not match!"
            ]);

            exit();

        }

        if (strlen($data["new_password"]) < 8) {

            echo json_encode([
                "success" => false,
                "message" => "Password must contain at least 8 characters!"
            ]);

            exit();

        }

        $data["user_id"] = $_SESSION["user"]["id"];

        $result = $this->userMaster->changePassword($data);

        echo json_encode($result);

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

    case "createAdmin":

        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            $controller->createAdmin();
        }
        break;





     case "login":
         $controller->login();
         break;



    case "changePassword":
        $controller->changePassword();
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


     case "getByUsername":
         if (!isset($_GET["username"])) {
             http_response_code(400);
             echo json_encode([
                 "success" => false,
                 "message" => "Username is required"
             ]);
             exit;
         }
         $controller->findByUsername($_GET["username"]);
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