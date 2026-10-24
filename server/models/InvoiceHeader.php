<?php

require_once "../config/database.php";

class InvoiceHeader {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function findAll() {
        $sql = "select

ih.invoice_header_id,
                ih.invoice_header_created_date,
                ih.invoice_header_modify_date,
                ih.invoice_header_delete_date,
                ih.invoice_header_discount_percentage,
                ih.invoice_status_invoice_status_id,
                ih.location_master_id,
                ih.invoice_header_code,
                ih.invoice_header_po_number,
                ih.invoice_header_dispatch_number,
                ih.payment_type_id,
                ih.invoice_header_payed_amount,
                ih.invoice_header_invoice_amount,
                ih.invoice_header_balance_amount,

                ist.id AS status_id,
                ist.name AS status_name,

                pt.id AS payment_type_id,
                pt.payment_type_name,

                ihi.id AS invoice_item_id,
                ihi.item_master_id,
                ihi.invoice_header_has_item_price,
                ihi.invoice_header_has_item_quantity,
                ihi.invoice_header_has_item_discount_amount,
                ihi.invoice_header_has_item_value,

                im.item_master_name,
                im.item_master_code,
                im.item_master_short_name,
                
                lm.id AS location_id,
                lm.location_master_name AS location_name

from invoice_header as ih

left join invoice_status ist
on ih.invoice_status_invoice_status_id = ist.id

left join payment_type pt
on ih.payment_type_id = pt.id

left join invoice_header_has_item ihi
on ih.invoice_header_id = ihi.invoice_header_invoice_header_id

left join item_master im
on ihi.item_master_id = im.id

left join location_master lm
on ih.location_master_id = lm.id

where ih.invoice_status_invoice_status_id=1
order by ih.invoice_header_id desc;";
       $statement =$this->connection->prepare($sql);
       $statement->execute();

       $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
       $invoices = [];

       foreach ($rows as $row) {
           $invoiceId = $row['invoice_header_id'];
           if (!isset($invoices[$invoiceId])) {
               $invoices[$invoiceId] = [
                   "invoice_header_id" => $row['invoice_header_id'],
                   "invoice_header_created_date" => $row['invoice_header_created_date'],
                   "invoice_header_modify_date" => $row['invoice_header_modify_date'],
                   "invoice_header_delete_date" => $row['invoice_header_delete_date'],
                   "invoice_header_discount_percentage" => $row['invoice_header_discount_percentage'],
                   "invoice_status_invoice_status_id" => $row['invoice_status_invoice_status_id'],
                   "location_master_id" => $row['location_master_id'],
                   "invoice_header_code" => $row['invoice_header_code'],
                   "invoice_header_po_number" => $row['invoice_header_po_number'],
                   "invoice_header_dispatch_number" => $row['invoice_header_dispatch_number'],
                   "payment_type_id" => $row['payment_type_id'],
                   "location_master_name" => $row['location_name'],
                   "invoice_header_payed_amount" => $row['invoice_header_payed_amount'],
                   "invoice_header_invoice_amount" => $row['invoice_header_invoice_amount'],
                   "invoice_header_balance_amount" => $row['invoice_header_balance_amount'],
                   "status" => [
                       "id" => $row['status_id'],
                       "name" => $row['status_name']
                   ],
                   "payment_type"=>[
                       "id" => $row['payment_type_id'],
                       "name" => $row['payment_type_name']
                   ],

                   "locations"=>[
                       "id" => $row['location_id'],
                       "name" => $row['location_name']
                   ],

                   "items"=>[]
               ];
           }

           //add invoice item
           if ($row["invoice_item_id"] !== null){
               $invoices[$invoiceId]["items"][] = [
                   "invoice_item_id" => $row["invoice_item_id"],
                   "item_master_id" => $row["item_master_id"],
                   "item_master_name" => $row["item_master_name"],
                   "item_master_code" => $row["item_master_code"],
                   "item_master_short_name" => $row["item_master_short_name"],
                   "invoice_header_has_item_price" => $row["invoice_header_has_item_price"],
                   "invoice_header_has_item_quantity" => $row["invoice_header_has_item_quantity"],
                   "invoice_header_has_item_discount_amount" => $row["invoice_header_has_item_discount_amount"],
                   "invoice_header_has_item_value" => $row["invoice_header_has_item_value"],
               ];
           }
       }
//convert associative array to normal indexed array
        return array_values($invoices);
    }


    public function create($data) {
        try {

            //start transaction
            $this->connection->beginTransaction();
            //create invoice header

            $getNextCodeSql = "SELECT CONCAT('INV',LPAD(COALESCE(MAX(SUBSTRING(invoice_header_code, 4)) + 1, 1),4,'0')) AS invoice_code FROM invoice_header";
            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
            $getNextCodeResult->execute();

            $invoiceCode = $getNextCodeResult->fetchColumn();






            $sql = "insert into invoice_header(
                           invoice_header_created_date,
                           invoice_header_discount_percentage, 
                           invoice_status_invoice_status_id,
                           location_master_id,
                           invoice_header_code,
                           invoice_header_po_number,
                           invoice_header_dispatch_number,
                           payment_type_id,
                           invoice_header_payed_amount,
                           invoice_header_invoice_amount,
                           invoice_header_balance_amount
                           ) 
                        values (
                                :created_date,
                                :discount_percentage,
                                :status_id,
                                :location_id,
                                :header_code,
                                :po_number,
                                :dispatch_number,
                                :payment_type_id,
                                :payed_amount,
                                :invoice_amount,
                                :balance_amount
                                
                        )";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":created_date" => $data["invoice_header_created_date"],
                ":discount_percentage" => $data["invoice_header_discount_percentage"] ?? null,
                ":status_id" => $data["invoice_status_invoice_status_id"],
                ":location_id" => $data["location_master_id"],
                ":header_code" => $invoiceCode,
                ":po_number" => $data["invoice_header_po_number"] ?? null,
                ":dispatch_number" => $data["invoice_header_dispatch_number"] ?? null,
                ":payment_type_id" => $data["payment_type_id"] ?? null,
                ":payed_amount" => $data["invoice_header_payed_amount"] ?? null,
                ":invoice_amount" => $data["invoice_header_invoice_amount"] ?? null,
                ":balance_amount" => $data["invoice_header_balance_amount"] ?? null
            ]);

            $invoiceHeaderId = $this->connection->lastInsertId();
            //create invoice Items
            $sql = "insert into invoice_header_has_item(
                                    invoice_header_invoice_header_id, 
                                    item_master_id, 
                                    invoice_header_has_item_price, 
                                    invoice_header_has_item_quantity,
                                    invoice_header_has_item_discount_amount,
                                    invoice_header_has_item_value) 
values (
        :invoice_header_id,
        :item_master_id,
        :price,
        :quantity,
        :discount_amount,
        :value
)";

            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    ":invoice_header_id" => $invoiceHeaderId,
                    ":item_master_id" => $item["item_master_id"],
                    ":price" => $item["invoice_header_has_item_price"],
                    ":quantity" => $item["invoice_header_has_item_quantity"] ?? 0,
                    ":discount_amount" => $item["invoice_header_has_item_discount_amount"] ?? 0,
                    ":value" => $item["invoice_header_has_item_value"] ?? 0
                ]);
            }

            $this->connection->commit();
            return $invoiceHeaderId;
        } catch (Throwable $error) {
            $this->connection->rollback();
            throw $error;
        }
    }


    public function update($id, $data) {

        try {

            $this->connection->beginTransaction();
            $sql = "update invoice_header
            set
                invoice_header_created_date = :created_date,
                invoice_header_discount_percentage = :discount_percentage,
                invoice_status_invoice_status_id = :status_id,
                location_master_id = :location_id,
                invoice_header_code = :header_code,
                invoice_header_po_number = :po_number,
                invoice_header_dispatch_number = :dispatch_number,
                payment_type_id = :payment_type_id,
                invoice_header_payed_amount = :payed_amount,
                invoice_header_invoice_amount = :invoice_amount,
                invoice_header_balance_amount = :balance_amount
                where invoice_header_id = :invoice_id";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":created_date" => $data["invoice_header_created_date"],
                ":discount_percentage" => $data["invoice_header_discount_percentage"] ?? null,
                ":status_id" => $data["invoice_status_invoice_status_id"],
                ":location_id" => $data["location_master_id"],
                ":header_code" => $data["invoice_header_code"] ?? null,
                ":po_number" => $data["invoice_header_po_number"] ?? null,
                ":dispatch_number" => $data["invoice_header_dispatch_number"] ?? null,
                ":payment_type_id" => $data["payment_type_id"] ?? null,
                ":payed_amount" => $data["invoice_header_payed_amount"] ?? null,
                ":invoice_amount" => $data["invoice_header_invoice_amount"] ?? null,
                ":balance_amount" => $data["invoice_header_balance_amount"] ?? null,
                ":invoice_id" => $id
            ]);

//            delete existing invoice items
            $sql = "delete from invoice_header_has_item where invoice_header_invoice_header_id = :invoice_header_id";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":invoice_header_id" => $id
            ]);

//            Insert updated invoice items
            $sql = "insert into invoice_header_has_item(
                                    invoice_header_invoice_header_id, 
                                    item_master_id, 
                                    invoice_header_has_item_price, 
                                    invoice_header_has_item_quantity, 
                                    invoice_header_has_item_discount_amount, 
                                    invoice_header_has_item_value
)values (
         :invoice_header_id,
         :item_master_id,
         :price,
         :quantity,
         :discount_amount,
         :value
)";
            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    ":invoice_header_id" => $id,
                    ":item_master_id" => $item["item_master_id"],
                    ":price" => $item["invoice_header_has_item_price"],
                    ":quantity" => $item["invoice_header_has_item_quantity"] ?? 0,
                    ":discount_amount" => $item["invoice_header_has_item_discount_amount"] ?? 0,
                    ":value" => $item["invoice_header_has_item_value"] ?? 0
                ]);
            }
            $this->connection->commit();
            return $id;
        } catch (Throwable $error) {
            $this->connection->rollback();
            throw $error;
        }


    }


    public function delete($id) {
        try {
            $sql = "update invoice_header set invoice_status_invoice_status_id = :status_id where invoice_header_id = :invoice_id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":status_id" => 2,
                ":invoice_id" => $id
            ]);
            return $id;
        } catch (Throwable $error) {
            throw $error;
        }
    }
}
