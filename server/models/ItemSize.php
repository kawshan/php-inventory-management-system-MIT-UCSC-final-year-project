<?php

require_once "../config/database.php";

Class ItemSize {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllItemSize() {
        $sql = "SELECT * FROM item_size";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getItemSizeById($id) {
        $sql = "SELECT * FROM item_size WHERE id = :id";
        $statement = $this->connection->prepare($sql);
        $statement->execute([":id"=>$id]);
        return $statement->fetch(PDO::FETCH_ASSOC);
    }


    public function createItemSize($data) {
        $sql = "insert into item_size(item_size_name)
        values (:name)
        ";
        $statement = $this->connection->prepare($sql);
        $statement->execute([
           ":name"=>$data["item_size_name"]
        ]);
        return $this->connection->lastInsertId();
    }




public function updateItemSize($id,$data) {
        $sql="update item_size set item_size_name = :name where id = :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":name"=>$data["item_size_name"],
            ":id"=>$id
        ]);
}




public function deleteItemSize($id) {
    $sql="delete from item_size where id = :id";
    $statement = $this->connection->prepare($sql);
    return $statement->execute([
        ":id"=>$id
    ]);
}









































}