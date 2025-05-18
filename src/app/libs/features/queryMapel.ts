import { Mapel } from "@/definitions";
import { connectionPool } from "../../api/_db/db";

export async function getMapel() {
    const result = await connectionPool.query('SELECT * FROM "MATA_PELAJARAN"');
    return result.rows;
}

export async function getMapelById(id: number) {
    const result = await connectionPool.query('SELECT * FROM "MATA_PELAJARAN" WHERE "id" = $1', [id]);
    return result.rows[0];
}

export async function createMapel(mapel: Mapel) {
    try {
        const { kode_mapel, nama_mapel } = mapel;
        const result = await connectionPool.query('INSERT INTO "MATA_PELAJARAN" ("kode_mapel", "nama_mapel") VALUES ($1, $2) RETURNING *', [kode_mapel, nama_mapel]);
        return result.rows;
    } catch (err) {
        console.error('Error inserting data into MATA_PELAJARAN table', err);
        throw err;
    }
}

export async function updateMapelById(id: number, mapel: Mapel) {
    const { kode_mapel, nama_mapel } = mapel;
    try {
        const result = await connectionPool.query('UPDATE "MATA_PELAJARAN" SET "kode_mapel" = $1, "nama_mapel" = $2 WHERE "id" = $3 RETURNING *', [kode_mapel, nama_mapel, id]);
        return result.rows;
    } catch (err) {
        console.error('Error updating data in MATA_PELAJARAN table', err);
        throw err;
    }
}


export async function deleteMapelById(id: number) {
    const result = await connectionPool.query('DELETE FROM "MATA_PELAJARAN" WHERE "id" = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
}   