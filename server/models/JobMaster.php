<?php
require_once "../config/database.php";

class JobMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function findAll() {
        $sql = "select
job.id,
job.date,
job.code,
job.status,
job.added_date_time,
job.modify_date_time,
job.delete_date_time,
job.added_user,
job.modify_user,
job.delete_user,

jd.id as details_id,
jd.item_master_id,
jd.quantity,
jd.description,

im.item_master_short_name


from job_master as job
left join job_master_has_item_master as jd on job.id = jd.job_master_id
left join item_master as im on jd.item_master_id = im.id where job.status=1 order by job.id desc";


        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        $jobs = [];

        foreach ($rows as $row) {
            $jobId = $row["id"];
            if (!isset($jobs[$jobId])) {
                $jobs[$jobId] = [
                    "id" => $row["id"],
                    "date" => $row["date"],
                    "code" => $row["code"],
                    "status" => $row["status"],
                    "added_date_time" => $row["added_date_time"],
                    "modify_date_time" => $row["modify_date_time"],
                    "delete_date_time" => $row["delete_date_time"],
                    "added_user" => $row["added_user"],
                    "modify_user" => $row["modify_user"],
                    "delete_user" => $row["delete_user"],

                    "items" => [],

                ];
            }
            if ($row["details_id"] !== null) {
                $jobs[$jobId]["items"][] = [
                    "details_id" => $row["details_id"],
                    "item_master_id" => $row["item_master_id"],
                    "quantity" => $row["quantity"],
                    "description" => $row["description"],
                    "item_master_short_name" => $row["item_master_short_name"]
                ];
            }
        }
        return array_values($jobs);
    }


    public function create($data) {

        $getNextCodeSql = "select concat('JOB',lpad(coalesce(max(substring(code,4))+1,1),4,'0')) AS job_code from job_master";
        $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
        $getNextCodeResult->execute();
        $jobCode = $getNextCodeResult->fetchColumn();


        try {
            $this->connection->beginTransaction();
            $sql = "insert into job_master(
date,
code,
status,
added_date_time,
modify_date_time,
delete_date_time,
added_user,
modify_user,
delete_user
)values (
:date,
:code,
:status,
:added_date_time,
:modify_date_time,
:delete_date_time,
:added_user,
:modify_user,
:delete_user
)";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "date" => $data["date"],
                "code" => $jobCode,
                "status" => $data["status"],
                "added_date_time" => date("Y-m-d H:i:s") ?? null,
                "modify_date_time" => $data["modify_date_time"] ?? null,
                "delete_date_time" => $data["delete_date_time"] ?? null,
                "added_user" => $data["added_user"] ?? null,
                "modify_user" => $data["modify_user"] ?? null,
                "delete_user" => $data["delete_user"] ?? null
            ]);

            $jobId = $this->connection->lastInsertId();
            $sql = "insert into job_master_has_item_master (
job_master_id,
item_master_id,
quantity,
description
) values (
:job_master_id,
:item_master_id,
:quantity,
:description
)";
            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    "job_master_id" => $jobId,
                    "item_master_id" => $item["item_master_id"] ?? null,
                    "quantity" => $item["quantity"] ?? null,
                    "description" => $item["description"] ?? null
                ]);
            }

            $this->connection->commit();
            return $jobId;
        } catch (Throwable $th) {
            $this->connection->rollBack();
            throw $th;
        }
    }


    public function update($id, $data) {
        try {
            $this->connection->beginTransaction();
            $sql = "update job_master set
date = :date,
code = :code,
status = :status,
added_date_time = :added_date_time,
modify_date_time = :modify_date_time,
delete_date_time = :delete_date_time,
added_user = :added_user,
modify_user = :modify_user,
delete_user = :delete_user
where id = :id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "date" => $data["date"] ?? null,
                "code" => $data["code"] ?? null,
                "status" => $data["status"] ?? null,
                "added_date_time" => $data["added_date_time"] ?? null,
                "modify_date_time" => date("Y-m-d H:i:s") ?? null,
                "delete_date_time" => $data["delete_date_time"] ?? null,
                "added_user" => $data["added_user"] ?? null,
                "modify_user" => $data["modify_user"] ?? null,
                "delete_user" => $data["delete_user"] ?? null,
                "id" => $id]);

            $sql = "delete from job_master_has_item_master where job_master_id=:id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "id" => $id
            ]);

            $sql = "insert into job_master_has_item_master (
job_master_id,
item_master_id,
quantity,
description
) values (
:job_master_id,
:item_master_id,
:quantity,
:description
)";

            $statement = $this->connection->prepare($sql);
            foreach ($data["items"] as $item) {
                $statement->execute([
                    "job_master_id" => $id ?? null,
                    "item_master_id" => $item["item_master_id"] ?? null,
                    "quantity" => $item["quantity"] ?? null,
                    "description" => $item["description"] ?? null
                ]);
            }

            $this->connection->commit();
            return $id;
        } catch (Throwable $th) {
            $this->connection->rollBack();
            throw $th;
        }
    }



    public function delete($id, $data) {
        try {
            $sql ="update job_master set status = :status, delete_date_time = :delete_date_time where id = :id";
            $statement = $this->connection->prepare($sql);
            $statement->execute([
                "status" => $data["status"] ?? null,
                "delete_date_time" => $data["delete_date_time"] ?? null,
                "id" => $id ?? null
            ]);
            return $id;
        }catch (Throwable $th) {
            throw $th;
        }
    }




}

