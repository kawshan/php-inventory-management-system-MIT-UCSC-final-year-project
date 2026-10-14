<?php

require_once "../config/database.php";

class PaymentType {
    private $connection;
    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function getAllPaymentTypes() {
        $sql = "SELECT * FROM payment_type";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
}




