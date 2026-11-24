<?php

require_once "../config/database.php";
require_once "../models/AssertAssignmentMaster.php";


$database = new Database();

$connection = $database->connect();

$assertAssignmentMaster = new AssertAssignmentMaster($connection);


class AssertAssignmentMasterController {

    private $assertAssignmentMaster;

    public function __construct($assertAssignmentMaster) {

        $this->assertAssignmentMaster = $assertAssignmentMaster;

    }


    public function findAll() {

        try {

            $assignments = $this->assertAssignmentMaster->findAll();

            header("Content-type: application/json");

            http_response_code(200);

            echo json_encode($assignments);


        } catch (Throwable $error) {

            echo $error;

        }

    }


    public function create() {

        try {

            $data = json_decode(file_get_contents("php://input"), true);

            $id = $this->assertAssignmentMaster->create($data);

            header("Content-type: application/json");

            http_response_code(201);

            echo json_encode([

                "success" => true,

                "message" => "Assignment created successfully",

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

        $result = $this->assertAssignmentMaster->update($id, $data);

        header("Content-type: application/json");

        http_response_code(200);

        echo json_encode([

            "success" => true,

            "message" => "Assignment updated successfully",

            "result" => $result

        ]);

    }


    public function delete($id) {

        $data = json_decode(file_get_contents("php://input"), true);

        $result = $this->assertAssignmentMaster->delete($id, $data);

        header("Content-type: application/json");

        http_response_code(200);

        echo json_encode([

            "success" => true,

            "message" => "Assignment deleted successfully",

            "result" => $result

        ]);

    }

}


$controller = new AssertAssignmentMasterController($assertAssignmentMaster);


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

                exit;

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

?>