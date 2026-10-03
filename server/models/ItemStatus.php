<?php

require_once "../config/database.php";

class ItemStatus {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllItemStatus() {
        $sql = "SELECT * FROM item_master_status";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


}
