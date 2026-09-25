<?php

require_once "../config/database.php";
require_once "../models/ItemMaster.php";


$database = new Database();

$connection = $database->connect();


$itemMaster = new ItemMaster($connection);


class ItemMasterController
{
    private $itemMaster;


    public function __construct($itemMaster)
    {
        $this->itemMaster = $itemMaster;
    }


    // GET ALL ITEMS
    public function findAll()
    {
        $items = $this->itemMaster->getAll();

        header("Content-Type: application/json");

        echo json_encode([
            "success" => true,
            "data" => $items
        ]);
    }


    // GET ITEM BY ID
    public function getById($id)
    {
        $item = $this->itemMaster->getById($id);

        header("Content-Type: application/json");

        if ($item) {

            echo json_encode([
                "success" => true,
                "data" => $item
            ]);

        } else {

            http_response_code(404);

            echo json_encode([
                "success" => false,
                "message" => "Item not found"
            ]);
        }
    }


    // CREATE ITEM
    public function create()
    {
        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $id = $this->itemMaster->create($data);

        header("Content-Type: application/json");

        http_response_code(201);

        echo json_encode([
            "success" => true,
            "message" => "Item created successfully",
            "id" => $id
        ]);
    }


    // UPDATE ITEM
    public function update($id)
    {
        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $result = $this->itemMaster->update($id, $data);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => $result,
            "message" => "Item updated successfully"
        ]);
    }


    // DELETE ITEM
    public function delete($id)
    {
        $result = $this->itemMaster->delete($id);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => $result,
            "message" => "Item deleted successfully"
        ]);
    }
}


$controller = new ItemMasterController($itemMaster);



$method = $_GET["method"] ?? "";

switch ($method) {

    case "findAll":

        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            $controller->findAll();
        }

        break;


    case "getById":

        if ($_SERVER["REQUEST_METHOD"] === "GET") {

            if (!isset($_GET["id"])) {

                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "ID is required"
                ]);

                exit;
            }

            $controller->getById($_GET["id"]);
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
