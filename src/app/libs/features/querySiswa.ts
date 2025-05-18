import { Siswa } from "@/definitions";
import { connectionPool } from "../../api/_db/db";


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

export const getMatpelBySiswa = async (id: string) => {
    const res = await connectionPool.query(`
      SELECT 
            jadwal.id AS jadwal_id,
            mata_pelajaran.nama_mapel,
            guru.nama AS nama_guru,
            jadwal.hari,
            jadwal.jam_mulai,
            jadwal.jam_selesai,
            COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as jumlah_hadir,
            COUNT(CASE WHEN a.status = 'sakit' THEN 1 END) as jumlah_sakit,
            COUNT(CASE WHEN a.status = 'izin' THEN 1 END) as jumlah_izin,
            COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as jumlah_alpha
        FROM "SISWA" siswa
        JOIN "JADWAL" jadwal ON jadwal.kelas_id = siswa.kelas_id
        JOIN "MATA_PELAJARAN" mata_pelajaran ON jadwal.mata_pelajaran_id = mata_pelajaran.id
        JOIN "GURU" guru ON jadwal.guru_id = guru.id
        LEFT JOIN "ABSENSI" a ON a.jadwal_id = jadwal.id AND a.siswa_id = siswa.id
        WHERE siswa.id = $1
        GROUP BY 
            jadwal.id,
            mata_pelajaran.nama_mapel,
            guru.nama,
            jadwal.hari,
            jadwal.jam_mulai,
            jadwal.jam_selesai
        ORDER BY jadwal.hari, jadwal.jam_mulai
`, [id])
    return res.rows;
}

export async function getAbsensiSiswaByJadwal(siswaId: string, jadwalId: number) {
    try {
        const res = await connectionPool.query(`
            SELECT 
                a.id as absensi_id,
                a.tanggal,
                a.status,
                a.keterangan,
                a.waktu_absen,
                m.nama_mapel,
                g.nama as nama_guru,
                j.hari,
                j.jam_mulai,
                j.jam_selesai
            FROM "ABSENSI" a
            JOIN "JADWAL" j ON a.jadwal_id = j.id
            JOIN "MATA_PELAJARAN" m ON j.mata_pelajaran_id = m.id
            JOIN "GURU" g ON j.guru_id = g.id
            WHERE a.siswa_id = $1 AND j.id = $2
            ORDER BY a.tanggal DESC
        `, [siswaId, jadwalId]);

        return res.rows;
    } catch (err) {
        console.error('Error getting student attendance:', err);
        throw err;
    }
}