<?php

namespace models;
require_once "../config/database.php";


class ItemMaster
{
    private $connection;


    public function __construct($connection)
    {
        $this->connection = $connection;
    }


    // GET ALL ITEMS
    public function getAll()
    {
        $sql = "SELECT * FROM item_master ORDER BY id DESC";

        $statement = $this->connection->prepare($sql);

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


    // GET ITEM BY ID
    public function getById($id)
    {
        $sql = "SELECT * FROM item_master WHERE id = :id";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":id" => $id
        ]);

        return $statement->fetch(PDO::FETCH_ASSOC);
    }


    // CREATE ITEM
    public function create($data)
    {
        $sql = "INSERT INTO item_master
        (
            item_master_name,
            item_master_price,
            item_master_cost,
            item_master_barcode,
            item_master_key,
            item_master_code,
            item_master_short_name,
            item_master_description,
            item_master_no_of_pages,
            item_master_books_in_pack,
            item_master_books_in_box,
            item_category_master_id,
            item_master_status_id,
            item_size_id
        )
        VALUES
        (
            :name,
            :price,
            :cost,
            :barcode,
            :item_key,
            :code,
            :short_name,
            :description,
            :no_of_pages,
            :books_in_pack,
            :books_in_box,
            :category_id,
            :status_id,
            :size_id
        )";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":name" => $data["item_master_name"],
            ":price" => $data["item_master_price"],
            ":cost" => $data["item_master_cost"],
            ":barcode" => $data["item_master_barcode"],
            ":item_key" => $data["item_master_key"],
            ":code" => $data["item_master_code"],
            ":short_name" => $data["item_master_short_name"],
            ":description" => $data["item_master_description"],
            ":no_of_pages" => $data["item_master_no_of_pages"],
            ":books_in_pack" => $data["item_master_books_in_pack"],
            ":books_in_box" => $data["item_master_books_in_box"],
            ":category_id" => $data["item_category_master_id"],
            ":status_id" => $data["item_master_status_id"],
            ":size_id" => $data["item_size_id"]
        ]);

        return $this->connection->lastInsertId();
    }


    // UPDATE ITEM
    public function update($id, $data)
    {
        $sql = "UPDATE item_master SET

            item_master_name = :name,
            item_master_price = :price,
            item_master_cost = :cost,
            item_master_barcode = :barcode,
            item_master_key = :item_key,
            item_master_code = :code,
            item_master_short_name = :short_name,
            item_master_description = :description,
            item_master_no_of_pages = :no_of_pages,
            item_master_books_in_pack = :books_in_pack,
            item_master_books_in_box = :books_in_box,
            item_category_master_id = :category_id,
            item_master_status_id = :status_id,
            item_size_id = :size_id

            WHERE id = :id";


        $statement = $this->connection->prepare($sql);

        return $statement->execute([
            ":id" => $id,
            ":name" => $data["item_master_name"],
            ":price" => $data["item_master_price"],
            ":cost" => $data["item_master_cost"],
            ":barcode" => $data["item_master_barcode"],
            ":item_key" => $data["item_master_key"],
            ":code" => $data["item_master_code"],
            ":short_name" => $data["item_master_short_name"],
            ":description" => $data["item_master_description"],
            ":no_of_pages" => $data["item_master_no_of_pages"],
            ":books_in_pack" => $data["item_master_books_in_pack"],
            ":books_in_box" => $data["item_master_books_in_box"],
            ":category_id" => $data["item_category_master_id"],
            ":status_id" => $data["item_master_status_id"],
            ":size_id" => $data["item_size_id"]
        ]);
    }


    // DELETE ITEM
    public function delete($id)
    {
        $sql = "DELETE FROM item_master WHERE id = :id";

        $statement = $this->connection->prepare($sql);

        return $statement->execute([
            ":id" => $id
        ]);
    }
}

?>