<?php
require_once "../config/database.php";


class PrivilegeMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function findAll() {
        $sql = "select
p.id,
p.sel,
p.inst,
p.upd,
p.del,
p.role_id,
p.module_id,
r.name as role_name,
m.name as module_name

from privilege as p
left join role as r on p.role_id = r.id
left join module as m on p.module_id = m.id order by p.id desc";
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


