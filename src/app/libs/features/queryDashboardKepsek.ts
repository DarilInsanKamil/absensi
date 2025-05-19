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