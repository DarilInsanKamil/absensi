import { Guru, UpdatedGuru } from "@/definitions";
import { connectionPool } from "../../api/db";

export async function getGuru() {
    const result = await connectionPool.query('SELECT * FROM "GURU"');
    return result.rows;
}

export async function getGuruById(id: number) {
    const result = await connectionPool.query('SELECT * FROM "GURU" WHERE "id" = $1', [id]);
    return result.rows;
}

export async function createGuru(guru: Guru) {
    const { nip, nama, jenis_kelamin, alamat, no_telepon, email, username, hashedPassword } = guru;
    try {
        const result = await connectionPool.query('INSERT INTO "GURU" ("nip", "nama", "jenis_kelamin", "alamat", "no_telepon", "email", "username", "password") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [nip, nama, jenis_kelamin, alamat, no_telepon, email, username, hashedPassword]);
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
    const { nip, nama, jenis_kelamin, alamat, no_telepon, email, username, password } = guru;
    try {
        const result = await connectionPool.query('UPDATE "GURU" SET "nip" = $1, "nama" = $2, "jenis_kelamin" = $3, "alamat" = $4, "no_telepon" = $5, "email" = $6, "username" = $7, "password" = $8 WHERE "id" = $9 RETURNING *', [nip, nama, jenis_kelamin, alamat, no_telepon, email, username, password, id]);
        return result.rows;
    } catch (err) {
        console.error('Error updating data in GURU table', err);
        throw err;
    }
}