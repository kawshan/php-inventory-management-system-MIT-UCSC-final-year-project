<?php
require_once "../config/database.php";


class UserMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function findAll() {
        $query = "select

u.id as user_id,
u.user_name,
u.password,
u.email,
u.status,
u.added_date_time,
u.modify_date_time,
u.delete_date_time,
u.added_user,
u.modify_user,
u.delete_user,

e.id as employee_id,
e.employee_name,
e.dob,
e.nic,

r.id as role_id,
r.name as role_name

from user as u
left join role r on u.role_id = r.id
left join employee e on u.employee_id = e.id where u.status = 1 order by u.id desc ";
        $statement = $this->connection->prepare($query);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function create($data) {

        $existingUser = "SELECT 1 FROM user WHERE user_name=:user_name";

        $statement = $this->connection->prepare($existingUser);
        $statement->execute([
            ":user_name" => $data["user_name"]
        ]);

        if ($statement->fetch()) {
            return null;
        }

        $userPasswordHashed = password_hash($data["password"], PASSWORD_DEFAULT);


        $sql = "insert into user(
user_name,
password,
email,
status,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user,
employee_id,
role_id) values(
:user_name,
:password,
:email,
:status,
:added_date_time,
:modify_date_time,
:delete_date_time,
:added_user,
:modify_user,
:delete_user,
:employee_id,
:role_id                  
)";

        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":user_name" => $data["user_name"] ?? null,
            ":password" => $userPasswordHashed,
            ":email" => $data["email"] ?? null,
            ":status" => $data["status"] ?? null,
            ":added_date_time" => date("Y-m-d H:i:s"),
            ":modify_date_time" => $data["modify_date_time"] ?? null,
            ":delete_date_time" => $data["delete_date_time"] ?? null,
            ":added_user" => $data["added_user"] ?? null,
            ":modify_user" => $data["modify_user"] ?? null,
            ":delete_user" => $data["delete_user"] ?? null,
            ":employee_id" => $data["employee_id"] ?? null,
            ":role_id" => $data["role_id"] ?? null
        ]);

        return $this->connection->lastInsertId();
    }


    public function update($id, $data) {

        if (!empty($data["password"])) {
            $userPasswordHashed = password_hash($data["password"], PASSWORD_DEFAULT);

            $sql = "update user set
user_name = :user_name,
password = :password,
email = :email,
status = :status,
added_date_time = :added_date_time,
modify_date_time = :modify_date_time,
delete_date_time = :delete_date_time,
added_user = :added_user,
modify_user = :modify_user,
delete_user = :delete_user,
employee_id = :employee_id,
role_id = :role_id
where id = :id";

            $statement = $this->connection->prepare($sql);
            return $statement->execute([
                ":id" => $id,
                ":user_name" => $data["user_name"] ?? null,
                ":password" => $userPasswordHashed,
                ":email" => $data["email"] ?? null,
                ":status" => $data["status"] ?? null,
                ":added_date_time" => $data["added_date_time"] ?? null,
                ":modify_date_time" => date("Y-m-d H:i:s"),
                ":delete_date_time" => $data["delete_date_time"] ?? null,
                ":added_user" => $data["added_user"] ?? null,
                ":modify_user" => $data["modify_user"] ?? null,
                ":delete_user" => $data["delete_user"] ?? null,
                ":employee_id" => $data["employee_id"] ?? null,
                ":role_id" => $data["role_id"] ?? null
            ]);
        } else {
            $sql = "UPDATE user SET
            user_name = :user_name,
            email = :email,
            status = :status,
            modify_date_time = :modify_date_time,
            employee_id = :employee_id,
            role_id = :role_id
            WHERE id = :id";

            $statement = $this->connection->prepare($sql);

            return $statement->execute([
                ":id" => $id,
                ":user_name" => $data["user_name"] ?? null,
                ":email" => $data["email"] ?? null,
                ":status" => $data["status"] ?? null,
                ":modify_date_time" => date("Y-m-d H:i:s"),
                ":employee_id" => $data["employee_id"] ?? null,
                ":role_id" => $data["role_id"] ?? null
            ]);
        }


    }


    public function delete($id, $data) {
        $sql = "update user set
        status = :status,
        delete_date_time = :delete_date_time,
        delete_user = :delete_user
        where id = :id";

        $statement = $this->connection->prepare($sql);
        return $statement->execute([
            ":id" => $id,
            ":status" => 0,
            ":delete_date_time" => date("Y-m-d H:i:s"),
            ":delete_user" => $data["delete_user"] ?? null,
        ]);
    }



    public function login($data) {
        $sql = "SELECT
            id,
            user_name,
            password,
            email,
            status,
            employee_id,
            role_id
            FROM user
            WHERE user_name = :user_name
            AND status = 1";

        $statement = $this->connection->prepare($sql);
        $statement->execute([
            ":user_name" => $data["user_name"],
        ]);
        $user = $statement->fetch(PDO::FETCH_ASSOC);
        if (!$user){
            return false;
        }

        if (!password_verify($data["password"], $user["password"])) {
            return false;
        }

        unset($user["password"]);
        return $user;
    }





}