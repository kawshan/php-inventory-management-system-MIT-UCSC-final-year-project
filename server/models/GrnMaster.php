<?php

require_once "../config/database.php";

class GrnMaster {

    private $connection;


    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function findAll() {
    $sql = "select

    gh.id,
    gh.code,
    gh.date,
    gh.our_purchase_order_id,
    gh.supplier_id,
    gh.status,
    gh.added_date_time,
    gh.modify_date_time,
    gh.delete_date_time,
    gh.added_user,
    gh.modify_user,
    gh.delete_user,

    grn_details.id as details_id,
    grn_details.grn_header_id,
    grn_details.raw_material_master_id,
    grn_details.quantity,
    grn_details.rate,
    grn_details.description,

    sup.name as supplier_name,
    sup.address,
    sup.telephone,
    sup.collecting_address,
    sup.bank,
    sup.account_no,
    sup.contact_person,

    opo.code as our_purchase_order_code,
    opo.date as our_purchase_order_date



from grn_header as gh left join grn_header_has_raw_material_master as grn_details
on gh.id = grn_details.grn_header_id

left join supplier as sup on gh.supplier_id = sup.id
left join our_purchase_order as opo on gh.our_purchase_order_id = opo.id

where gh.status=1 order by gh.id desc";

    $statement = $this->connection->prepare($sql);
    $statement->execute();

    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
    $grns = [];

    foreach ($rows as $row) {
        $grnId = $row['id'];
        if (!isset($grns[$grnId])) {
            $grns[$grnId] = [
                "id" => $row['id'],
                "code" => $row['code'],
                "date" => $row['date'],
                "our_purchase_order_id" => $row['our_purchase_order_id'],
                "supplier_id" => $row['supplier_id'],
                "status" => $row['status'],
                "added_date_time" => $row['added_date_time'],
                "modify_date_time" => $row['modify_date_time'],
                "delete_date_time" => $row['delete_date_time'],
                "added_user" => $row['added_user'],
                "modify_user" => $row['modify_user'],
                "delete_user" => $row['delete_user'],

                "supplier_details" => [
                    "supplier_name" => $row['supplier_name'],
                    "address" => $row['address'],
                    "telephone" => $row['telephone'],
                    "collecting_address" => $row['collecting_address'],
                    "bank" => $row['bank'],
                    "account_no" => $row['account_no'],
                    "contact_person" => $row['contact_person'],
                ],

                "our_purchase_order" => [
                    "our_purchase_order_code" => $row['our_purchase_order_code'],
                    "our_purchase_order_date" => $row['our_purchase_order_date'],
                ],
                "rawMaterials" => []
            ];
        }

        //add raw grn raw materials
        if ($row['details_id'] !== null) {
            $grns[$grnId]["rawMaterials"][] = [
                "details_id" => $row["details_id"],
                "grn_header_id" => $row["grn_header_id"],
                "raw_material_master_id" => $row["raw_material_master_id"],
                "quantity" => $row["quantity"],
                "rate" => $row["rate"],
                "description" => $row["description"],
            ];
        }
    }
    return array_values($grns);
}


    public function create($data) {
        try {
            $this->connection->beginTransaction();

//            getting auto generated code part
            $getNextCodeSql = "SELECT CONCAT('GRN',LPAD(COALESCE(MAX(SUBSTRING(code, 4)) + 1, 1),4,'0')) AS grn_code FROM grn_header";
            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
            $getNextCodeResult->execute();
            $grnCode = $getNextCodeResult->fetchColumn();

            $sql = "insert into grn_header(
code,
date,
our_purchase_order_id,
supplier_id,
status,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user                       
)values (
:code,
:date,
:our_purchase_order_id,
:supplier_id,
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
                ":code" => $grnCode,
                ":date" => $data["date"] ?? null,
                ":our_purchase_order_id" => $data["our_purchase_order_id"] ?? null,
                ":supplier_id" => $data["supplier_id"] ?? null,
                ":status" => $data["status"] ?? null,
                ":added_date_time" => date("Y-m-d H:i:s"),
                ":modify_date_time" => $data["modify_date_time"] ?? null,
                ":delete_date_time" => $data["delete_date_time"] ?? null,
                ":added_user" => $data["added_user"] ?? null,
                ":modify_user" => $data["modify_user"] ?? null,
                ":delete_user" => $data["delete_user"] ?? null,
            ]);

            $lastGrnId = $this->connection->lastInsertId();
            //create grn items
            $sql = "insert into grn_header_has_raw_material_master(
grn_header_id,
raw_material_master_id,
quantity,
rate,
description) values (
:grn_header_id,
:raw_material_master_id,                    
:quantity,                    
:rate,                     
:description                    
)";

            $statement = $this->connection->prepare($sql);
            foreach ($data["rawMaterials"] as $rawMaterial) {
                $statement->execute([
                    ":grn_header_id" => $lastGrnId,
                    ":raw_material_master_id" => $rawMaterial["raw_material_master_id"] ?? null,
                    ":quantity" => $rawMaterial["quantity"] ?? null,
                    ":rate" => $rawMaterial["rate"] ?? null,
                    ":description" => $rawMaterial["description"] ?? null,
                ]);
            }

            $this->connection->commit();
            return $lastGrnId;
        } catch (Throwable $error) {
            $this->connection->rollBack();
            throw $error;
        }
    }


    public function update($id, $data) {
        try {
            $this->connection->beginTransaction();
            $sql = "update grn_header set
code = :code,
date = :date,
our_purchase_order_id = :our_purchase_order_id,
supplier_id = :supplier_id,
status = :status,
modify_date_time = :modify_date_time,
modify_user = :modify_user
where id = :id";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "code" => $data["code"],
                "date" => $data["date"] ?? null,
                "our_purchase_order_id" => $data["our_purchase_order_id"] ?? null,
                "supplier_id" => $data["supplier_id"] ?? null,
                "status" => $data["status"] ?? null,
                "modify_date_time" => date("Y-m-d H:i:s"),
                "modify_user" => $data["modify_user"] ?? null,
                "id" => $id
            ]);

//        delete existing raw materials
            $sql = "delete from grn_header_has_raw_material_master where grn_header_id=:grn_header_id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([":grn_header_id" => $id]);

//        insert updated grn raw materials
            $sql = "insert into grn_header_has_raw_material_master(
grn_header_id,
raw_material_master_id,
quantity,
rate,
description
) values (
:grn_header_id,
:raw_material_master_id,
:quantity,
:rate,
:description
)";
            $statement = $this->connection->prepare($sql);
            foreach ($data["rawMaterials"] as $rawMaterial) {
                $statement->execute([
                    ":grn_header_id" => $id,
                    ":raw_material_master_id" => $rawMaterial["raw_material_master_id"] ?? null,
                    ":quantity" => $rawMaterial["quantity"] ?? null,
                    ":rate" => $rawMaterial["rate"] ?? null,
                    ":description" => $rawMaterial["description"] ?? null,
                ]);
            }
            $this->connection->commit();
            return $id;
        } catch (Throwable $error) {
            $this->connection->rollBack();
            throw $error;
        }
    }


    public function delete($id,$data) {
        try {
            $sql = "update grn_header set 
                      delete_date_time = :delete_date_time, 
                      delete_user = :delete_user,
                      status = 0
                        where id = :id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":delete_date_time" => date("Y-m-d H:i:s"),
                ":delete_user" => $data["delete_user"],
                ":id" => $id
            ]);
            return $id;
        } catch (Throwable $error) {
            throw $error;
        }
    }


}