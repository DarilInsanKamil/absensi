import { TahunAjaran } from "@/definitions";
import { connectionPool } from "../../_db/db";

export async function getTahunAjaran() {
    const res = await connectionPool.query('SELECT * FROM "TAHUN_AJARAN"');
    return res.rows
}

export async function getTahunAjaranById(id: number) {
    const result = await connectionPool.query('SELECT * FROM "TAHUN_AJARAN" WHERE "id" = $1 ', [id])
    return result.rows
}

export async function createTahunAjaran(tahunAjaran: TahunAjaran) {
    const { nama, tanggal_mulai, tanggal_selesai, status_aktif } = tahunAjaran
    try {
        const req = await connectionPool.query('INSERT INTO "TAHUN_AJARAN" ("nama", "tanggal_mulai", "tanggal_selesai", "status_aktif") VALUES ($1,$2,$3,$4) RETURNING *', [nama, tanggal_mulai, tanggal_selesai, status_aktif])
        return req.rows
    } catch (err) {
        console.error("Error while creating", err)
        throw err
    }
}

export async function updateTahunAjaranById(id: number, tahunAjaran: TahunAjaran) {
    const { nama, tanggal_mulai, tanggal_selesai, status_aktif } = tahunAjaran
    try {
        const req = await connectionPool.query('UPDATE "TAHUN_AJARAN" SET "nama" = $1, "tanggal_mulai" = $2, "tanggal_selesai" = $3, "status_aktif" = $4 WHERE "id" = $5 RETURNING *', [nama, tanggal_mulai, tanggal_selesai, status_aktif, id])
        return req.rows
    } catch (err) {
        console.error("Error while updating data", err)
        throw err
    }
}

export async function deleteTahunAjaranById(id: number) {
    try {
        const req = await connectionPool.query('DELETE FROM "TAHUN_AJARAN" WHERE "id" = $1', [id])
        return req.rowCount !== null && req.rowCount > 0;
    } catch (err) {
        console.error("Error while deleting data", err)
        throw err
    }
}