<?php

require_once "../config/database.php";

class OurPoMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function getAllOurPoMaster() {
        $sql = "select

header.id,
header.code,
header.reference_quotation,
header.status,
header.added_date_time,
header.modify_date_time,
header.delete_date_time,
header.added_user,
header.modify_user,
header.delete_user,

details.id as purchase_order_details_id,
details.raw_material_master_id,
details.quantity,
details.rate,
details.description,

rm.name


from our_purchase_order as header
left join our_purchase_order_has_raw_material_master as details on header.id = details.our_purchase_order_id
left join raw_material_master as rm on details.raw_material_master_id = rm.id where header.status = 1 order by header.id desc ";

        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        $ourPo = [];

        foreach ($rows as $row) {
            $ourPoId = $row['id'];
            if (!isset($ourPo[$ourPoId])) {
                $ourPo[$ourPoId] = [
                    "id" => $row["id"],
                    "code" => $row["code"],
                    "reference_quotation" => $row["reference_quotation"],
                    "status" => $row["status"],
                    "added_date_time" => $row["added_date_time"],
                    "modify_date_time" => $row["modify_date_time"],
                    "delete_date_time" => $row["delete_date_time"],
                    "added_user" => $row["added_user"],
                    "modify_user" => $row["modify_user"],
                    "delete_user" => $row["delete_user"],



                    "rawMaterials" => []
                ];
            }

//            add our po master raw materials
            if ($row['purchase_order_details_id'] !== null) {
                $ourPo[$ourPoId]["rawMaterials"][] = [
                    "purchase_order_details_id" => $row['purchase_order_details_id'],
                    "raw_material_master_id" => $row['raw_material_master_id'],
                    "quantity" => $row['quantity'],
                    "rate" => $row['rate'],
                    "description" => $row['description'],
                    "name" => $row['name'],

                ];

            }
        }

        return array_values($ourPo);
    }


    public function createOurPoMaster($data) {
        try {
            $this->connection->beginTransaction();

            //            getting auto generated code part
            $getNextCodeSql = "SELECT CONCAT('OPO',LPAD(COALESCE(MAX(SUBSTRING(code, 4)) + 1, 1),4,'0')) AS our_po_code FROM our_purchase_order";
            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
            $getNextCodeResult->execute();
            $ourPoCode = $getNextCodeResult->fetchColumn();

            $sql = "
            insert into our_purchase_order(
code,
date,
reference_quotation,
status,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user)
            values(
                   :code,
                   :date,
                   :reference_quotation,
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
                ":code" => $ourPoCode,
                ":date" => $data["date"] ?? null,
                ":reference_quotation" => $data["reference_quotation"] ?? null,
                ":status" => $data["status"] ?? null,
                ":added_date_time" => date("Y-m-d H:i:s"),
                ":modify_date_time" => $data["modify_date_time"] ?? null,
                ":delete_date_time" => $data["delete_date_time"] ?? null,
                ":added_user" => $data["added_user"] ?? null,
                ":modify_user" => $data["modify_user"] ?? null,
                ":delete_user" => $data["delete_user"] ?? null,
            ]);

            $lastOurPo = $this->connection->lastInsertId();
//            add into our purchase order details
            $sql = "insert into our_purchase_order_has_raw_material_master(
our_purchase_order_id,
raw_material_master_id,                                                       
quantity,                                  
rate,                                                       
description                                              
)values (
:our_purchase_order_id,
:raw_material_master_id,        
:quantity,        
:rate,        
:description
)";
            $satement = $this->connection->prepare($sql);
            foreach ($data["rawMaterials"] as $rawMaterial) {
                $satement->execute([
                    ":our_purchase_order_id" => $lastOurPo,
                    ":raw_material_master_id" => $rawMaterial["raw_material_master_id"],
                    ":quantity" => $rawMaterial["quantity"],
                    ":rate" => $rawMaterial["rate"],
                    ":description" => $rawMaterial["description"]
                ]);
            }

            $this->connection->commit();
            return $lastOurPo;
        } catch (Throwable $th) {
            $this->connection->rollBack();
            throw $th;
        }
    }


    public function updateOurPoMaster($id, $data) {
        try {
            $this->connection->beginTransaction();
            $sql = "update our_purchase_order set
            code = :code,
            date = :date,
            reference_quotation = :reference_quotation,
            status = :status,
            modify_date_time = :modify_date_time,
            modify_user = :modify_user
            where id = :id";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":id" => $id,
                ":code" => $data["code"] ?? null,
                ":date" => $data["date"] ?? null,
                ":reference_quotation" => $data["reference_quotation"] ?? null,
                ":status" => $data["status"] ?? null,
                ":modify_date_time" => date("Y-m-d H:i:s"),
                ":modify_user" => $data["modify_user"] ?? null,
            ]);
//details delete
            $sql = "delete from our_purchase_order_has_raw_material_master where our_purchase_order_id = :our_purchase_order_id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":our_purchase_order_id" => $id,
            ]);


            $sql = "insert into our_purchase_order_has_raw_material_master(
our_purchase_order_id,
raw_material_master_id,
quantity,
rate,
description                                                   
)values (
         :our_purchase_order_id,
         :raw_material_master_id,
         :quantity,
         :rate,
         :description
)";

            $statement = $this->connection->prepare($sql);
//            add into details
            $statement = $this->connection->prepare($sql);
            foreach ($data["rawMaterials"] as $rawMaterial) {
                $statement->execute([
                    ":our_purchase_order_id" => $id,
                    ":raw_material_master_id" => $rawMaterial["raw_material_master_id"],
                    ":quantity" => $rawMaterial["quantity"],
                    ":rate" => $rawMaterial["rate"],
                    ":description" => $rawMaterial["description"],
                ]);
            }

            $this->connection->commit();
            return $id;
        } catch (Throwable $th) {
            $this->connection->rollBack();
            throw $th;
        }
    }


    public function deleteOurPoMaster($id,$data) {
        try {
            $sql = "update our_purchase_order set status = :status, delete_date_time = :delete_date_time, delete_user = :delete_user where id = :id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":id" => $id,
                ":status" => 0,
                ":delete_date_time" => date("Y-m-d H:i:s"),
                ":delete_user" => $data["delete_user"] ?? null,
            ]);
            return $id;
        }catch (Throwable $th) {
            throw $th;
        }
    }


}



