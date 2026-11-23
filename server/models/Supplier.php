<?php
require_once "../config/database.php";

class Supplier {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllSupplier() {
        $sql = "SELECT * FROM supplier";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


}
