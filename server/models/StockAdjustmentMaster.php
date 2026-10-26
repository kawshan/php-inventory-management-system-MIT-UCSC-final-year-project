<?php

require_once "../config/database.php";

class StockAdjustmentMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function findAll() {
        $sql = "select
    sam.id as stock_adjustment_id,
    sam.stock_adjustment_master_code,
    sam.stock_adjustment_master_date,
    sam.stock_adjustment_master_added_datetime,
    sam.stock_adjustment_master_modify_datetime,
    sam.stock_adjustment_master_delete_datetime,
    sam.stock_adjustment_master_added_user,
    sam.stock_adjustment_master_modify_user,
    sam.stock_adjustment_master_delete_user,
    sam.location_master_id,
    sam.stock_adjustment_master_status,

    samhim.id as stock_adjustment_has_item_id,
    samhim.stock_adjustment_master_id,
    samhim.item_master_id,
    samhim.stock_adjustment_master_has_item_master_quantity,
    samhim.stock_adjustment_master_has_item_master_rate,
    samhim.stock_adjustment_master_has_item_master_description,

    im.id as item_master_id,
    im.item_master_short_name,

    lm.id as location_master_id,
    lm.location_master_name


from
stock_adjustment_master as sam
left join stock_adjustment_master_has_item_master samhim on sam.id = samhim.stock_adjustment_master_id

left join item_master as im
on samhim.item_master_id = im.id

left join location_master as lm
on sam.location_master_id = lm.id

where sam.stock_adjustment_master_status=1 order by sam.id desc";

        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        $adjustments = [];

        foreach ($rows as $row) {
            $adjustmentId = $row["stock_adjustment_id"];
            if (!isset($adjustments[$adjustmentId])) {
                $adjustments[$adjustmentId] = [
                    "stock_adjustment_id" => $row["stock_adjustment_id"],
                    "stock_adjustment_master_code" => $row["stock_adjustment_master_code"],
                    "stock_adjustment_master_date" => $row["stock_adjustment_master_date"],
                    "stock_adjustment_master_added_datetime" => $row["stock_adjustment_master_added_datetime"],
                    "stock_adjustment_master_modify_datetime" => $row["stock_adjustment_master_modify_datetime"],
                    "stock_adjustment_master_delete_datetime" => $row["stock_adjustment_master_delete_datetime"],
                    "stock_adjustment_master_added_user" => $row["stock_adjustment_master_added_user"],
                    "stock_adjustment_master_modify_user" => $row["stock_adjustment_master_modify_user"],
                    "stock_adjustment_master_delete_user" => $row["stock_adjustment_master_delete_user"],
                    "location_master_id" => $row["location_master_id"],
                    "stock_adjustment_master_status" => $row["stock_adjustment_master_status"],

                    "items" => [],
                    "item_master" => [],
                    "location_master" => []

                ];
            }


            if ($row["stock_adjustment_has_item_id"] !== null) {
                $adjustments[$adjustmentId]["items"][] = [
                    "stock_adjustment_has_item_id" => $row["stock_adjustment_has_item_id"],
                    "stock_adjustment_master_id" => $row["stock_adjustment_master_id"],
                    "item_master_id" => $row["item_master_id"],
                    "stock_adjustment_master_has_item_master_quantity" => $row["stock_adjustment_master_has_item_master_quantity"],
                    "stock_adjustment_master_has_item_master_rate" => $row["stock_adjustment_master_has_item_master_rate"],
                    "stock_adjustment_master_has_item_master_description" => $row["stock_adjustment_master_has_item_master_description"],
                    "item_master_short_name" => $row["item_master_short_name"],

                ];
            }

            $adjustments[$adjustmentId]["item_master"][] = [
                "item_master_id" => $row["item_master_id"],
                "item_master_short_name" => $row["item_master_short_name"],
            ];

            $adjustments[$adjustmentId]["location_master"] = [
                "location_master_id" => $row["location_master_id"],
                "location_master_name" => $row["location_master_name"],
            ];
        }
        return array_values($adjustments);
    }


    public function create($data) {
        try {
            $this->connection->beginTransaction();

            $getNextCodeSql = "select concat('ADJ',lpad(coalesce(max(substring(stock_adjustment_master_code,4))+1,1),4,'0')) AS adjustment_code from stock_adjustment_master";
            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
            $getNextCodeResult->execute();
            $adjustmentCode = $getNextCodeResult->fetchColumn();

            $sql = "insert into stock_adjustment_master(
                    stock_adjustment_master_code,
                    stock_adjustment_master_date,
                    stock_adjustment_master_added_datetime,
                    stock_adjustment_master_modify_datetime,
                    stock_adjustment_master_delete_datetime,
                    stock_adjustment_master_added_user,
                    stock_adjustment_master_modify_user,
                    stock_adjustment_master_delete_user,
                    location_master_id,
                    stock_adjustment_master_status)
values(
       :adjustment_code,
       :adjustment_date,
       :added_datetime,
       :modify_datetime,
       :delete_datetime,
       :added_user,
       :modify_user,
       :delete_user,
       :location_master_id,
       :status)";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "adjustment_code" => $adjustmentCode,
                "adjustment_date" => $data["stock_adjustment_master_date"] ?? null,
                "added_datetime" => date("Y-m-d H:i:s"),
                "modify_datetime" => $data["stock_adjustment_master_modify_datetime"] ?? null,
                "delete_datetime" => $data["stock_adjustment_master_delete_datetime"] ?? null,
                "added_user" => $data["stock_adjustment_added_user"] ?? null,
                "modify_user" => $data["stock_adjustment_master_modify_user"] ?? null,
                "delete_user" => $data["stock_adjustment_master_delete_user"] ?? null,
                "location_master_id" => $data["location_master_id"] ?? null,
                "status" => $data["stock_adjustment_master_status"] ?? null,
            ]);

            $adjustmentId = $this->connection->lastInsertId();
            $sql = "insert into stock_adjustment_master_has_item_master(
                    stock_adjustment_master_id,
                    item_master_id,
                    stock_adjustment_master_has_item_master_quantity,
                    stock_adjustment_master_has_item_master_rate,
                    stock_adjustment_master_has_item_master_description)values 
(
 :adjustment_id,
 :item_master_id,
 :stock_adjustment_master_has_item_master_quantity,
 :stock_adjustment_master_has_item_master_rate,
 :stock_adjustment_master_has_item_master_description
)";
            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    "adjustment_id" => $adjustmentId,
                    "item_master_id" => $item["item_master_id"] ?? null,
                    "stock_adjustment_master_has_item_master_quantity" => $item["stock_adjustment_master_has_item_master_quantity"] ?? null,
                    "stock_adjustment_master_has_item_master_rate" => $item["stock_adjustment_master_has_item_master_rate"] ?? null,
                    "stock_adjustment_master_has_item_master_description" => $item["stock_adjustment_master_has_item_master_description"] ?? null,
                ]);
            }
            $this->connection->commit();
            return $adjustmentId;
        } catch (Throwable $error) {
            $this->connection->rollBack();
            throw $error;
        }
    }


    public function update($id,$data) {
        try {
            $this->connection->beginTransaction();
            $sql = "update stock_adjustment_master set
            stock_adjustment_master_code = :adjustment_code,
            stock_adjustment_master_date = :adjustment_date,
            stock_adjustment_master_added_datetime = :added_datetime,
            stock_adjustment_master_modify_datetime = :modify_datetime,
            stock_adjustment_master_delete_datetime = :delete_datetime,
            stock_adjustment_master_added_user = :added_user,
            stock_adjustment_master_modify_user = :modify_user,
            stock_adjustment_master_delete_user = :delete_user,
            location_master_id = :location_master_id,
            stock_adjustment_master_status = :stock_adjustment_master_status where id = :id";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "adjustment_code" => $data["stock_adjustment_master_code"],
                "adjustment_date" => $data["stock_adjustment_master_date"] ?? null,
                "added_datetime" => $data["stock_adjustment_master_added_datetime"] ?? null,
                "modify_datetime" => date("Y-m-d H:i:s"),
                "delete_datetime" => $data["stock_adjustment_master_delete_datetime"] ?? null,
                "added_user" => $data["stock_adjustment_master_added_user"] ?? null,
                "modify_user" => $data["stock_adjustment_master_modify_user"] ?? null,
                "delete_user" => $data["stock_adjustment_master_delete_user"] ?? null,
                "location_master_id" => $data["location_master_id"] ?? null,
                "stock_adjustment_master_status" => $data["stock_adjustment_master_status"] ?? null,
                "id" => $id
            ]);

//            delete existing stock adjustment has items
            $sql = "delete from stock_adjustment_master_has_item_master where stock_adjustment_master_id = :stock_adjustment_master_id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "stock_adjustment_master_id" => $id,
            ]);

//            insert updated invoice items
            $sql = "insert into stock_adjustment_master_has_item_master
    (stock_adjustment_master_id,
     item_master_id,
     stock_adjustment_master_has_item_master_quantity,
     stock_adjustment_master_has_item_master_rate,
     stock_adjustment_master_has_item_master_description)
values(:stock_adjustment_master_id,
       :item_master_id,
       :stock_adjustment_master_has_item_master_quantity,
       :stock_adjustment_master_has_item_master_rate,
       :stock_adjustment_master_has_item_master_description)";

            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    "stock_adjustment_master_id" => $id,
                    "item_master_id" => $item["item_master_id"] ?? null,
                    "stock_adjustment_master_has_item_master_quantity"=>$item["stock_adjustment_master_has_item_master_quantity"] ?? null,
                    "stock_adjustment_master_has_item_master_rate"=>$item["stock_adjustment_master_has_item_master_rate"] ?? null,
                    "stock_adjustment_master_has_item_master_description" => $item["stock_adjustment_master_has_item_master_description"] ?? null,
                ]);
            }
            $this->connection->commit();
            return $id;
        }catch (Throwable $error) {
            $this->connection->rollBack();
            throw $error;
        }
    }



    public function delete($id,$data) {
        try {
            $sql = "update stock_adjustment_master set
                    stock_adjustment_master_delete_datetime = :delete_datetime,
                    stock_adjustment_master_delete_user = :delete_user,
                    stock_adjustment_master_status = :status
                    where id = :id
                    ";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "delete_datetime" => date("Y-m-d H:i:s"),
                "delete_user" => $data["stock_adjustment_master_delete_user"] ?? null,
                "status" => 2,
                "id" => $id
            ]);
            return $id;
        }catch (Throwable $error) {
            throw $error;
        }
    }
}