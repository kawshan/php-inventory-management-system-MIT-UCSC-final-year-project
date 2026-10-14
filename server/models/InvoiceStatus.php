<?php

require_once "../config/database.php";


class InvoiceStatus {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllInvoiceStatuses() {
        $sql = "select * from invoice_status";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDo::FETCH_ASSOC);
    }



}