<?php

require_once "../config/database.php";

class EmployeeMaster {

    private $connection;


    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function findAll() {
        $sql = "select * from employee where employee_status=1 order by id DESC";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function create($data) {

        $existingEmployee = "SELECT 1 FROM employee WHERE nic = :nic";

        $statement = $this->connection->prepare($existingEmployee);
        $statement->execute([
            ":nic" => $data["nic"]
        ]);

        if ($statement->fetch()) {
            return null;
        }



        $sql = "insert into employee(
employee_name,
dob,
nic,
gender,
email,
address,
civil_status,
designation_id,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user,
employee_status) values (
:employee_name,
:dob,
:nic,
:gender,
:email,
:address,
:civil_status,
:designation_id,
:added_date_time,
:modify_date_time,
:delete_date_time,
:added_user,
:modify_user,
:delete_user,
:employee_status                         
)";

        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":employee_name" => $data["employee_name"] ?? null,
            ":dob" => $data["dob"] ?? null,
            ":nic" => $data["nic"] ?? null,
            ":gender" => $data["gender"] ?? null,
            ":email" => $data["email"] ?? null,
            ":address" => $data["address"] ?? null,
            ":civil_status" => $data["civil_status"] ?? null,
            ":designation_id" => $data["designation_id"] ?? null,
            ":added_date_time" => date("Y-m-d H:i:s"),
            ":modify_date_time" => $data["modify_date_time"] ?? null,
            ":delete_date_time" => $data["delete_date_time"] ?? null,
            ":added_user" => $data["added_user"] ?? null,
            ":modify_user" => $data["modify_user"] ?? null,
            ":delete_user" => $data["delete_user"] ?? null,
            ":employee_status" => $data["employee_status"] ?? null
        ]);

        return $this->connection->lastInsertId();
    }

    public function update($id, $data) {
        $sql = "update employee set
employee_name = :employee_name,
dob = :dob,
nic = :nic,
gender = :gender,
email = :email,
address = :address,
civil_status = :civil_status,
designation_id = :designation_id,
added_date_time = :added_date_time,
modify_date_time = :modify_date_time,
delete_date_time = :delete_date_time,
added_user = :added_user,
modify_user = :modify_user,
delete_user = :delete_user,
employee_status = :employee_status
where id = :id";

        $statement =  $this->connection->prepare($sql);
        return $statement->execute([
            ":employee_name" => $data["employee_name"] ?? null,
            ":dob" => $data["dob"] ?? null,
            ":nic" => $data["nic"] ?? null,
            ":gender" => $data["gender"] ?? null,
            ":email" => $data["email"] ?? null,
            ":address" => $data["address"] ?? null,
            ":civil_status" => $data["civil_status"] ?? null,
            ":designation_id" => $data["designation_id"] ?? null,
            ":added_date_time" => $data["added_date_time"] ?? null,
            ":modify_date_time" => date("Y-m-d H:i:s"),
            ":delete_date_time" => $data["delete_date_time"] ?? null,
            ":added_user" => $data["added_user"] ?? null,
            ":modify_user" => $data["modify_user"] ?? null,
            ":delete_user" => $data["delete_user"] ?? null,
            ":employee_status" => $data["employee_status"] ?? null,
            ":id" => $id]);
    }

    public function delete($id,$data) {
        $sql = "update employee set delete_user = :delete_user, delete_date_time = :delete_date_time, employee_status=0 where id = :id";
        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":delete_user" => $data["delete_user"] ?? null,
            ":delete_date_time" => date("Y-m-d H:i:s"),
            ":id" => $id
        ]);

    }


    public function getEmployeesWithoutUserAccount() {
        $sql= "select * from employee where id not in(select employee_id from user)";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }



}
