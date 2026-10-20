<?php

require_once "../config/database.php";

class ProductionMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function create($data) {
        try {

            $this->connection->beginTransaction();
            $sql = "insert into production_master(
            production_master_date,
            production_master_code,
            production_master_added_user,
            production_master_modify_user,
            production_master_delete_user,
            production_master_added_date_time,
            production_master_modify_date_time,      
            production_master_delete_date_time,  
            production_master_status) 
            values(
                   :production_date,
                   :production_code,
                   :added_user,
                   :modified_user,
                   :delete_user,
                   :added_date_time,
                   :modify_date_time,
                   :delete_date_time,
                   :status)";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "production_date" => $data["production_master_date"] ?? null,
                "production_code" => $data["production_master_code"] ?? null,
                "added_user" => $data["production_master_added_user"] ?? null,
                "modified_user" => $data["production_master_modify_user"] ?? null,
                "delete_user" => $data["production_master_delete_user"] ?? null,
                "added_date_time" => $data["production_master_added_date_time"] ?? null,
                "modify_date_time" => $data["production_master_modify_date_time"] ?? null,
                "delete_date_time" => $data["production_master_delete_date_time"] ?? null,
                "status" => $data["production_master_status"] ?? null
            ]);
            $productionMasterId = $this->connection->lastInsertId();
            $sql = "insert into production_master_has_item_master
            (production_master_id,
            item_master_id,
            production_master_has_item_quantity,
            production_master_has_item_description,
            production_master_has_item_item_name)
            values(
            :production_header_id,
            :item_master_id,
            :item_quantity,
            :item_description,
            :item_name)";

            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    ":production_header_id" => $productionMasterId,
                    ":item_master_id" => $item["item_master_id"],
                    ":item_quantity" => $item["production_master_has_item_quantity"],
                    ":item_description" => $item["production_master_has_item_description"],
                    ":item_name" => $item["production_master_has_item_item_name"]
                ]);
            }
            $this->connection->commit();
            return $productionMasterId;
        } catch (Throwable $error) {
            $this->connection->rollback();
            throw $error;
        }
    }

    public function update($id, $data) {
        try {
            $this->connection->beginTransaction();
            $sql = "update production_master set
                production_master_date = :production_date,
                production_master_code = :production_code,
                production_master_added_user = :added_user,
                production_master_modify_user = :modify_user,
                production_master_delete_user = :delete_user,
                production_master_added_date_time = :added_date_time,
                production_master_modify_date_time = :modify_date_time,
                production_master_delete_date_time = :delete_date_time,
                production_master_status = :status
                where id = :id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":production_date" => $data["production_master_date"],
                ":production_code" => $data["production_master_code"],
                ":added_user" => $data["production_master_added_user"],
                ":modify_user" => $data["production_master_modify_user"],
                ":delete_user" => $data["production_master_delete_user"],
                ":added_date_time" => $data["production_master_added_date_time"],
                ":modify_date_time" => $data["production_master_modify_date_time"],
                ":delete_date_time" => $data["production_master_delete_date_time"],
                ":status" => $data["production_master_status"],
                ":id" => $id
            ]);

            //delete existing invoice items
            $sql = "delete from production_master_has_item_master 
       where production_master_id= :production_master_id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":production_master_id" => $id
            ]);

            //insert updated invoice items
            $sql = "insert into production_master_has_item_master(
production_master_id, 
item_master_id, 
production_master_has_item_quantity,
production_master_has_item_description, 
production_master_has_item_item_name) values 
(
 :production_master_id,
 :item_master_id,
 :item_quantity,
 :item_description,
 :item_name)";

            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    ":production_master_id" => $id,
                    ":item_master_id" => $item["item_master_id"],
                    ":item_quantity" => $item["production_master_has_item_quantity"],
                    ":item_description" => $item["production_master_has_item_description"],
                    ":item_name" => $item["production_master_has_item_item_name"]
                ]);
            }
            $this->connection->commit();
            return $id;
        } catch (Throwable $error) {
            $this->connection->rollback();
            throw $error;
        }
    }


public function delete($id, $data) {
    try {
        $sql ="update production_master set
                production_master_delete_date_time = :delete_date_time,
                production_master_delete_user = :delete_user,
                production_master_status = :status
                where id = :id";

        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":delete_date_time" => date("Y-m-d H:i:s"),
            ":delete_user" => $data["production_master_delete_user"],
            ":status" => 0,
            ":id" => $id
        ]);
        return $id;
    }catch (Throwable $error) {
        throw $error;
    }

}





}

