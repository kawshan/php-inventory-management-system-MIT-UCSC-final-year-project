<?php
require_once "../config/database.php";

class AssetCategoryMaster {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function getAll() {
        $sql = "SELECT * from assert_category_master order by id desc";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getOnlyActiveCategories() {
        $sql = "SELECT * from assert_category_master where status = 1 order by id desc";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAssetCategoryById($id) {
        $sql = "select * from assert_category_master where id=:id";
        $statement = $this->connection->prepare($sql);
        $statement->execute([":id" => $id]);
        return $statement->fetch(PDO::FETCH_ASSOC);
    }


    public function create($data) {

        $existing = "SELECT 1 FROM assert_category_master WHERE name=:name";

        $statement = $this->connection->prepare($existing);
        $statement->execute([
            ":name" => $data["name"]
        ]);

        if ($statement->fetch()) {
            return null;
        }



        $sql = "insert into assert_category_master
    (
name,
description,
status,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user
    ) 
    values(
:name,
:description,
:status,
:added_date_time,
:modify_date_time,
:delete_date_time,
:added_user,
:modify_user,
:delete_user       
    )";
        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":name" => $data["name"] ?? null,
            ":description" => $data["description"] ?? null,
            ":status" => $data["status"] ?? null,
            ":added_date_time" => date("Y-m-d H:i:s"),
            ":modify_date_time" => $data["modify_date_time"] ?? null,
            ":delete_date_time" => $data["delete_date_time"] ?? null,
            ":added_user" => $data["added_user"] ?? null,
            ":modify_user" => $data["modify_user"] ?? null,
            ":delete_user" => $data["delete_user"] ?? null
        ]);
        return $this->connection->lastInsertId();
    }


    public function update($id, $data) {
        $sql = "update assert_category_master set
                         name = :name,
                         description = :description,
                         status = :status,
                         added_date_time = :added_date_time,
                         modify_date_time = :modify_date_time,
                         delete_date_time = :delete_date_time,
                         added_user = :added_user,
                         modify_user = :modify_user,
                         delete_user = :delete_user
                         where id = :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":name" => $data["name"]?? null,
            ":description" => $data["description"] ?? null,
            ":status" => $data["status"] ?? null,
            ":added_date_time" => $data["added_date_time"] ?? null,
            ":modify_date_time" => date("Y-m-d H:i:s"),
            ":delete_date_time" => $data["delete_date_time"] ?? null,
            ":added_user" => $data["added_user"] ?? null,
            ":modify_user" => $data["modify_user"] ?? null,
            ":delete_user" => $data["delete_user"] ?? null,
            ":id" => $id
        ]);
    }

    public function deleteAssetCategory($id, $data) {
        $sql = "update assert_category_master set status = 0, delete_user = :delete_user, delete_date_time=:delete_date_time where id= :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":delete_user" => $data["delete_user"] ?? null,
            ":delete_date_time" => date("Y-m-d H:i:s"),
            ":id" => $id,

        ]);
    }


}