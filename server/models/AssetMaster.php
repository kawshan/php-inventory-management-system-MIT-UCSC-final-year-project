<?php

require_once "../config/database.php";

class AssetMaster {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function getAll() {
        $sql = "
        select
am.id,
am.code,
am.name,
am.description,
am.serial_number,
am.brand,
am.model,
am.purchase_date,
am.purchase_price,
am.warranty_expire_date,
am.added_date_time,
am.modify_date_time,
am.delete_date_time,
am.added_user,
am.modify_user,
am.delete_user,

acm.id as asset_category_idm,
acm.name as asset_category_name,

ass.id as asset_status_id,
ass.name as asset_status_name

from asset_master as am
left join assert_category_master acm on am.assert_category_master_id = acm.id
left join asset_status as ass on am.asset_status_id = ass.id order by am.id desc";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $sql = "select * from asset_master where id=:id";
        $statement = $this->connection->prepare($sql);
        $statement->execute([":id" => $id]);
        return $statement->fetch(PDO::FETCH_ASSOC);
    }


    public function create($data) {

        $existing = "SELECT 1 FROM asset_master WHERE name=:name";

        $statement = $this->connection->prepare($existing);
        $statement->execute([
            ":name" => $data["name"]
        ]);

        if ($statement->fetch()) {
            return null;
        }


        $sql = "insert into asset_master
    (
code,
name,
description,
serial_number,
brand,
model,
purchase_date,
purchase_price,
warranty_expire_date,
assert_category_master_id,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user,
asset_status_id
    ) 
    values(
:code,
:name,
:description,
:serial_number,
:brand,
:model,
:purchase_date,
:purchase_price,
:warranty_expire_date,
:assert_category_master_id,
:added_date_time,
:modify_date_time,
:delete_date_time,
:added_user,
:modify_user,
:delete_user,
:asset_status_id
    )";
        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":code" => $data["code"] ?? null,
            ":name" => $data["name"] ?? null,
            ":description" => $data["description"] ?? null,
            ":serial_number" => $data["serial_number"] ?? null,
            ":brand" => $data["brand"] ?? null,
            ":model" => $data["model"] ?? null,
            ":purchase_date" => $data["purchase_date"] ?? null,
            ":purchase_price" => $data["purchase_price"] ?? null,
            ":warranty_expire_date" => $data["warranty_expire_date"] ?? null,
            ":assert_category_master_id" => $data["assert_category_master_id"] ?? null,
            ":added_date_time" => date("Y-m-d H:i:s"),
            ":modify_date_time" => $data["modify_date_time"] ?? null,
            ":delete_date_time" => $data["delete_date_time"] ?? null,
            ":added_user" => $data["added_user"] ?? null,
            ":modify_user" => $data["modify_user"] ?? null,
            ":delete_user" => $data["delete_user"] ?? null,
            ":asset_status_id" => $data["asset_status_id"] ?? null,
        ]);
        return $this->connection->lastInsertId();
    }


    public function update($id, $data) {
        $sql = "update asset_master set
                         code = :code,
                         name = :name,
                         description = :description,
                         serial_number = :serial_number,
                         brand = :brand,
                         model = :model,
                         purchase_date = :purchase_date,
                         purchase_price = :purchase_price,
                         warranty_expire_date = :warranty_expire_date,
                         assert_category_master_id = :assert_category_master_id,
                         added_date_time = :added_date_time,
                         modify_date_time = :modify_date_time,
                         delete_date_time = :delete_date_time,
                         added_user = :added_user,
                         modify_user = :modify_user,
                         delete_user = :delete_user,
                         asset_status_id = :asset_status_id
                         where id = :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":code" => $data["code"] ?? null,
            ":name" => $data["name"] ?? null,
            ":description" => $data["description"] ?? null,
            ":serial_number" => $data["serial_number"] ?? null,
            ":brand" => $data["brand"] ?? null,
            ":model" => $data["model"] ?? null,
            ":purchase_date" => $data["purchase_date"] ?? null,
            ":purchase_price" => $data["purchase_price"] ?? null,
            ":warranty_expire_date" => $data["warranty_expire_date"] ?? null,
            ":assert_category_master_id" => $data["assert_category_master_id"] ?? null,
            ":added_date_time" => $data["added_date_time"] ?? null,
            ":modify_date_time" => date("Y-m-d H:i:s"),
            ":delete_date_time" => $data["delete_date_time"] ?? null,
            ":added_user" => $data["added_user"] ?? null,
            ":modify_user" => $data["modify_user"] ?? null,
            ":delete_user" => $data["delete_user"] ?? null,
            ":asset_status_id" => $data["asset_status_id"] ?? null,
            ":id" => $id
        ]);
    }

    public function delete($id, $data) {
        $sql = "update asset_master set asset_status_id = 2, delete_user = :delete_user, delete_date_time=:delete_date_time where id= :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":delete_user" => $data["delete_user"] ?? null,
            ":delete_date_time" => date("Y-m-d H:i:s"),
            ":id" => $id,

        ]);
    }


}