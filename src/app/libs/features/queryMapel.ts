import { Mapel } from "@/definitions";
import { connectionPool } from "../../_db/db";

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


export async function getMapelSiswa(siswa_id: string) {
  const res = await connectionPool.query(`
    WITH ScheduleInfo AS (
      SELECT 
        mp.id as mapel_id,
        j.id as jadwal_id,
        mp.nama_mapel,
        g.nama as nama_guru,
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
      JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
      JOIN "GURU" g ON j.guru_id = g.id
      JOIN "KELAS" k ON j.kelas_id = k.id
      JOIN "SISWA" s ON s.kelas_id = k.id
      WHERE s.id = $1
      ORDER BY hari_urut, j.jam_mulai
    )
    SELECT 
      mapel_id,
      jadwal_id,
      nama_mapel,
      nama_guru,
      hari,
      jam
    FROM ScheduleInfo
  `, [siswa_id]);
  return res.rows;
}