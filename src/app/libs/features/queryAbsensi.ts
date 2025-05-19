import { Absensi } from "@/definitions";
import { connectionPool } from "../../api/_db/db";

export async function getRekapAbsensi(bulan: number, tahun: number, kelas_id: number) {
    const res = await connectionPool.query(`
    SELECT 
        s.id AS siswa_id,
        s.nama AS nama_siswa,
        COUNT(a.id) AS jumlah_hari_absen,
        COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) AS hadir,
        COUNT(CASE WHEN a.status = 'izin' THEN 1 END) AS izin,
        COUNT(CASE WHEN a.status = 'sakit' THEN 1 END) AS sakit,
        COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) AS alpha,
        k.nama_kelas,
        mp.nama_mapel
    FROM "SISWA" s
    LEFT JOIN "ABSENSI" a ON a.siswa_id = s.id 
    JOIN "KELAS" k ON s.kelas_id = k.id
    LEFT JOIN "JADWAL" j ON a.jadwal_id = j.id
    LEFT JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
    WHERE s.kelas_id = $3 
    AND EXTRACT(MONTH FROM a.tanggal) = $1::int 
    AND EXTRACT(YEAR FROM a.tanggal) = $2::int
    GROUP BY s.id, s.nama, k.nama_kelas, mp.nama_mapel
    ORDER BY s.nama`, [bulan, tahun, kelas_id])
    return res.rows;
}

export async function getAbsensiHarianByKelasAndGuru(kelasId: number, guruId: number) {
    const res = await connectionPool.query(`
    SELECT 
      a.id, a.tanggal, a.status, a.keterangan, 
      j.hari, j.jam_mulai, j.jam_selesai, 
      m.nama_mapel
    FROM "ABSENSI" a
    JOIN "JADWAL" j ON a.jadwal_id = j.id
    JOIN "MATA_PELAJARAN" m ON j.mata_pelajaran_id = m.id
    WHERE j.guru_id = $1 AND j.kelas_id = $2
    ORDER BY a.tanggal DESC
  `, [guruId, kelasId]);

    return res.rows;
}

export async function getAbsensiByDate(jadwalId: number, tanggal: string) {
    try {
        const res = await connectionPool.query(`
            SELECT 
                a.id as absensi_id,
                a.siswa_id,
                a.status,
                a.keterangan,
                s.nama as nama_siswa,
                s.nis,
                k.nama_kelas,
                mp.nama_mapel
            FROM "ABSENSI" a
            JOIN "SISWA" s ON a.siswa_id = s.id
            JOIN "JADWAL" j ON a.jadwal_id = j.id
            JOIN "KELAS" k ON j.kelas_id = k.id
            JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
            WHERE j.id = $1 
            AND DATE(a.tanggal) = $2::date
            ORDER BY s.nama ASC
        `, [jadwalId, tanggal]);
        
        return res.rows;
    } catch (err) {
        console.error('Error getting attendance by date:', err);
        throw err;
    }
}

export async function getAbsensiHistory(jadwalId: number, guruId: number) {
    try {
        const res = await connectionPool.query(`
            SELECT DISTINCT
                a.tanggal,
                COUNT(DISTINCT s.id) as total_siswa,
                COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as jumlah_hadir,
                COUNT(CASE WHEN a.status = 'sakit' THEN 1 END) as jumlah_sakit,
                COUNT(CASE WHEN a.status = 'izin' THEN 1 END) as jumlah_izin,
                COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as jumlah_alpha,
                k.nama_kelas,
                mp.nama_mapel,
                j.jam_mulai,
                j.jam_selesai
            FROM "ABSENSI" a
            JOIN "JADWAL" j ON a.jadwal_id = j.id
            JOIN "KELAS" k ON j.kelas_id = k.id
            JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
            JOIN "SISWA" s ON a.siswa_id = s.id
            WHERE j.id = $1 AND a.guru_id = $2
            GROUP BY a.tanggal, k.nama_kelas, mp.nama_mapel, j.jam_mulai, j.jam_selesai
            ORDER BY a.tanggal DESC
        `, [jadwalId, guruId]);

        return res.rows;
    } catch (err) {
        console.error('Error getting attendance history:', err);
        throw err;
    }
}


export async function getAbsensi() {
    const res = await connectionPool.query(`
        SELECT 
                a.id,
                a.tanggal,
                a.status,
                a.keterangan,
                a.waktu_absen,
                s.nama as nama_siswa,
                s.nis,
                k.nama_kelas,
                g.nama as nama_guru,
                ta.nama as tahun_ajaran
            FROM "ABSENSI" a
            JOIN "SISWA" s ON a.siswa_id = s.id
            JOIN "JADWAL" j ON a.jadwal_id = j.id
            JOIN "KELAS" k ON j.kelas_id = k.id
            JOIN "GURU" g ON a.guru_id = g.id
            JOIN "TAHUN_AJARAN" ta ON k.tahun_ajaran_id = ta.id
            ORDER BY a.tanggal DESC, k.nama_kelas ASC, s.nama ASC
        `);
    return res.rows;
}

export async function getAbsensiById(id: string) {
    const searchById = await connectionPool.query('SELECT * FROM "ABSENSI" WHERE id = $1', [id]);
    return searchById.rows;
}

export async function createAbsensi(absen: Absensi) {
    try {
        const { siswa_id, jadwal_id, guru_id, tanggal, status, keterangan } = absen

        const req = await connectionPool.query('INSERT INTO "ABSENSI" ("siswa_id", "jadwal_id", "guru_id", "tanggal", "status", "keterangan") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [siswa_id, jadwal_id, guru_id, tanggal, status, keterangan]);
        return req.rows;
    } catch (err) {
        console.error('Error inserting data into ABSENSI table', err);
        throw err;
    }
}

export async function deleteAbsensiById(id: number) {
    const req = await connectionPool.query('DELETE FROM "ABSENSI" WHERE id = $1', [id]);
    return req.rowCount !== null && req.rowCount > 0;
}


export async function updateAbsensiById(id: number, absen: Absensi) {
    try {
        const { siswa_id, jadwal_id, guru_id, tanggal, status, keterangan } = absen
        const req = await connectionPool.query('UPDATE "ABSENSI" SET "siswa_id" = $1, "jadwal_id" = $2, "guru_id" = $3, "tanggal" = $4, "status" = $5, "keterangan" = $6 WHERE id = $7 RETURNING *', [siswa_id, jadwal_id, guru_id, tanggal, status, keterangan, id]);
        return req.rows;
    } catch (err) {
        console.error('Error updating data in ABSENSI table', err);
        throw err;
    }
}

export async function getSiswaByNamaKelas(id: string) {
    try {
        const req = await connectionPool.query(`
                 SELECT 
                s.id,
                s.nama,
                s.nis,
                k.nama_kelas,
                ta.nama as tahun_ajaran
            FROM "SISWA" s
            JOIN "KELAS" k ON s.kelas_id = k.id
            JOIN "TAHUN_AJARAN" ta ON k.tahun_ajaran_id = ta.id
            WHERE k.nama_kelas = $1
            ORDER BY s.nama ASC
        `, [id])
        return req.rows
    } catch (err) {
        console.error('Error get data in Siswa absensi table', err);
        throw err;
    }
}



export async function getAbsensiAdmin() {
    try {
        const res = await connectionPool.query(`
            SELECT 
                a.id,
                a.tanggal,
                s.nama as nama_siswa,
                s.nis,
                k.nama_kelas,
                mp.nama_mapel,
                g.nama as nama_guru,
                a.status,
                a.keterangan
            FROM "ABSENSI" a
            JOIN "SISWA" s ON a.siswa_id = s.id
            JOIN "JADWAL" j ON a.jadwal_id = j.id
            JOIN "KELAS" k ON j.kelas_id = k.id
            JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
            JOIN "GURU" g ON j.guru_id = g.id
            ORDER BY a.tanggal DESC, k.nama_kelas, s.nama
        `);
        return res.rows;
    } catch (err) {
        console.error('Error getting admin attendance:', err);
        throw err;
    }
}