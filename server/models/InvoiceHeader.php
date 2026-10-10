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
                           location_master_id) 
                        values (
                                :created_date,
                                :discount_percentage,
                                :status_id,
                                :location_id
                        )";

            $statement = $this->connection->prepare($sql);
            $statement->execute([
                ":created_date" => $data["invoice_header_created_date"],
                ":discount_percentage" => $data["invoice_header_discount_percentage"] ?? null,
                ":status_id" => $data["invoice_status_invoice_status_id"],
                ":location_id" => $data["location_master_id"]
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















}
