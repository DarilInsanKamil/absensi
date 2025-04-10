import { Absensi } from "@/definitions";
import { connectionPool } from "../../api/db";

export async function getAbsensi() {
    const res = await connectionPool.query('SELECT * FROM "ABSENSI"');
    return res.rows;
}

export async function getAbsensiById(id: number) {
    const searchById = await connectionPool.query('SELECT * FROM "ABSENSI" WHERE id = $1', [id]);
    return searchById.rows;
}

export async function createAbsensi(absen: Absensi) {
    try {
        const { siswa_id, jadwal_id, guru_id, tanggal, status, keterangan} = absen

        const req = await connectionPool.query('INSERT INTO "ABSENSI" ("siswa_id", "jadwal_id", "guru_id", "tanggal", "status", "keterangan") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [siswa_id, jadwal_id, guru_id, tanggal, status, keterangan]);
        return req.rows;
    } catch (err) {
        console.error('Error inserting data into ABSENSI table', err);
        throw err;
    }
}

export async function deleteAbsensiById(id: number) {
    const req = await connectionPool.query('DELETE FROM "ABSENSI" WHERE id = $1', [id]);
    return req.rowCount !== null && req.rowCount > 0;
}


export async function updateAbsensiById(id: number, absen: Absensi) {
    try {
        const { siswa_id, jadwal_id, guru_id, tanggal, status, keterangan} = absen
        const req = await connectionPool.query('UPDATE "ABSENSI" SET "siswa_id" = $1, "jadwal_id" = $2, "guru_id" = $3, "tanggal" = $4, "status" = $5, "keterangan" = $6 WHERE id = $7 RETURNING *', [siswa_id, jadwal_id, guru_id, tanggal, status, keterangan, id]);
        return req.rows;
    } catch (err) {
        console.error('Error updating data in ABSENSI table', err);
        throw err;
    }
}