import { Kelas } from "@/definitions";
import { connectionPool } from "../../api/db";

export async function getAllKelas() {
    const result = await connectionPool.query(`
    SELECT 
        kelas.id,
        kelas.nama_kelas,
        guru.nama as wali_kelas,
        tahun_ajaran.nama as tahun_ajaran
    FROM "KELAS" kelas
    LEFT JOIN "GURU" guru ON kelas.walikelas_id = guru.id
    LEFT JOIN "TAHUN_AJARAN" tahun_ajaran ON kelas.tahun_ajaran_id = tahun_ajaran.id
    `);
    return result.rows;
}

export async function getKelasById(id: number) {
    const res = await connectionPool.query('SELECT * FROM "KELAS" WHERE "id" =$1', [id])
    return res.rows
}

export async function deleteKelasById(id: number) {
    const res = await connectionPool.query('DELETE FROM "KELAS" WHERE "id" = $1', [id]);
    return res.rowCount !== null && res.rowCount > 0;
}

export async function createKelas(kelas: Kelas) {
    const { nama_kelas, tahun_ajaran_id, walikelas_id } = kelas;
    try {
        const result = await connectionPool.query('INSERT INTO "KELAS" ("nama_kelas", "tahun_ajaran_id", "walikelas_id") VALUES ($1, $2, $3) RETURNING *', [nama_kelas, tahun_ajaran_id, walikelas_id]);
        return result.rows;
    } catch (err) {
        console.error('Error inserting data into KELAS table', err);
        throw err;
    }
}

export async function updateKelasById(id: number, kelas: Kelas) {
    const { nama_kelas, tahun_ajaran_id, walikelas_id } = kelas;
    try {
        const result = await connectionPool.query('UPDATE "KELAS" SET "nama_kelas" = $1, "tahun_ajaran_id" = $2, "walikelas_id" = $3 WHERE "id" = $4 RETURNING *', [nama_kelas, tahun_ajaran_id, walikelas_id, id]);
        return result.rows;
    } catch (err) {
        console.error('Error updating data in KELAS table', err);
        throw err;
    }
}