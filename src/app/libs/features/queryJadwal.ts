import { Jadwal } from "@/definitions";
import { connectionPool } from "../../api/db";



export async function getJadwal() {

    const res = await connectionPool.query(`
        SELECT
        jadwal.id,
        jadwal.hari,
        jadwal.jam_mulai,
        jadwal.jam_selesai,
        mata_pelajaran.nama_mapel as mata_pelajaran,
        guru.nama as nama_guru,
        tahun_ajaran.nama as tahun_ajaran,
        kelas.nama_kelas as kelas
        FROM "JADWAL" jadwal
        JOIN "GURU" guru ON jadwal.guru_id = guru.id
        JOIN "KELAS" kelas ON jadwal.kelas_id = kelas.id
        JOIN "TAHUN_AJARAN" tahun_ajaran ON jadwal.tahun_ajaran_id = tahun_ajaran.id
        JOIN "MATA_PELAJARAN" mata_pelajaran ON jadwal.mata_pelajaran_id = mata_pelajaran.id
    `)
    return res.rows;
}

export async function createJadwal(jadwal: Jadwal) {
    const { mata_pelajaran_id, kelas_id, guru_id, tahun_ajaran_id, hari, jam_mulai, jam_selesai } = jadwal
    try {
        const res = await connectionPool.query('INSERT INTO "JADWAL" ("mata_pelajaran_id", "kelas_id", "guru_id", "tahun_ajaran_id", "hari", "jam_mulai", "jam_selesai") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [mata_pelajaran_id, kelas_id, guru_id, tahun_ajaran_id, hari, jam_mulai, jam_selesai])
        return res.rows
    } catch (err) {
        console.error('Error inserting data into JADWAL table', err);
        throw err;
    }
}

export async function getJadwalById(id: number) {
    const search = await connectionPool.query('SELECT * FROM "JADWAL" WHERE "id" = $1', [id])
    return search.rows;
}

export async function deleteJadwalById(id: number) {
    const del = await connectionPool.query('DELETE FROM "JADWAL" WHERE "id" = $1', [id])
    return del.rowCount !== null && del.rowCount > 0;
}

export async function updateJadwalById(id: number, jadwal: Jadwal) {
    const { mata_pelajaran_id, kelas_id, guru_id, tahun_ajaran_id, hari, jam_mulai, jam_selesai } = jadwal
    try {
        const res = await connectionPool.query('UPDATE "JADWAL" SET "mata_pelajaran_id" = $1, "kelas_id" = $2, "guru_id" = $3, "tahun_ajaran_id" = $4, "hari" = $5, "jam_mulai" = $6, "jam_selesai" = $7 WHERE "id" = $8 RETURNING *', [mata_pelajaran_id, kelas_id, guru_id, tahun_ajaran_id, hari, jam_mulai, jam_selesai, id])
        return res.rows
    } catch (err) {
        console.error('Error updating data into JADWAL table', err);
        throw err;
    }
}