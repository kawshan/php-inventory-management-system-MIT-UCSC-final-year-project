<?php
require_once "../config/database.php";

class ModuleMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllModules() {
        $sql = "SELECT * FROM module";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }



}
