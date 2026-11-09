<?php
require_once "../config/database.php";

class RoleMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllRoles() {
        $sql = "SELECT * FROM role";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getAllRolesWithoutAdminAndOwner() {
        $sql = "select * from role where name not in ('admin','owner');";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }



}
