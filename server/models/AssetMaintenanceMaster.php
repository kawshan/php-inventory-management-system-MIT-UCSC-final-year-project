<?php

require_once "../config/database.php";

class AssetMaintenanceMaster {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }


    public function findAll() {

        $sql = "

        select

        header.id,
        header.code,
        header.date,
        header.status,

        header.added_date_time,
        header.modify_date_time,
        header.delete_date_time,

        header.added_user,
        header.modify_user,
        header.delete_user,

        details.id as details_id,
        details.asset_maintenance_id,
        details.asset_master_id,
        details.rate,
        details.description,

        am.name

        from asset_maintenance as header

        left join asset_maintenance_has_asset_master as details
        on header.id = details.asset_maintenance_id

        left join asset_master as am
        on details.asset_master_id = am.id

        where header.status = 1

        order by header.id desc;

        ";

        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

        $maintenances = [];

        // Have I already created this maintenance?
        // If not, create it.
        // Regardless, add this row's asset to that maintenance.

        foreach ($rows as $row) {

            $maintenanceId = $row['id'];

            if (!isset($maintenances[$maintenanceId])) {

                $maintenances[$maintenanceId] = [

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

                $maintenances[$maintenanceId]["asset"][] = [

                    "details_id" => $row["details_id"],

                    "asset_maintenance_id" => $row["asset_maintenance_id"],

                    "asset_master_id" => $row["asset_master_id"],

                    "rate" => $row["rate"],

                    "description" => $row["description"],

                    "name" => $row["name"]

                ];

            }

        }

        return array_values($maintenances);

    }


    public function create($data) {

        try {

            $this->connection->beginTransaction();


            $getNextCodeSql = "

            select concat(
                'MNT',
                lpad(coalesce(max(substring(code,4))+1,1),4,'0')
            ) AS maintenance_code

            from asset_maintenance

            ";

            $getNextCodeResult = $this->connection->prepare($getNextCodeSql);
            $getNextCodeResult->execute();

            $maintenanceCode = $getNextCodeResult->fetchColumn();


            $sql = "

            insert into asset_maintenance(

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

                ":code" => $maintenanceCode,

                ":date" => $data["date"] ?? null,

                ":status" => $data["status"] ?? 1,

                ":added_date_time" => date("Y-m-d H:i:s"),

                ":modify_date_time" => $data["modify_date_time"] ?? null,

                ":delete_date_time" => $data["delete_date_time"] ?? null,

                ":added_user" => $data["added_user"] ?? null,

                ":modify_user" => $data["modify_user"] ?? null,

                ":delete_user" => $data["delete_user"] ?? null

            ]);


            $maintenanceId = $this->connection->lastInsertId();


            $sql = "

            insert into asset_maintenance_has_asset_master(

                asset_maintenance_id,
                asset_master_id,
                rate,
                description

            )

            values(

                :asset_maintenance_id,
                :asset_master_id,
                :rate,
                :description

            )

            ";

            $statement = $this->connection->prepare($sql);


            foreach ($data["asset"] as $asset) {

                $statement->execute([

                    ":asset_maintenance_id" => $maintenanceId,

                    ":asset_master_id" => $asset["asset_master_id"],

                    ":rate" => $asset["rate"] ?? null,

                    ":description" => $asset["description"] ?? null

                ]);

            }


            $this->connection->commit();

            return $maintenanceId;


        } catch (Throwable $error) {

            $this->connection->rollback();

            throw $error;

        }

    }


    public function update($id, $data) {

        try {

            $this->connection->beginTransaction();


            $sql = "

            update asset_maintenance set

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


            // Delete existing maintenance assets

            $sql = "

            delete from asset_maintenance_has_asset_master

            where asset_maintenance_id = :asset_maintenance_id

            ";

            $statement = $this->connection->prepare($sql);

            $statement->execute([

                ":asset_maintenance_id" => $id

            ]);


            // Insert updated maintenance assets

            $sql = "

            insert into asset_maintenance_has_asset_master(

                asset_maintenance_id,
                asset_master_id,
                rate,
                description

            )

            values(

                :asset_maintenance_id,
                :asset_master_id,
                :rate,
                :description

            )

            ";

            $statement = $this->connection->prepare($sql);


            foreach ($data["asset"] as $asset) {

                $statement->execute([

                    ":asset_maintenance_id" => $id,

                    ":asset_master_id" => $asset["asset_master_id"],

                    ":rate" => $asset["rate"],

                    ":description" => $asset["description"] ?? null

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

            update asset_maintenance set

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