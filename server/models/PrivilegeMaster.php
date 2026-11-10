<?php
require_once "../config/database.php";


class PrivilegeMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function findAll() {
        $sql = "SELECT * FROM privilege";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


    public function create($data) {



        $checkExisting = "select 1 from privilege where role_id=:role_id and module_id=:module_id;";
        $statement = $this->connection->prepare($checkExisting);
        $statement->execute([
            ":role_id" => $data['role_id'] ?? null,
            ":module_id" => $data['module_id'] ?? null
        ]);

        if ($statement->fetch()) {
            return null;
        }





        $sql = "insert into privilege(
sel,
inst,
upd,
del,
role_id,
module_id                      
)values (
:sel,
:inst,
:upd,
:del,
:role_id,
:module_id)";

        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":sel" => $data["sel"] ?? null,
            ":inst" => $data["inst"] ?? null,
            ":upd" => $data["upd"] ?? null,
            ":del" => $data["del"] ?? null,
            ":role_id" => $data["role_id"] ?? null,
            ":module_id" => $data["module_id"] ?? null
        ]);
        return $this->connection->lastInsertId();
    }


    public function update($id, $data) {
        $sql = "update privilege set sel = :sel, inst = :inst, upd = :upd, del = :del, role_id = :role_id, module_id = :module_id where id = :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":sel" => $data["sel"],
            ":inst" => $data["inst"],
            ":upd" => $data["upd"],
            ":del" => $data["del"],
            ":role_id" => $data["role_id"],
            ":module_id" => $data["module_id"],
            ":id" => $id
        ]);
    }


    public function delete($id) {
        $sql = "delete from privilege where id = :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":id" => $id
        ]);
    }

}


