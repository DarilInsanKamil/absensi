import { connectionPool } from "@/app/_db/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const jadwal_id = searchParams.get("jadwal_id");
    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");

    if (!jadwal_id || !bulan || !tahun) {
        return new Response(
            JSON.stringify({ error: "Missing required parameters" }),
            { status: 400 }
        );
    }

    try {
        const result = await connectionPool.query(`
    WITH RawAbsensi AS (
        SELECT 
            s.id as siswa_id,
            s.nama as nama_siswa,
            k.nama_kelas,
            j.id as jadwal_id,
            COUNT(DISTINCT a.tanggal) as jumlah_hari_absen,
            COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as hadir,
            COUNT(CASE WHEN a.status = 'izin' THEN 1 END) as izin,
            COUNT(CASE WHEN a.status = 'sakit' THEN 1 END) as sakit,
            COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as alpha
        FROM "SISWA" s
        JOIN "KELAS" k ON k.id = s.kelas_id
        JOIN "JADWAL" j ON j.kelas_id = k.id
        LEFT JOIN "ABSENSI" a ON (
            a.siswa_id = s.id 
            AND a.jadwal_id = j.id
            AND EXTRACT(MONTH FROM a.tanggal) = $2 
            AND EXTRACT(YEAR FROM a.tanggal) = $3
        )
        WHERE j.id = $1
        GROUP BY 
            s.id,
            s.nama,
            k.nama_kelas,
            j.id
        ORDER BY s.nama
    )
    SELECT 
        siswa_id,
        nama_siswa,
        nama_kelas,
        COALESCE(jumlah_hari_absen, 0) as jumlah_hari_absen,
        COALESCE(hadir, 0) as hadir,
        COALESCE(izin, 0) as izin,
        COALESCE(sakit, 0) as sakit,
        COALESCE(alpha, 0) as alpha
    FROM RawAbsensi
`, [jadwal_id, bulan, tahun]);

        console.log('Query params:', { jadwal_id, bulan, tahun });

        return new Response(JSON.stringify(result.rows));
    } catch (error) {
        console.error('Error fetching rekap absensi:', error);
        return new Response(
            JSON.stringify({
                error: "Internal server error",
                params: { jadwal_id, bulan, tahun }
            }),
            { status: 500 }
        );
    }
}