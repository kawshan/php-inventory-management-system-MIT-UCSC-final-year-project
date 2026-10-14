<?php

require_once "../config/database.php";

class LocationMaster{

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function getAllLocations() {
        $sql = "select * from location_master";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createLocation($data) {
        $sql = "insert into location_master(
                location_master_name,location_master_status) 
values (:name,:status)";

        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":name"=>$data["location_master_name"],
            ":status"=>$data["location_master_status"]
        ]);
        return $this->connection->lastInsertId();
    }


    public function updateLocation($id,$data) {
        $sql = "update location_master set
        location_master_name = :name, location_master_status = :status where id= :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":id"=>$id,
            ":name"=>$data["location_master_name"],
            ":status"=>$data["location_master_status"]
        ]);
    }


    public function deleteLocation($id) {
        $sql = "update location_master set location_master_status = 0 where id= :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":id"=>$id
        ]);
    }
}



