import { Jadwal } from "@/definitions";
import { connectionPool } from "../../api/db";


/**
 * The function `getJadwal` retrieves and organizes schedule data by class and day from a database
 * using TypeScript and PostgreSQL.
 * @returns The `getJadwal` function returns grouped data of schedules based on class and day. The data
 * is grouped by class, then by day, and each day contains an array of schedule items including details
 * such as schedule ID, day, start time, end time, subject name, class name, teacher name, and academic
 * year name.
 */
export async function getJadwal() {
    
    const res = await connectionPool.query(`
    SELECT 
        jadwal.id,
        jadwal.hari,
        jadwal.jam_mulai,
        jadwal.jam_selesai,
        mata_pelajaran.nama_mapel AS mata_pelajaran,
        kelas.nama_kelas AS kelas,
        guru.nama AS guru,
        tahun_ajaran.nama AS tahun_ajaran
    FROM "JADWAL" jadwal
    JOIN "MATA_PELAJARAN" mata_pelajaran ON jadwal.mata_pelajaran_id = mata_pelajaran.id
    JOIN "KELAS" kelas ON jadwal.kelas_id = kelas.id
    JOIN "GURU" guru ON jadwal.guru_id = guru.id
    JOIN "TAHUN_AJARAN" tahun_ajaran ON jadwal.tahun_ajaran_id = tahun_ajaran.id
    ORDER BY kelas.nama_kelas, jadwal.hari, jadwal.jam_mulai;`);

    const groupedData = res.rows.reduce((acc: any, item: any) => {
        if (!acc[item.kelas]) {
            acc[item.kelas] = {};
        }
        if (!acc[item.kelas][item.hari]) {
            acc[item.kelas][item.hari] = [];
        }
        acc[item.kelas][item.hari].push(item);
        return acc;
    }, {});

    return groupedData;
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