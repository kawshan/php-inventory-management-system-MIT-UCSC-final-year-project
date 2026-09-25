<?php

require_once "../config/database.php";

class ItemCategoryMaster {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function getAllItemCategories() {
        $sql = "SELECT * FROM item_category_master order by id desc";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getItemCategoryById($id) {
        $sql = "select * from item_category_master where id=:id";
        $statement = $this->connection->prepare($sql);
        $statement->execute([":id" => $id]);
        return $statement->fetch(PDO::FETCH_ASSOC);
    }


    public function createItemCategory($data) {
        $sql="insert into item_category_master
    (item_category_master_name,item_category_master_code,item_category_master_added_date,item_category_master_modify_date,item_category_master_delete_date,item_category_master_status) 
    values(:name,:code,:date,:modify_date,:delete_date,:status)";
    $statement = $this->connection->prepare($sql);
    $statement->execute([
        ":name"=>$data["item_category_master_name"],
        ":code"=>$data["item_category_master_code"],
        ":date"=>$data["item_category_master_added_date"],
        ":modify_date"=>$data["item_category_master_modify_date"],
        ":delete_date"=>$data["item_category_master_delete_date"],
        ":status"=>$data["item_category_master_status"]
    ]);
    return $this->connection->lastInsertId();
    }



    public function updateItemCategory($id,$data) {
        $sql = "update item_category_master set
                         item_category_master_name = :name,
                         item_category_master_code = :code,
                         item_category_master_added_date = :date,
                         item_category_master_modify_date = :modify_date,
                         item_category_master_delete_date = :delete_date,
                         item_category_master_status = :status
                         where id = :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":name"=>$data["item_category_master_name"],
            ":code"=>$data["item_category_master_code"],
            ":date"=>$data["item_category_master_added_date"],
            ":modify_date"=>$data["item_category_master_modify_date"],
            ":delete_date"=>$data["item_category_master_delete_date"],
            ":status"=>$data["item_category_master_status"],
            ":id"=>$id
        ]);
    }

    public function deleteItemCategory($id) {
        $sql = "delete from item_category_master where id = :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([":id" => $id]);
    }




}