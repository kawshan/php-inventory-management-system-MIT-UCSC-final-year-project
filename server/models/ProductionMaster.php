<?php

require_once "../config/database.php";

class ProductionMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function findAll() {
        $sql = "
        
        select

    pm.id as production_master_id,
    pm.production_master_date,
    pm.production_master_code,
    pm.production_master_added_user,
    pm.production_master_modify_user,
    pm.production_master_delete_user,
    pm.production_master_added_date_time,
    pm.production_master_modify_date_time,
    pm.production_master_delete_date_time,
    pm.production_master_status,


    pmi.id as production_item_id,
    pmi.item_master_id,
    pmi.production_master_has_item_quantity,
    pmi.production_master_has_item_description,

    im.id as item_master_id,
    im.item_master_name,
    im.item_master_price,
    im.item_master_cost,
    im.item_master_barcode,
    im.item_master_key,
    im.item_master_code,
    im.item_master_short_name,
    im.item_master_description,
    im.item_master_no_of_pages,
    im.item_master_books_in_pack,
    im.item_master_books_in_box,
    im.item_category_master_id,
    im.item_size_id,

    icm.id as item_category_id,
    icm.item_category_master_name,
    icm.item_category_master_code,
    icm.item_category_master_added_date,
    icm.item_category_master_modify_date,
    icm.item_category_master_delete_date,
    icm.item_category_master_status


from production_master as pm

left join production_master_has_item_master pmi
on pm.id = pmi.production_master_id

left join item_master im
on pmi.item_master_id = im.id

left join item_category_master icm
on im.item_category_master_id = icm.id

where pm.production_master_status=1
order by pm.id desc;
        
        
        ";

        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        $productions = [];

// Have I already created this production? If not, create it. Regardless, add this row's item to that production.

        foreach ($rows as $row) {
            $productionId = $row['production_master_id'];
            if (!isset($productions[$productionId])) {
                $productions[$productionId] = [
                    "production_master_id" => $row['production_master_id'],
                    "production_master_date" => $row['production_master_date'],
                    "production_master_code" => $row['production_master_code'],
                    "production_master_added_user" => $row['production_master_added_user'],
                    "production_master_modify_user" => $row['production_master_modify_user'],
                    "production_master_delete_user" => $row['production_master_delete_user'],
                    "production_master_added_date_time" => $row['production_master_added_date_time'],
                    "production_master_modify_date_time" => $row['production_master_modify_date_time'],
                    "production_master_delete_date_time" => $row['production_master_delete_date_time'],
                    "production_master_status" => $row['production_master_status'],

                    "items" => [],
                    "item_masters"=>[]
                ];
            }

            if ($row["production_item_id"] !== null) {
                $productions[$productionId]["items"][] = [
                    "production_item_id" => $row["production_item_id"],
                    "item_master_id" => $row["item_master_id"],
                    "production_master_has_item_quantity" => $row["production_master_has_item_quantity"],
                    "production_master_has_item_description" => $row["production_master_has_item_description"],
                    "production_master_has_item_item_name" => $row["item_master_name"],
                ];
            }


            $productions[$productionId]["item_masters"][]=[
                "item_master_id" => $row["item_master_id"],
                "item_master_name" => $row["item_master_name"],
                "item_master_price" => $row["item_master_price"],
                "item_master_cost" => $row["item_master_cost"],
                "item_master_barcode" => $row["item_master_barcode"],
                "item_master_key" => $row["item_master_key"],
                "item_master_code" => $row["item_master_code"],
                "item_master_short_name" => $row["item_master_short_name"],
                "item_master_description" => $row["item_master_description"],
                "item_master_no_of_pages" => $row["item_master_no_of_pages"],
                "item_master_books_in_pack" => $row["item_master_books_in_pack"],
                "item_master_books_in_box" => $row["item_master_books_in_box"],
                "item_category_master_id" => $row["item_category_master_id"],
                "item_size_id" => $row["item_size_id"]
            ];




        }

        return array_values($productions);

    }


    public function create($data) {
        try {

            $this->connection->beginTransaction();

            $getNextCodeSql = "select concat('PRO',lpad(coalesce(max(substring(production_master_code,4))+1,1),4,'0')) AS production_code from production_master";
            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
            $getNextCodeResult->execute();
            $productionCode = $getNextCodeResult->fetchColumn();

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
                "production_code" => $productionCode,
                "added_user" => $data["production_master_added_user"] ?? null,
                "modified_user" => $data["production_master_modify_user"] ?? null,
                "delete_user" => $data["production_master_delete_user"] ?? null,
                "added_date_time" => date("Y-m-d H:i:s"),
                "modify_date_time" => $data["production_master_modify_date_time"] ?? null,
                "delete_date_time" => $data["production_master_delete_date_time"] ?? null,
                "status" => $data["production_master_status"] ?? null
            ]);
            $productionMasterId = $this->connection->lastInsertId();
            $sql = "insert into production_master_has_item_master
            (production_master_id,
            item_master_id,
            production_master_has_item_quantity,
            production_master_has_item_description
            )
            values(
            :production_header_id,
            :item_master_id,
            :item_quantity,
            :item_description
            )";

            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    ":production_header_id" => $productionMasterId,
                    ":item_master_id" => $item["item_master_id"],
                    ":item_quantity" => $item["production_master_has_item_quantity"],
                    ":item_description" => $item["production_master_has_item_description"] ?? null,
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
                ":production_date" => $data["production_master_date"] ?? null,
                ":production_code" => $data["production_master_code"] ?? null,
                ":added_user" => $data["production_master_added_user"] ?? null,
                ":modify_user" => $data["production_master_modify_user"] ?? null,
                ":delete_user" => $data["production_master_delete_user"] ?? null,
                ":added_date_time" => $data["production_master_added_date_time"] ?? null,
                ":modify_date_time" => date("Y-m-d H:i:s"),
                ":delete_date_time" => $data["production_master_delete_date_time"] ?? null,
                ":status" => $data["production_master_status"] ?? null,
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
production_master_has_item_description
) values 
(
 :production_master_id,
 :item_master_id,
 :item_quantity,
 :item_description
 )";

            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    ":production_master_id" => $id,
                    ":item_master_id" => $item["item_master_id"],
                    ":item_quantity" => $item["production_master_has_item_quantity"],
                    ":item_description" => $item["production_master_has_item_description"] ?? null,
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
            $sql = "update production_master set
                production_master_delete_date_time = :delete_date_time,
                production_master_delete_user = :delete_user,
                production_master_status = :status
                where id = :id";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":delete_date_time" => date("Y-m-d H:i:s"),
                ":delete_user" => $data["production_master_delete_user"] ?? null,
                ":status" => 0,
                ":id" => $id
            ]);
            return $id;
        } catch (Throwable $error) {
            throw $error;
        }

    }


}

