import { connectionPool } from "@/app/api/_db/db";

export async function getKepsekDashboardData() {
    try {
        const res = await connectionPool.query(`
            WITH AttendanceSummary AS (
                SELECT 
                    k.nama_kelas,
                    COUNT(DISTINCT s.id) as total_siswa,
                    COUNT(DISTINCT CASE WHEN a.status = 'hadir' THEN a.id END) as total_hadir,
                    COUNT(DISTINCT CASE WHEN a.status IN ('sakit', 'izin') THEN a.id END) as total_izin,
                    COUNT(DISTINCT CASE WHEN a.status = 'alpha' THEN a.id END) as total_alpha,
                    mp.nama_mapel,
                    g.nama as nama_guru,
                    DATE(a.tanggal) as tanggal
                FROM "KELAS" k
                JOIN "SISWA" s ON s.kelas_id = k.id
                LEFT JOIN "ABSENSI" a ON a.siswa_id = s.id
                LEFT JOIN "JADWAL" j ON a.jadwal_id = j.id
                LEFT JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
                LEFT JOIN "GURU" g ON j.guru_id = g.id
                WHERE a.tanggal >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY k.nama_kelas, mp.nama_mapel, g.nama, DATE(a.tanggal)
            )
            SELECT 
                nama_kelas,
                nama_mapel,
                nama_guru,
                tanggal,
                total_siswa,
                total_hadir,
                total_izin,
                total_alpha,
                CAST(
                    ROUND(
                        (total_hadir::numeric * 100.0) / NULLIF(total_siswa, 0)
                    , 2) 
                AS DECIMAL(5,2)) as kehadiran_persen
            FROM AttendanceSummary
            ORDER BY tanggal DESC, nama_kelas
        `);
        return res.rows;
    } catch (err) {
        console.error('Error getting principal dashboard data:', err);
        throw err;
    }
}


export async function getKelasAndMapel() {
    try {
        const res = await connectionPool.query(`
            WITH ScheduleInfo AS (
                SELECT DISTINCT
                    k.id as kelas_id,
                    k.nama_kelas,
                    mp.nama_mapel,
                    STRING_AGG(
                        j.hari || ' (' || 
                        TO_CHAR(j.jam_mulai::time, 'HH24:MI') || '-' || 
                        TO_CHAR(j.jam_selesai::time, 'HH24:MI') || ')',
                        ', '
                        ORDER BY 
                            CASE 
                                WHEN j.hari = 'Senin' THEN 1
                                WHEN j.hari = 'Selasa' THEN 2
                                WHEN j.hari = 'Rabu' THEN 3
                                WHEN j.hari = 'Kamis' THEN 4
                                WHEN j.hari = 'Jumat' THEN 5
                            END
                    ) as jadwal,
                    g.nama as nama_guru,
                    COUNT(DISTINCT CASE WHEN a.status = 'hadir' THEN a.id END) as jumlah_hadir,
                    COUNT(DISTINCT CASE WHEN a.status = 'sakit' THEN a.id END) as jumlah_sakit,
                    COUNT(DISTINCT CASE WHEN a.status = 'izin' THEN a.id END) as jumlah_izin,
                    COUNT(DISTINCT CASE WHEN a.status = 'alpha' THEN a.id END) as jumlah_alpha
                FROM "KELAS" k
                JOIN "JADWAL" j ON j.kelas_id = k.id
                JOIN "MATA_PELAJARAN" mp ON mp.id = j.mata_pelajaran_id
                JOIN "GURU" g ON g.id = j.guru_id
                LEFT JOIN "ABSENSI" a ON a.jadwal_id = j.id
                GROUP BY k.id, k.nama_kelas, mp.nama_mapel, g.nama
                ORDER BY k.nama_kelas, mp.nama_mapel
            )
            SELECT * FROM ScheduleInfo
        `);
        return res.rows;
    } catch (err) {
        console.error('Error getting class and subject data:', err);
        throw err;
    }
}