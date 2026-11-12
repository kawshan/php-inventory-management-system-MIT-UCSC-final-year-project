<?php
require_once "../config/database.php";

class AssetStatusMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllAssetStatus() {
        $sql = "SELECT * FROM asset_status";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


}
