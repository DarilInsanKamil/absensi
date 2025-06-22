import { Jadwal } from "@/definitions";
import { connectionPool } from "../../_db/db";



export async function getJadwal() {

    const res = await connectionPool.query(`
        SELECT
        jadwal.id,
        jadwal.hari,
        jadwal.jam_mulai,
        jadwal.guru_id,
        jadwal.kelas_id,
        jadwal.mata_pelajaran_id,
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
        ORDER BY jadwal.id
    `)
    return res.rows;
}

// export async function getKelasByGuruId(id_guru: number) {
//     const res = await connectionPool.query(`
//     WITH ScheduleInfo AS (
//         SELECT 
//             k.nama_kelas,
//             mp.nama_mapel,
//             j.id as jadwal_id,
//             j.hari,
//             TO_CHAR(j.jam_mulai::time, 'HH24:MI') || '-' || 
//             TO_CHAR(j.jam_selesai::time, 'HH24:MI') as jam,
//             CASE 
//                 WHEN j.hari = 'Senin' THEN 1
//                 WHEN j.hari = 'Selasa' THEN 2
//                 WHEN j.hari = 'Rabu' THEN 3
//                 WHEN j.hari = 'Kamis' THEN 4
//                 WHEN j.hari = 'Jumat' THEN 5
//             END as hari_urut
//         FROM "JADWAL" j
//         JOIN "KELAS" k ON k.id = j.kelas_id
//         JOIN "MATA_PELAJARAN" mp ON mp.id = j.mata_pelajaran_id
//         WHERE j.guru_id = $1
//     )
//     SELECT 
//         s.jadwal_id as id,
//         s.nama_kelas,
//         s.nama_mapel,
//         s.hari || ' (' || s.jam || ')' as jadwal
//     FROM ScheduleInfo s
//     ORDER BY 
//         s.nama_kelas,
//         s.nama_mapel,
//         s.hari_urut,
//         s.jam
//     `, [id_guru]);
//     return res.rows;
// }


export async function getKelasByGuruId(id_guru: number) {
    const res = await connectionPool.query(`
        WITH ScheduleInfo AS (
            SELECT 
                k.id as kelas_id,
                k.nama_kelas,
                mp.id as mata_pelajaran_id,
                mp.nama_mapel,
                j.id as jadwal_id,
                j.hari,
                TO_CHAR(j.jam_mulai::time, 'HH24:MI') || '-' || 
                TO_CHAR(j.jam_selesai::time, 'HH24:MI') as jam,
                CASE 
                    WHEN j.hari = 'Senin' THEN 1
                    WHEN j.hari = 'Selasa' THEN 2
                    WHEN j.hari = 'Rabu' THEN 3
                    WHEN j.hari = 'Kamis' THEN 4
                    WHEN j.hari = 'Jumat' THEN 5
                END as hari_urut
            FROM "JADWAL" j
            JOIN "KELAS" k ON k.id = j.kelas_id
            JOIN "MATA_PELAJARAN" mp ON mp.id = j.mata_pelajaran_id
            WHERE j.guru_id = $1
            ORDER BY 
                k.nama_kelas,
                hari_urut,
                j.jam_mulai
        )
        SELECT 
            jadwal_id as id,
            kelas_id,
            mata_pelajaran_id, 
            nama_kelas,
            nama_mapel,
            hari,
            jam
        FROM ScheduleInfo
    `, [id_guru]);
    return res.rows;
}


export async function getJadwalByGuruId(guru_id: number, hari: string) {

    const res = await connectionPool.query(`
        SELECT
    jadwal.id,
    jadwal.hari,
    jadwal.jam_mulai,
    jadwal.jam_selesai,
    mata_pelajaran.nama_mapel AS mata_pelajaran,
    guru.nama AS nama_guru,
    tahun_ajaran.nama AS tahun_ajaran,
    kelas.nama_kelas AS kelas
FROM "JADWAL" jadwal
JOIN "GURU" guru ON jadwal.guru_id = guru.id
JOIN "KELAS" kelas ON jadwal.kelas_id = kelas.id
JOIN "TAHUN_AJARAN" tahun_ajaran ON jadwal.tahun_ajaran_id = tahun_ajaran.id
JOIN "MATA_PELAJARAN" mata_pelajaran ON jadwal.mata_pelajaran_id = mata_pelajaran.id
WHERE
    jadwal.guru_id = $1 
    AND jadwal.hari ILIKE $2
ORDER BY jadwal.jam_mulai ASC;
`, [guru_id, hari])
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
    const search = await connectionPool.query(`
   SELECT
        jadwal.id,
        jadwal.hari,
        jadwal.jam_mulai,
        jadwal.guru_id,
        jadwal.kelas_id,
        jadwal.tahun_ajaran_id,
        jadwal.mata_pelajaran_id,
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
WHERE jadwal.id = $1`, [id])
    return search.rows[0];
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

export async function getSiswaByJadwalId(id: number) {
    const req = await connectionPool.query(`
        SELECT
  siswa.id,
  siswa.nama,
  siswa.nis,
  siswa.jenis_kelamin
FROM "SISWA" siswa
JOIN "KELAS" kelas ON siswa.kelas_id = kelas.id
JOIN "JADWAL" jadwal ON kelas.id = jadwal.kelas_id
WHERE jadwal.id = $1
  AND siswa.status_aktif = TRUE
ORDER BY siswa.nama ASC;
        `, [id])
    return req.rows
}

export async function getJadwalGuru(guru_id: number) {
    const res = await connectionPool.query(`
        SELECT
            jadwal.id,
            jadwal.hari,
            jadwal.jam_mulai,
            jadwal.jam_selesai,
            mata_pelajaran.nama_mapel AS mata_pelajaran,
            guru.nama AS nama_guru,
            tahun_ajaran.nama AS tahun_ajaran,
            kelas.nama_kelas AS kelas
        FROM "JADWAL" jadwal
        JOIN "GURU" guru ON jadwal.guru_id = guru.id
        JOIN "KELAS" kelas ON jadwal.kelas_id = kelas.id
        JOIN "TAHUN_AJARAN" tahun_ajaran ON jadwal.tahun_ajaran_id = tahun_ajaran.id
        JOIN "MATA_PELAJARAN" mata_pelajaran ON jadwal.mata_pelajaran_id = mata_pelajaran.id
        WHERE jadwal.guru_id = $1
        ORDER BY 
            CASE 
                WHEN jadwal.hari = 'Senin' THEN 1
                WHEN jadwal.hari = 'Selasa' THEN 2
                WHEN jadwal.hari = 'Rabu' THEN 3
                WHEN jadwal.hari = 'Kamis' THEN 4
                WHEN jadwal.hari = 'Jumat' THEN 5
            END,
            jadwal.jam_mulai;
    `, [guru_id]);
    return res.rows;
}



export async function getJadwalSiswaForBK(kelasId?: string, mapelId?: string) {
    let query = `
        SELECT
            jadwal.id,
            jadwal.hari,
            jadwal.jam_mulai,
            jadwal.guru_id,
            jadwal.kelas_id,
            jadwal.mata_pelajaran_id,
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
        WHERE 1=1
    `;

    const params: any[] = [];

    if (kelasId) {
        params.push(kelasId);
        query += ` AND jadwal.kelas_id = $${params.length}`;
    }

    if (mapelId) {
        params.push(mapelId);
        query += ` AND jadwal.mata_pelajaran_id = $${params.length}`;
    }

    const res = await connectionPool.query(query, params);
    return res.rows;
}