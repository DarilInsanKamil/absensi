import { connectionPool } from "@/app/_db/db";

export async function isWaliKelas(guruId: string) {
  try {
    const result = await connectionPool.query(`
      SELECT id, nama_kelas 
      FROM "KELAS" 
      WHERE walikelas_id = $1
    `, [guruId]);
    
    return {
      isWaliKelas: result.rows.length > 0,
      kelasData: result.rows[0] || null
    };
  } catch (err) {
    console.error('Error checking wali kelas status:', err);
    throw err;
  }
}


interface SiswaData {
  id: string;
  nama: string;
  nis: string;
  nama_kelas: string;
  attendance_percentage: number;
}

interface SubjectAttendance {
  mapel_id: string;
  nama_mapel: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  percentage: number;
}

interface AbsenceHistory {
  id: string;
  tanggal: string;
  nama_mapel: string;
  status: string;
  keterangan: string | null;
}

export async function getSiswaById(siswaId: string): Promise<SiswaData> {
  const result = await connectionPool.query(`
    SELECT 
      s.id,
      s.nama,
      s.nis,
      k.nama_kelas,
      ROUND(
        (COUNT(CASE WHEN a.status = 'hadir' THEN 1 END)::float / 
        COUNT(*)::float * 100)::numeric, 2
      ) as attendance_percentage
    FROM "SISWA" s
    JOIN "KELAS" k ON s.kelas_id = k.id
    LEFT JOIN "ABSENSI" a ON s.id = a.siswa_id
    WHERE s.id = $1
    GROUP BY s.id, s.nama, s.nis, k.nama_kelas
  `, [siswaId]);

  return result.rows[0];
}

export async function getSiswaAttendanceBySubject(siswaId: string): Promise<SubjectAttendance[]> {
  const result = await connectionPool.query(`
    SELECT 
      mp.id as mapel_id,
      mp.nama_mapel,
      COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as hadir,
      COUNT(CASE WHEN a.status = 'sakit' THEN 1 END) as sakit,
      COUNT(CASE WHEN a.status = 'izin' THEN 1 END) as izin,
      COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as alpha,
      ROUND(
        (COUNT(CASE WHEN a.status = 'hadir' THEN 1 END)::float / 
        COUNT(*)::float * 100)::numeric, 2
      ) as percentage
    FROM "MATA_PELAJARAN" mp
    JOIN "JADWAL" j ON mp.id = j.mata_pelajaran_id
    LEFT JOIN "ABSENSI" a ON j.id = a.jadwal_id AND a.siswa_id = $1
    WHERE j.kelas_id = (SELECT kelas_id FROM "SISWA" WHERE id = $1)
    GROUP BY mp.id, mp.nama_mapel
    ORDER BY mp.nama_mapel
  `, [siswaId]);

  return result.rows;
}

export async function getSiswaAbsenceHistory(siswaId: string): Promise<AbsenceHistory[]> {
  const result = await connectionPool.query(`
    SELECT 
      a.id,
      a.tanggal,
      mp.nama_mapel,
      a.status,
      a.keterangan
    FROM "ABSENSI" a
    JOIN "JADWAL" j ON a.jadwal_id = j.id
    JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
    WHERE a.siswa_id = $1
    AND a.status != 'hadir'
    ORDER BY a.tanggal DESC
  `, [siswaId]);

  return result.rows;
}