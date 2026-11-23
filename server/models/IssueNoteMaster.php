<?php

require_once "../config/database.php";

class IssueNoteMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function findAll() {

        $sql = "

        select

        inh.id as issue_note_master_id,
        inh.date as issue_note_master_date,
        inh.code as issue_note_master_code,
        inh.status as issue_note_master_status,

        inh.added_date_time as issue_note_master_added_date_time,
        inh.modify_date_time as issue_note_master_modify_date_time,
        inh.delete_date_time as issue_note_master_delete_date_time,

        inh.added_user as issue_note_master_added_user,
        inh.modify_user as issue_note_master_modify_user,
        inh.delete_user as issue_note_master_delete_user,

        inh.job_master_id,

        ind.id as issue_note_detail_id,
        ind.issue_note_header_id,
        ind.raw_material_master_id,
        ind.quantity,
        ind.description,

        rm.id as raw_material_id,
        rm.name as raw_material_name,
        rm.code as raw_material_code,

        job.id as job_id,
        job.code as job_code

        from issue_note_header as inh

        left join issue_note_header_has_raw_material_master as ind
        on inh.id = ind.issue_note_header_id

        left join raw_material_master as rm
        on ind.raw_material_master_id = rm.id

        left join job_master as job
        on inh.job_master_id = job.id

        where inh.status = 1

        order by inh.id desc;

        ";

        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

        $issueNotes = [];


        // Have I already created this issue note?
        // If not, create it.
        // Regardless, add this row's raw material to that issue note.

        foreach ($rows as $row) {

            $issueNoteId = $row['issue_note_master_id'];

            if (!isset($issueNotes[$issueNoteId])) {

                $issueNotes[$issueNoteId] = [

                    "issue_note_master_id" => $row['issue_note_master_id'],
                    "issue_note_master_date" => $row['issue_note_master_date'],
                    "issue_note_master_code" => $row['issue_note_master_code'],
                    "issue_note_master_status" => $row['issue_note_master_status'],

                    "issue_note_master_added_date_time" => $row['issue_note_master_added_date_time'],
                    "issue_note_master_modify_date_time" => $row['issue_note_master_modify_date_time'],
                    "issue_note_master_delete_date_time" => $row['issue_note_master_delete_date_time'],

                    "issue_note_master_added_user" => $row['issue_note_master_added_user'],
                    "issue_note_master_modify_user" => $row['issue_note_master_modify_user'],
                    "issue_note_master_delete_user" => $row['issue_note_master_delete_user'],

                    "job_master_id" => $row['job_master_id'],
                    "job_code" => $row['job_code'],

                    "rawMaterials" => [],
//                    "raw_material_masters" => []

                ];

            }


            if ($row["issue_note_detail_id"] !== null) {

                $issueNotes[$issueNoteId]["rawMaterials"][] = [

                    "issue_note_detail_id" => $row["issue_note_detail_id"],

                    "issue_note_header_id" => $row["issue_note_header_id"],

                    "raw_material_master_id" => $row["raw_material_master_id"],

                    "quantity" => $row["quantity"],

                    "description" => $row["description"],

                    "raw_material_name" => $row["raw_material_name"]

                ];

            }


//            if ($row["raw_material_id"] !== null) {
//
//                $issueNotes[$issueNoteId]["raw_material_masters"][] = [
//
//                    "raw_material_id" => $row["raw_material_id"],
//
//                    "raw_material_name" => $row["raw_material_name"],
//
//                    "raw_material_code" => $row["raw_material_code"]
//
//                ];
//
//            }

        }


        return array_values($issueNotes);

    }



    public function create($data) {

        try {

            $this->connection->beginTransaction();


            // Generate Issue Note Code

            $getNextCodeSql = "select concat('ISS',lpad(coalesce(max(substring(code, 4)) + 1, 1),4,'0')) AS issue_note_code from issue_note_header";

            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);

            $getNextCodeResult->execute();

            $issueNoteCode = $getNextCodeResult->fetchColumn();



            // Insert Issue Note Header

            $sql = "

            insert into issue_note_header(

                date,
                code,
                status,
                added_date_time,
                modify_date_time,
                delete_date_time,
                added_user,
                modify_user,
                delete_user,
                job_master_id

            )

            values(

                :issue_note_date,
                :issue_note_code,
                :status,
                :added_date_time,
                :modify_date_time,
                :delete_date_time,
                :added_user,
                :modify_user,
                :delete_user,
                :job_master_id

            )

            ";


            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":issue_note_date" => $data["issue_note_master_date"] ?? null,

                ":issue_note_code" => $issueNoteCode,

                ":status" => $data["issue_note_master_status"] ?? 1,

                ":added_date_time" => date("Y-m-d H:i:s"),

                ":modify_date_time" => $data["issue_note_master_modify_date_time"] ?? null,

                ":delete_date_time" => $data["issue_note_master_delete_date_time"] ?? null,

                ":added_user" => $data["issue_note_master_added_user"] ?? null,

                ":modify_user" => $data["issue_note_master_modify_user"] ?? null,

                ":delete_user" => $data["issue_note_master_delete_user"] ?? null,

                ":job_master_id" => $data["job_master_id"] ?? null

            ]);


            $issueNoteMasterId = $this->connection->lastInsertId();



            // Insert Issue Note Details

            $sql = "

            insert into issue_note_header_has_raw_material_master(

                issue_note_header_id,
                raw_material_master_id,
                quantity,
                description

            )

            values(

                :issue_note_header_id,
                :raw_material_master_id,
                :quantity,
                :description

            )

            ";


            $statement = $this->connection->prepare($sql);


            foreach ($data["rawMaterials"] as $rawMaterial) {

                $statement->execute([

                    ":issue_note_header_id" => $issueNoteMasterId,

                    ":raw_material_master_id" => $rawMaterial["raw_material_master_id"] ?? null,

                    ":quantity" => $rawMaterial["quantity"] ?? null,

                    ":description" => $rawMaterial["description"] ?? null

                ]);

            }


            $this->connection->commit();

            return $issueNoteMasterId;


        } catch (Throwable $error) {

            $this->connection->rollback();

            throw $error;

        }

    }



    public function update($id, $data) {

        try {

            $this->connection->beginTransaction();


            // Update Issue Note Header

            $sql = "

            update issue_note_header set

                date = :issue_note_date,

                code = :issue_note_code,

                status = :status,

                added_date_time = :added_date_time,

                modify_date_time = :modify_date_time,

                delete_date_time = :delete_date_time,

                added_user = :added_user,

                modify_user = :modify_user,

                delete_user = :delete_user,

                job_master_id = :job_master_id

            where id = :id

            ";


            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":issue_note_date" => $data["issue_note_master_date"] ?? null,

                ":issue_note_code" => $data["issue_note_master_code"] ?? null,

                ":status" => $data["issue_note_master_status"] ?? 1,

                ":added_date_time" => $data["issue_note_master_added_date_time"] ?? null,

                ":modify_date_time" => date("Y-m-d H:i:s"),

                ":delete_date_time" => $data["issue_note_master_delete_date_time"] ?? null,

                ":added_user" => $data["issue_note_master_added_user"] ?? null,

                ":modify_user" => $data["issue_note_master_modify_user"] ?? null,

                ":delete_user" => $data["issue_note_master_delete_user"] ?? null,

                ":job_master_id" => $data["job_master_id"] ?? null,

                ":id" => $id

            ]);



            // Delete existing Issue Note Details

            $sql = "

            delete from issue_note_header_has_raw_material_master

            where issue_note_header_id = :issue_note_header_id

            ";


            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":issue_note_header_id" => $id

            ]);



            // Insert updated Issue Note Details

            $sql = "

            insert into issue_note_header_has_raw_material_master(

                issue_note_header_id,

                raw_material_master_id,

                quantity,

                description

            )

            values(

                :issue_note_header_id,

                :raw_material_master_id,

                :quantity,

                :description

            )

            ";


            $statement = $this->connection->prepare($sql);


            foreach ($data["rawMaterials"] as $rawMaterial) {

                $statement->execute([

                    ":issue_note_header_id" => $id,

                    ":raw_material_master_id" => $rawMaterial["raw_material_master_id"] ?? null,

                    ":quantity" => $rawMaterial["quantity"] ?? null,

                    ":description" => $rawMaterial["description"] ?? null

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

            update issue_note_header set

                delete_date_time = :delete_date_time,

                delete_user = :delete_user,

                status = :status

            where id = :id

            ";


            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":delete_date_time" => date("Y-m-d H:i:s"),

                ":delete_user" => $data["issue_note_master_delete_user"] ?? null,

                ":status" => 0,

                ":id" => $id

            ]);


            return $id;


        } catch (Throwable $error) {

            throw $error;

        }

    }


}