<?php
require_once "../config/database.php";

class RawMaterialMaster {


    private $connection;


    public function __construct($connection) {
        $this->connection = $connection;
    }


public function findAllRawMaterial() {
        $sql = "select

rm.id as raw_material_id,
rm.code,
rm.name as raw_material_name,
rm.packing,
rm.rate,
rm.re_order_level,
rm.status,
rm.description,
rm.added_date_time,
rm.modify_date_time,
rm.delete_date_time,
rm.added_user,
rm.modify_user,
rm.delete_user,


rmc.id as raw_material_category,
rmc.name as raw_material_category_name


from raw_material_master as rm
left join raw_material_category rmc on rm.raw_material_category_id = rmc.id order by rm.id";

        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


public function createRawMaterial($data) {


    $checkExisting = "SELECT 1 FROM raw_material_master WHERE name = :name";

    $statement = $this->connection->prepare($checkExisting);
    $statement->execute([
        ":name" => $data["name"]
    ]);

    if ($statement->fetch()) {
        return null;
    }




        $sql = "insert into raw_material_master(
code,
name,
packing,
rate,
re_order_level,
status,
description,
raw_material_category_id,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user)values 
(
:code,
:name,
:packing,
:rate,
:re_order_level,
:status,
:description,
:raw_material_category_id,
:added_date_time,
:modify_date_time,
:delete_date_time ,
:added_user,
:modify_user,
:delete_user)                
";
        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":code" => $data["code"] ?? null,
            ":name" => $data["name"] ?? null,
            ":packing" => $data["packing"] ?? null,
            ":rate" => $data["rate"] ?? null,
            ":re_order_level" => $data["re_order_level"] ?? null,
            ":status" => $data["status"] ?? null,
            ":description" => $data["description"] ?? null,
            ":raw_material_category_id" => $data["raw_material_category_id"],
            ":added_date_time" => date("Y-m-d H:i:s"),
            ":modify_date_time" => $data["modify_date_time"] ?? null,
            ":delete_date_time" => $data["delete_date_time"] ?? null,
            ":added_user" => $data["added_user"] ?? null,
            ":modify_user" => $data["modify_user"] ?? null,
            ":delete_user" => $data["delete_user"] ?? null
        ]);
        return $this->connection->lastInsertId();

    }


public function updateRawMaterial($id,$data) {
    $sql = "update raw_material_master set
code = :code,
name = :name,
packing = :packing,
rate = :rate,
re_order_level = :re_order_level,
status = :status,
description = :description,
raw_material_category_id = :raw_material_category_id,
added_date_time = :added_date_time,
modify_date_time = :modify_date_time,
delete_date_time  = :delete_date_time,
added_user = :added_user,
modify_user = :modify_user,
delete_user = :delete_user where id = :id";

    $statement = $this->connection->prepare($sql);
    return $statement->execute([
        ":id" => $id,
        ":code" => $data["code"] ?? null,
        ":name" => $data["name"] ?? null,
        ":packing" => $data["packing"] ?? null,
        ":rate" => $data["rate"] ?? null,
        ":re_order_level" => $data["re_order_level"] ?? null,
        ":status" => $data["status"] ?? null,
        ":description" => $data["description"] ?? null,
        ":raw_material_category_id" => $data["raw_material_category_id"] ?? null,
        ":added_date_time" => $data["added_date_time"] ?? null,
        ":modify_date_time" => date("Y-m-d H:i:s"),
        ":delete_date_time" => $data["delete_date_time"] ?? null,
        ":added_user" => $data["added_user"] ?? null,
        ":modify_user" => $data["modify_user"] ?? null,
        ":delete_user" => $data["delete_user"] ?? null
    ]);
}


public function deleteRawMaterial($id,$data) {

        $sql = "update raw_material_master set
        status = 0,
        delete_date_time = :delete_date_time,
        delete_user = :delete_user
        where id = :id";

        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":id" => $id,
            ":delete_date_time" => date("Y-m-d H:i:s"),
            ":delete_user" => $data["delete_user"] ?? null,
        ]);


}




}




