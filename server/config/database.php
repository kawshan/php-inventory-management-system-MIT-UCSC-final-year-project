<?php

class Database
{

    private $host = "localhost";
    private $user = "root";
    private $password = "kawshan6358";
    private $database = "inventory_management_php";


    public function connect()
    {
        try {
            $connection = new PDO("mysql:host=$this->host;dbname=$this->database", $this->user, $this->password);

            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $connection;

        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }


}


?>