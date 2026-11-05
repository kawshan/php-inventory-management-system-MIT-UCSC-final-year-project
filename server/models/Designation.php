<?php
require_once "../config/database.php";

class Designation {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllDesignations() {
        $sql = "SELECT * FROM designation";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


}
