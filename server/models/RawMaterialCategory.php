<?php
require_once "../config/database.php";


class RawMaterialCategory {

    private $connection;


    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function getAll() {
        $sql = "select * from raw_material_category where status=1 order by id desc";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getById($id) {
        $sql = "select * from raw_material_category where id = :id";
        $statement = $this->connection->prepare($sql);
        $statement->execute([":id" => $id]);
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function create($data) {
        $sql = "insert into raw_material_category(
code,
name,
size,
shape,
description,
volume,
marginal_order_quantity,
packing,
status,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user                              
) values (
:code,
:name,
:size,
:shape,
:description,
:volume,
:marginal_order_quantity,
:packing,
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
            ":code" => $data["code"],
            ":name" => $data["name"],
            ":size" => $data["size"],
            ":shape" => $data["shape"],
            ":description" => $data["description"],
            ":volume" => $data["volume"],
            ":marginal_order_quantity" => $data["marginal_order_quantity"],
            ":packing" => $data["packing"],
            ":status" => $data["status"],
            ":added_date_time" => $data["added_date_time"],
            ":modify_date_time" => $data["modify_date_time"],
            ":delete_date_time" => $data["delete_date_time"],
            ":added_user" => $data["added_user"],
            ":modify_user" => $data["modify_user"],
            ":delete_user" => $data["delete_user"]
        ]);

        return $this->connection->lastInsertId();
    }


    public function update($id, $data) {
        $sql = "update raw_material_category set
code = :code,
name = :name,
size = :size,
shape = :shape,
description = :description,
volume = :volume,
marginal_order_quantity = :marginal_order_quantity,
packing = :packing,
status = :status,
added_date_time = :added_date_time,
modify_date_time = :modify_date_time,
delete_date_time = :delete_date_time,
added_user = :added_user,
modify_user = :modify_user,
delete_user  = :delete_user
where id = :id";

        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":code" => $data["code"],
            ":name" => $data["name"],
            ":size" => $data["size"],
            ":shape" => $data["shape"],
            ":description" => $data["description"],
            ":volume" => $data["volume"],
            ":marginal_order_quantity" => $data["marginal_order_quantity"],
            ":packing" => $data["packing"],
            ":status" => $data["status"],
            ":added_date_time" => $data["added_date_time"],
            ":modify_date_time" => $data["modify_date_time"],
            ":delete_date_time" => $data["delete_date_time"],
            ":added_user" => $data["added_user"],
            ":modify_user" => $data["modify_user"],
            ":delete_user" => $data["delete_user"],
            ":id" => $id
        ]);
    }



    public function delete($id) {
        $sql = "update raw_material_category set status = 0 where id= :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([":id" => $id]);
    }









}