<?php

require_once "../config/database.php";
require_once "../models/IssueNoteMaster.php";

$database = new Database();
$connection = $database->connect();
$issueNoteMaster = new IssueNoteMaster($connection);


class IssueNoteMasterController {

    private $issueNoteMaster;

    public function __construct($issueNoteMaster) {
        $this->issueNoteMaster = $issueNoteMaster;
    }


    public function findAll() {
        try {
            $issueNotes = $this->issueNoteMaster->findAll();

            header("Content-type: application/json");
            http_response_code(200);

            echo json_encode($issueNotes);

        } catch (Throwable $error) {
            echo $error;
        }
    }


    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $id = $this->issueNoteMaster->create($data);

            header("Content-type: application/json");
            http_response_code(201);

            echo json_encode([
                "success" => true,
                "message" => "Issue Note Master created",
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

        $result = $this->issueNoteMaster->update($id, $data);

        header("Content-type: application/json");
        http_response_code(200);

        echo json_encode([
            "success" => true,
            "message" => "Issue Note Master updated",
        ]);
    }


    public function delete($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        $result = $this->issueNoteMaster->delete($id, $data);

        header("Content-type: application/json");
        http_response_code(200);

        echo json_encode([
            "success" => true,
            "message" => "Issue Note Master deleted"
        ]);

    }


}


$controller = new IssueNoteMasterController($issueNoteMaster);

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