<?php


require_once "../config/database.php";

class StockTransferMaster {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function findAll() {
        $sql = "select

stm.id as stock_transfer_master_id,
stm.stock_transfer_master_date,
stm.stock_transfer_master_code,
stm.stock_transfer_master_added_date_time,
stm.stock_transfer_master_modify_date_time,
stm.stock_transfer_master_delete_date_time,
stm.stock_transfer_master_added_user,
stm.stock_transfer_master_modify_user,
stm.stock_transfer_master_delete_user,
stm.stock_transfer_master_status,


stmhim.id as stock_transfer_has_item_id,
stmhim.stock_transfer_master_id,
stmhim.item_master_id,
stmhim.stock_transfer_master_has_item_master_description,
stmhim.stock_transfer_master_has_item_master_quantity,
stmhim.from_location,
stmhim.to_location,

im.id as item_master_id,
im.item_master_short_name,

from_lm.id as from_location_id,
from_lm.location_master_name as from_location_name,

to_lm.id as to_location_id,
to_lm.location_master_name as to_location_name

from stock_transfer_master as stm
left join stock_transfer_master_has_item_master as stmhim
on stm.id = stmhim.stock_transfer_master_id

left join item_master as im
on stmhim.item_master_id = im.id

left join location_master as from_lm
on stmhim.from_location = from_lm.id

left join location_master as to_lm
on stmhim.to_location = to_lm.id


where stm.stock_transfer_master_status=1 order by stm.id desc";


        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        $transfers = [];

        foreach ($rows as $row) {
            $transferId = $row["stock_transfer_master_id"];
            if (!isset($transfers[$transferId])) {
                $transfers[$transferId] = [
                    "stock_transfer_master_id" => $row["stock_transfer_master_id"],
                    "stock_transfer_master_date" => $row["stock_transfer_master_date"],
                    "stock_transfer_master_code" => $row["stock_transfer_master_code"],
                    "stock_transfer_master_added_date_time" => $row["stock_transfer_master_added_date_time"],
                    "stock_transfer_master_modify_date_time" => $row["stock_transfer_master_modify_date_time"],
                    "stock_transfer_master_delete_date_time" => $row["stock_transfer_master_delete_date_time"],
                    "stock_transfer_master_added_user" => $row["stock_transfer_master_added_user"],
                    "stock_transfer_master_modify_user" => $row["stock_transfer_master_modify_user"],
                    "stock_transfer_master_delete_user" => $row["stock_transfer_master_delete_user"],
                    "stock_transfer_master_status" => $row["stock_transfer_master_status"],

                    "items" => [],
                    "item_master" => [],
                    "location" => []


                ];
            }

            if ($row["stock_transfer_has_item_id"] !== null) {
                $transfers[$transferId]["items"][] = [
                    "stock_transfer_has_item_id" => $row["stock_transfer_has_item_id"],
                    "stock_transfer_master_id" => $row["stock_transfer_master_id"],
                    "item_master_id" => $row["item_master_id"],
                    "item_master_short_name" => $row["item_master_short_name"],
                    "stock_transfer_master_has_item_master_description" => $row["stock_transfer_master_has_item_master_description"],
                    "stock_transfer_master_has_item_master_quantity" => $row["stock_transfer_master_has_item_master_quantity"],
                    "from_location" => $row["from_location"],
                    "to_location" => $row["to_location"],
                ];
            }


            $transfers[$transferId]["item_master"] = [
                "item_master_id" => $row["item_master_id"],
                "item_master_short_name" => $row["item_master_short_name"],
            ];

            $transfers[$transferId]["location"] = [
                "from_location_id" => $row["from_location_id"],
                "from_location_name" => $row["from_location_name"],
                "to_location_id" => $row["to_location_id"],
                "to_location_name" => $row["to_location_name"],
            ];

        }
        return array_values($transfers);

    }


    public function create($data) {
        try {

            $this->connection->beginTransaction();

            $getNextCodeSql = "select concat('TRAN',lpad(coalesce(max(substring(stock_transfer_master_code,5))+1,1),4,'0')) AS transfer_code from stock_transfer_master";
            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
            $getNextCodeResult->execute();
            $autoGenerateCode = $getNextCodeResult->fetchColumn();


            $sql = "insert into stock_transfer_master (
stock_transfer_master_code,
stock_transfer_master_date,
stock_transfer_master_added_date_time,
stock_transfer_master_modify_date_time,
stock_transfer_master_delete_date_time,
stock_transfer_master_added_user,
stock_transfer_master_modify_user,
stock_transfer_master_delete_user,
stock_transfer_master_status
)
values (
:stock_transfer_master_code,
:stock_transfer_master_date,
:stock_transfer_master_added_date_time,
:stock_transfer_master_modify_date_time,
:stock_transfer_master_delete_date_time,
:stock_transfer_master_added_user,
:stock_transfer_master_modify_user,
:stock_transfer_master_delete_user,
:stock_transfer_master_status
)";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "stock_transfer_master_code" => $autoGenerateCode,
                "stock_transfer_master_date" => $data["stock_transfer_master_date"] ?? null,
                "stock_transfer_master_added_date_time" => date("Y-m-d H:i:s"),
                "stock_transfer_master_modify_date_time" => $data["stock_transfer_master_modify_date_time"] ?? null,
                "stock_transfer_master_delete_date_time" => $data["stock_transfer_master_delete_date_time"] ?? null,
                "stock_transfer_master_added_user" => $data["stock_transfer_master_added_user"] ?? null,
                "stock_transfer_master_modify_user" => $data["stock_transfer_master_modify_user"] ?? null,
                "stock_transfer_master_delete_user" => $data["stock_transfer_master_delete_user"] ?? null,
                "stock_transfer_master_status" => $data["stock_transfer_master_status"] ?? null,
            ]);


            $transferId = $this->connection->lastInsertId();
            $sql = "insert into stock_transfer_master_has_item_master(
stock_transfer_master_id,
item_master_id,
stock_transfer_master_has_item_master_description,
stock_transfer_master_has_item_master_quantity,
from_location,
to_location                                     
)values (
:stock_transfer_master_id,
:item_master_id,
:stock_transfer_master_has_item_master_description,
:stock_transfer_master_has_item_master_quantity,
:from_location,
:to_location
)";
            $satement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $satement->execute([
                    "stock_transfer_master_id" => $transferId,
                    "item_master_id" => $item["item_master_id"] ?? null,
                    "stock_transfer_master_has_item_master_description" => $item["stock_transfer_master_has_item_master_description"] ?? null,
                    "stock_transfer_master_has_item_master_quantity" => $item["stock_transfer_master_has_item_master_quantity"] ?? null,
                    "from_location" => $item["from_location"] ?? null,
                    "to_location" => $item["to_location"] ?? null,
                ]);
            }
            $this->connection->commit();
            return $transferId;
        } catch (Throwable $error) {
            $this->connection->rollBack();
            throw $error;
        }
    }


    public function update($id, $data) {
        try {
            $this->connection->beginTransaction();
            $sql = "update stock_transfer_master set
            stock_transfer_master_code = :stock_transfer_master_code,
stock_transfer_master_date = :stock_transfer_master_date,
stock_transfer_master_added_date_time = :stock_transfer_master_added_date_time,
stock_transfer_master_modify_date_time = :stock_transfer_master_modify_date_time,
stock_transfer_master_delete_date_time = :stock_transfer_master_delete_date_time,
stock_transfer_master_added_user = :stock_transfer_master_added_user,
stock_transfer_master_modify_user = :stock_transfer_master_modify_user,
stock_transfer_master_delete_user = :stock_transfer_master_delete_user,
stock_transfer_master_status = :stock_transfer_master_status
where id = :id";

            $satement = $this->connection->prepare($sql);
            $satement->execute([
                "stock_transfer_master_code" => $data["stock_transfer_master_code"] ?? null,
                "stock_transfer_master_date" => $data["stock_transfer_master_date"] ?? null,
                "stock_transfer_master_added_date_time" => $data["stock_transfer_master_added_date_time"] ?? null,
                "stock_transfer_master_modify_date_time" => date("Y-m-d H:i:s"),
                "stock_transfer_master_delete_date_time" => $data["stock_transfer_master_delete_date_time"] ?? null,
                "stock_transfer_master_added_user" => $data["stock_transfer_master_added_user"] ?? null,
                "stock_transfer_master_modify_user" => $data["stock_transfer_master_modify_user"] ?? null,
                "stock_transfer_master_delete_user" => $data["stock_transfer_master_delete_user"] ?? null,
                "stock_transfer_master_status" => $data["stock_transfer_master_status"] ?? null,
                "id" => $id
            ]);

//            delete from details table
            $sql = "delete from stock_transfer_master_has_item_master where stock_transfer_master_id = :stock_transfer_master_id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "stock_transfer_master_id" => $id,
            ]);

//            inset updated details table
            $sql = "insert into stock_transfer_master_has_item_master(
stock_transfer_master_id,
item_master_id,
stock_transfer_master_has_item_master_description,
stock_transfer_master_has_item_master_quantity,
from_location,
to_location                                                  
)values (
:stock_transfer_master_id,
:item_master_id,
:stock_transfer_master_has_item_master_description,
:stock_transfer_master_has_item_master_quantity,
:from_location,
:to_location)";

            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    "stock_transfer_master_id" => $id,
                    "item_master_id" => $item["item_master_id"] ?? null,
                    "stock_transfer_master_has_item_master_description" => $item["stock_transfer_master_has_item_master_description"] ?? null,
                    "stock_transfer_master_has_item_master_quantity" => $item["stock_transfer_master_has_item_master_quantity"] ?? null,
                    "from_location" => $item["from_location"] ?? null,
                    "to_location" => $item["to_location"] ?? null,
                ]);
            }

            $this->connection->commit();
            return $id;


        } catch (Throwable $error) {
            $this->connection->rollBack();
            throw $error;
        }
    }


    public function delete($id, $data) {
        try {
            $sql = "update stock_transfer_master set
            stock_transfer_master_delete_date_time = :stock_transfer_master_delete_date_time,
            stock_transfer_master_delete_user = :stock_transfer_master_delete_user,
            stock_transfer_master_status = :stock_transfer_master_status
            where id = :id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "stock_transfer_master_delete_date_time" => date("Y-m-d H:i:s"),
                "stock_transfer_master_delete_user" => $data["stock_transfer_master_delete_user"] ?? null,
                "stock_transfer_master_status" =>  0,
                "id" => $id
            ]);
            return $id;
        } catch (Throwable $error) {
            throw $error;
        }
    }


}
