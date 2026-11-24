<?php

require_once "../config/database.php";

class AssertAssignmentMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function findAll() {

        $sql = "

        select

        assign.id,
        assign.code,
        assign.date,
        assign.status,

        assign.added_date_time,
        assign.modify_date_time,
        assign.delete_date_time,

        assign.added_user,
        assign.modify_user,
        assign.delete_user,

        details.id as details_id,
        details.assert_assignment_id,
        details.asset_master_id,
        details.from_location,
        details.to_location,
        details.description,
        details.department_master_id,
        details.employee_id,

        dep.name as department_name,
        emp.employee_name

        from assert_assignment as assign

        left join assert_assignment_has_asset_master as details
        on assign.id = details.assert_assignment_id

        left join department_master as dep
        on details.department_master_id = dep.id

        left join employee as emp
        on details.employee_id = emp.id

        where assign.status = 1

        order by assign.id desc;

        ";

        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

        $assignments = [];

        // Have I already created this assignment?
        // If not, create it.
        // Regardless, add this row's asset to that assignment.

        foreach ($rows as $row) {

            $assignmentId = $row['id'];

            if (!isset($assignments[$assignmentId])) {

                $assignments[$assignmentId] = [

                    "id" => $row['id'],
                    "code" => $row['code'],
                    "date" => $row['date'],
                    "status" => $row['status'],

                    "added_date_time" => $row['added_date_time'],
                    "modify_date_time" => $row['modify_date_time'],
                    "delete_date_time" => $row['delete_date_time'],

                    "added_user" => $row['added_user'],
                    "modify_user" => $row['modify_user'],
                    "delete_user" => $row['delete_user'],

                    "asset" => []

                ];

            }


            if ($row["details_id"] !== null) {

                $assignments[$assignmentId]["asset"][] = [

                    "details_id" => $row["details_id"],

                    "assert_assignment_id" => $row["assert_assignment_id"],

                    "asset_master_id" => $row["asset_master_id"],

                    "from_location" => $row["from_location"],

                    "to_location" => $row["to_location"],

                    "description" => $row["description"],

                    "department_master_id" => $row["department_master_id"],

                    "employee_id" => $row["employee_id"],

                    "department_name" => $row["department_name"],

                    "employee_name" => $row["employee_name"]

                ];

            }

        }

        return array_values($assignments);

    }


    public function create($data) {

        try {

            $this->connection->beginTransaction();


            $getNextCodeSql = "select concat('ASG',lpad(coalesce(max(substring(code,4))+1,1),4,'0')) AS assignment_code from assert_assignment";

            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
            $getNextCodeResult->execute();

            $assignmentCode = $getNextCodeResult->fetchColumn();


            $sql = "

            insert into assert_assignment(

                code,
                date,
                status,

                added_date_time,
                modify_date_time,
                delete_date_time,

                added_user,
                modify_user,
                delete_user

            )

            values(

                :code,
                :date,
                :status,

                :added_date_time,
                :modify_date_time,
                :delete_date_time,

                :added_user,
                :modify_user,
                :delete_user

            )

            ";

            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":code" => $assignmentCode,

                ":date" => $data["date"] ?? null,

                ":status" => $data["status"] ?? 1,

                ":added_date_time" => date("Y-m-d H:i:s"),

                ":modify_date_time" => $data["modify_date_time"] ?? null,

                ":delete_date_time" => $data["delete_date_time"] ?? null,

                ":added_user" => $data["added_user"] ?? null,

                ":modify_user" => $data["modify_user"] ?? null,

                ":delete_user" => $data["delete_user"] ?? null

            ]);


            $assignmentId = $this->connection->lastInsertId();


            $sql = "

            insert into assert_assignment_has_asset_master(

                assert_assignment_id,
                asset_master_id,
                from_location,
                to_location,
                description,
                department_master_id,
                employee_id

            )

            values(

                :assert_assignment_id,
                :asset_master_id,
                :from_location,
                :to_location,
                :description,
                :department_master_id,
                :employee_id

            )

            ";

            $statement = $this->connection->prepare($sql);


            foreach ($data["asset"] as $asset) {

                $statement->execute([

                    ":assert_assignment_id" => $assignmentId,

                    ":asset_master_id" => $asset["asset_master_id"],

                    ":from_location" => $asset["from_location"],

                    ":to_location" => $asset["to_location"],

                    ":description" => $asset["description"] ?? null,

                    ":department_master_id" => $asset["department_master_id"] ?? null,

                    ":employee_id" => $asset["employee_id"] ?? null

                ]);

            }


            $this->connection->commit();

            return $assignmentId;


        } catch (Throwable $error) {

            $this->connection->rollback();

            throw $error;

        }

    }


    public function update($id, $data) {

        try {

            $this->connection->beginTransaction();


            $sql = "

            update assert_assignment set

                code = :code,
                date = :date,
                status = :status,

                added_date_time = :added_date_time,
                modify_date_time = :modify_date_time,
                delete_date_time = :delete_date_time,

                added_user = :added_user,
                modify_user = :modify_user,
                delete_user = :delete_user

            where id = :id

            ";

            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":code" => $data["code"] ?? null,

                ":date" => $data["date"] ?? null,

                ":status" => $data["status"] ?? null,

                ":added_date_time" => $data["added_date_time"] ?? null,

                ":modify_date_time" => date("Y-m-d H:i:s"),

                ":delete_date_time" => $data["delete_date_time"] ?? null,

                ":added_user" => $data["added_user"] ?? null,

                ":modify_user" => $data["modify_user"] ?? null,

                ":delete_user" => $data["delete_user"] ?? null,

                ":id" => $id

            ]);


            // Delete existing assignment assets

            $sql = "

            delete from assert_assignment_has_asset_master

            where assert_assignment_id = :assert_assignment_id

            ";

            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":assert_assignment_id" => $id

            ]);


            // Insert updated assignment assets

            $sql = "

            insert into assert_assignment_has_asset_master(

                assert_assignment_id,
                asset_master_id,
                from_location,
                to_location,
                description,
                department_master_id,
                employee_id

            )

            values(

                :assert_assignment_id,
                :asset_master_id,
                :from_location,
                :to_location,
                :description,
                :department_master_id,
                :employee_id

            )

            ";

            $statement = $this->connection->prepare($sql);


            foreach ($data["asset"] as $asset) {

                $statement->execute([

                    ":assert_assignment_id" => $id,

                    ":asset_master_id" => $asset["asset_master_id"],

                    ":from_location" => $asset["from_location"],

                    ":to_location" => $asset["to_location"],

                    ":description" => $asset["description"] ?? null,

                    ":department_master_id" => $asset["department_master_id"] ?? null,

                    ":employee_id" => $asset["employee_id"] ?? null

                ]);

            }


            $this->connection->commit();

            return $id;


        } catch (Throwable $error) {

            $this->connection->rollback();

            throw $error;

        }

    }


    public function delete($id, $data) {

        try {

            $sql = "

            update assert_assignment set

                delete_date_time = :delete_date_time,

                delete_user = :delete_user,

                status = :status

            where id = :id

            ";

            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":delete_date_time" => date("Y-m-d H:i:s"),

                ":delete_user" => $data["delete_user"] ?? null,

                ":status" => 0,

                ":id" => $id

            ]);

            return $id;


        } catch (Throwable $error) {

            throw $error;

        }

    }

}