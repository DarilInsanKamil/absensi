import { Siswa } from "@/definitions";
import { connectionPool } from "../../api/db";


export async function searchUsernameSiswa(username: string) {
    try {
        const result = await connectionPool.query(`SELECT id FROM "SISWA" WHERE nis = $1`, [username]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
        console.error('Error searching username in SISWA table', err);
        throw err;
    }
}

export async function getSiswa() {
    const result = await connectionPool.query(`
        SELECT 
            siswa.id,
            siswa.nis,
            siswa.nama,
            siswa.jenis_kelamin,
            siswa.tanggal_lahir,
            siswa.alamat,
            siswa.no_telepon,
            siswa.email,
            siswa.status_aktif,
            kelas.nama_kelas
        FROM "SISWA" siswa
        JOIN "KELAS" kelas ON siswa.kelas_id = kelas.id
    `);
    return result.rows;
}

export async function createSiswa(siswa: Siswa) {
    const { nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, status_aktif } = siswa;
    const result = await connectionPool.query('INSERT INTO "SISWA" ("nis", "nama", "jenis_kelamin", "tanggal_lahir", "alamat", "no_telepon", "email", "kelas_id", "status_aktif") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, status_aktif]);
    return result.rows;
}

export async function getSiswaById(id: string) {
    const result = await connectionPool.query('SELECT * FROM "SISWA" WHERE "id" = $1', [id]);
    return result.rows;
}

export async function deleteSiswaById(id: string) {
    const result = await connectionPool.query('DELETE FROM "SISWA" WHERE "id" = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
}

export async function updateSiswa(id: string, siswa: Siswa) {
    const { nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, status_aktif } = siswa;
    try {
        const result = await connectionPool.query('UPDATE "SISWA" SET "nis" = $1, "nama" = $2, "jenis_kelamin" = $3, "tanggal_lahir" = $4, "alamat" = $5, "no_telepon" = $6, "email" = $7, "kelas_id" = $8, "status_aktif" = $9 WHERE "id" = $10 RETURNING *', [nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, status_aktif, id]);
        return result.rows;
    } catch (err) {
        console.error('Error updating data in GURU table', err);
        throw err;
    }
}

export const getSiswaByKelasId = async (id: number) => {
    const getSiswa = await connectionPool.query(
        'SELECT * FROM "SISWA" WHERE kelas_id = $1',
        [id]
    );
    return getSiswa.rows;
};