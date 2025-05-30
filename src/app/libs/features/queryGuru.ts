import { Guru, UpdatedGuru } from "@/definitions";
import { connectionPool } from "../../_db/db";

export async function searchUsernameGuru(username: string) {
    try {
        const result = await connectionPool.query(`SELECT id FROM "GURU" WHERE nip = $1`, [username]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
        console.error('Error searching username in GURU table', err);
        throw err;
    }
}

export async function getGuru() {
    const result = await connectionPool.query('SELECT * FROM "GURU"');
    return result.rows;
}

export async function getGuruById(id: number) {
    const result = await connectionPool.query(`
        SELECT g.*, k.nama_kelas
        FROM "GURU" g
        LEFT JOIN "KELAS" k ON k.walikelas_id = g.id
        WHERE g.id = $1`, [id]);
    return result.rows;
}

export async function createGuru(guru: Guru) {
    const { nip, nama, jenis_kelamin, alamat, no_telepon, email } = guru;
    try {
        const result = await connectionPool.query('INSERT INTO "GURU" ("nip", "nama", "jenis_kelamin", "alamat", "no_telepon", "email") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [nip, nama, jenis_kelamin, alamat, no_telepon, email]);
        return result.rows;
    } catch (err) {
        console.error('Error inserting data into GURU table', err);
        throw err;
    }
}

export async function deleteGuruById(id: number) {
    const result = await connectionPool.query('DELETE FROM "GURU" WHERE "id" = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
}

export async function updateGuru(id: number, guru: UpdatedGuru) {
    const { nip, nama, jenis_kelamin, alamat, no_telepon, email } = guru;
    try {
        const result = await connectionPool.query('UPDATE "GURU" SET "nip" = $1, "nama" = $2, "jenis_kelamin" = $3, "alamat" = $4, "no_telepon" = $5, "email" = $6 WHERE "id" = $7 RETURNING *', [nip, nama, jenis_kelamin, alamat, no_telepon, email, id]);
        return result.rows;
    } catch (err) {
        console.error('Error updating data in GURU table', err);
        throw err;
    }
}