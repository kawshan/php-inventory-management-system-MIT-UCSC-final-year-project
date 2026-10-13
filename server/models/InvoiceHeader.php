<?php

require_once "../config/database.php";

class InvoiceHeader {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function create($data) {
        try {

            //start transaction
            $this->connection->beginTransaction();
            //create invoice header

            $sql = "insert into invoice_header(
                           invoice_header_created_date,
                           invoice_header_discount_percentage, 
                           invoice_status_invoice_status_id,
                           location_master_id,
                           invoice_header_code,
                           invoice_header_po_number,
                           invoice_header_dispatch_number,
                           payment_type_id) 
                        values (
                                :created_date,
                                :discount_percentage,
                                :status_id,
                                :location_id,
                                :header_code,
                                :po_number,
                                :dispatch_number,
                                :payment_type_id
                        )";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":created_date" => $data["invoice_header_created_date"],
                ":discount_percentage" => $data["invoice_header_discount_percentage"] ?? null,
                ":status_id" => $data["invoice_status_invoice_status_id"],
                ":location_id" => $data["location_master_id"],
                ":header_code" => $data["invoice_header_code"] ?? null,
                ":po_number" => $data["invoice_header_po_number"] ?? null,
                ":dispatch_number" => $data["invoice_header_dispatch_number"] ?? null,
                ":payment_type_id" => $data["payment_type_id"] ?? null
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
                payment_type_id = :payment_type_id
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
            $sql="update invoice_header set invoice_status_invoice_status_id = :status_id where invoice_header_id = :invoice_id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":status_id" => 2,
                ":invoice_id" => $id
            ]);
            return $id;
        }catch (Throwable $error) {
            throw $error;
        }
    }









}
