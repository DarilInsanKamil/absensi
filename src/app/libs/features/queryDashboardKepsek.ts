import { connectionPool } from "@/app/_db/db";

export async function getKepsekDashboardData() {
  try {
    const result = await connectionPool.query(`
      WITH ClassAttendance AS (
        SELECT 
          k.id as kelas_id,
          k.nama_kelas,
          COUNT(DISTINCT s.id) as total_siswa,
          -- Daily stats (today)
          SUM(CASE 
            WHEN DATE(a.tanggal) = CURRENT_DATE AND a.status = 'hadir' THEN 1 
            ELSE 0 
          END) as jumlah_hadir_today,
          -- Monthly stats
          COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as jumlah_hadir,
          COUNT(CASE WHEN a.status = 'sakit' THEN 1 END) as jumlah_sakit,
          COUNT(CASE WHEN a.status = 'izin' THEN 1 END) as jumlah_izin,
          COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as jumlah_alpha,
          -- Calculate monthly attendance percentage
          ROUND(
            (COUNT(CASE WHEN a.status = 'hadir' THEN 1 END)::float / 
            NULLIF(COUNT(a.id), 0)::float * 100)::numeric, 
            1
          ) as kehadiran_persen
        FROM "KELAS" k
        LEFT JOIN "SISWA" s ON s.kelas_id = k.id
        LEFT JOIN "ABSENSI" a ON a.siswa_id = s.id
        WHERE DATE(a.tanggal) >= DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY k.id, k.nama_kelas
      )
      SELECT 
        ca.*,
        (
          SELECT COUNT(DISTINCT s2.id) 
          FROM "SISWA" s2
          JOIN "ABSENSI" a2 ON a2.siswa_id = s2.id
          WHERE s2.kelas_id = ca.kelas_id
          AND a2.status = 'alpha'
          AND DATE(a2.tanggal) >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY s2.id
          HAVING COUNT(*) >= 5
        ) as problem_students_count
      FROM ClassAttendance ca
      ORDER BY ca.kehadiran_persen DESC
    `);

    return result.rows;
  } catch (error) {
    console.error('Error in getKepsekDashboardData:', error);
    throw error;
  }
}

//versi lama
// export async function getKepsekDashboardData() {
//     try {
//         const res = await connectionPool.query(`
//             WITH AttendanceSummary AS (
//                 SELECT 
//                     k.nama_kelas,
//                     COUNT(DISTINCT s.id) as total_siswa,
//                     COUNT(DISTINCT CASE WHEN a.status = 'hadir' THEN a.id END) as total_hadir,
//                     COUNT(DISTINCT CASE WHEN a.status IN ('sakit', 'izin') THEN a.id END) as total_izin,
//                     COUNT(DISTINCT CASE WHEN a.status = 'alpha' THEN a.id END) as total_alpha,
//                     mp.nama_mapel,
//                     g.nama as nama_guru,
//                     DATE(a.tanggal) as tanggal
//                 FROM "KELAS" k
//                 JOIN "SISWA" s ON s.kelas_id = k.id
//                 LEFT JOIN "ABSENSI" a ON a.siswa_id = s.id
//                 LEFT JOIN "JADWAL" j ON a.jadwal_id = j.id
//                 LEFT JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
//                 LEFT JOIN "GURU" g ON j.guru_id = g.id
//                 WHERE a.tanggal >= CURRENT_DATE - INTERVAL '30 days'
//                 GROUP BY k.nama_kelas, mp.nama_mapel, g.nama, DATE(a.tanggal)
//             )
//             SELECT 
//                 nama_kelas,
//                 nama_mapel,
//                 nama_guru,
//                 tanggal,
//                 total_siswa,
//                 total_hadir,
//                 total_izin,
//                 total_alpha,
//                 CAST(
//                     ROUND(
//                         (total_hadir::numeric * 100.0) / NULLIF(total_siswa, 0)
//                     , 2) 
//                 AS DECIMAL(5,2)) as kehadiran_persen
//             FROM AttendanceSummary
//             ORDER BY tanggal DESC, nama_kelas
//         `);
//         return res.rows;
//     } catch (err) {
//         console.error('Error getting principal dashboard data:', err);
//         throw err;
//     }
// }


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


export async function getKelasAbsentDetails(kelasId: number) {
    try {
        const res = await connectionPool.query(`
            WITH AbsensiPerSiswa AS (
                SELECT 
                    s.id as siswa_id,
                    s.nama as nama_siswa,
                    s.nis,
                    k.nama_kelas,
                    
                    COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as total_alpha,
                    COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as total_hadir,
                    COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as total_sakit,
                    COUNT(CASE WHEN a.status = 'izin' THEN 1 END) as total_izin,

                    STRING_AGG(
                        DISTINCT mp.nama_mapel || ' (' || TO_CHAR(a.tanggal, 'DD Mon YYYY') || ')',
                        ', '
                        ORDER BY mp.nama_mapel || ' (' || TO_CHAR(a.tanggal, 'DD Mon YYYY') || ')'
                    ) as detail_alpha
                FROM "SISWA" s
                JOIN "KELAS" k ON k.id = s.kelas_id
                LEFT JOIN "ABSENSI" a ON a.siswa_id = s.id  
                LEFT JOIN "JADWAL" j ON j.id = a.jadwal_id
                LEFT JOIN "MATA_PELAJARAN" mp ON mp.id = j.mata_pelajaran_id
                WHERE s.kelas_id = $1 
                GROUP BY s.id, s.nama, s.nis, k.nama_kelas
            )
            SELECT *
            FROM AbsensiPerSiswa
            ORDER BY 
                total_alpha DESC,
                nama_siswa ASC
        `, [kelasId]);
        return res.rows;
    } catch (err) {
        console.error('Error getting class absence details:', err);
        throw err;
    }
}

export async function getKelasAbsentDetailsBk(kelasId: number) {
    try {
        const res = await connectionPool.query(`
            WITH AbsensiPerSiswa AS (
                SELECT 
                    s.id as siswa_id,
                    s.nama as nama_siswa,
                    s.nis,
                    k.nama_kelas,
                    
                    COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as total_alpha,
                    COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as total_hadir,
                    COUNT(CASE WHEN a.status = 'izin' THEN 1 END) as total_izin,

                    STRING_AGG(
                        DISTINCT mp.nama_mapel || ' (' || TO_CHAR(a.tanggal, 'DD Mon YYYY') || ')',
                        ', '
                        ORDER BY mp.nama_mapel || ' (' || TO_CHAR(a.tanggal, 'DD Mon YYYY') || ')'
                    ) as detail_alpha
                FROM "SISWA" s
                JOIN "KELAS" k ON k.id = s.kelas_id
                LEFT JOIN "ABSENSI" a ON a.siswa_id = s.id AND a.status = 'alpha'
                LEFT JOIN "JADWAL" j ON j.id = a.jadwal_id
                LEFT JOIN "MATA_PELAJARAN" mp ON mp.id = j.mata_pelajaran_id
                WHERE s.kelas_id = $1 
                GROUP BY s.id, s.nama, s.nis, k.nama_kelas
            )
            SELECT *
            FROM AbsensiPerSiswa
            WHERE total_alpha > 0
            ORDER BY 
                total_alpha DESC,
                nama_siswa ASC
        `, [kelasId]);
        return res.rows;
    } catch (err) {
        console.error('Error getting class absence details:', err);
        throw err;
    }
}

export async function getJadwalGuru() {
    try {
        const res = await connectionPool.query(`
            WITH TeacherSchedule AS (
                SELECT 
                    g.id as guru_id,
                    g.nama as nama_guru,
                    g.nip,
                    STRING_AGG(
                        k.nama_kelas || ' - ' || mp.nama_mapel || ' (' || 
                        j.hari || ', ' || 
                        TO_CHAR(j.jam_mulai::time, 'HH24:MI') || '-' || 
                        TO_CHAR(j.jam_selesai::time, 'HH24:MI') || ')',
                        E'\n'
                        ORDER BY 
                            CASE 
                                WHEN j.hari = 'Senin' THEN 1
                                WHEN j.hari = 'Selasa' THEN 2
                                WHEN j.hari = 'Rabu' THEN 3
                                WHEN j.hari = 'Kamis' THEN 4
                                WHEN j.hari = 'Jumat' THEN 5
                            END,
                            j.jam_mulai
                    ) as jadwal
                FROM "GURU" g
                INNER JOIN "JADWAL" j ON j.guru_id = g.id
                INNER JOIN "KELAS" k ON k.id = j.kelas_id
                INNER JOIN "MATA_PELAJARAN" mp ON mp.id = j.mata_pelajaran_id
                GROUP BY g.id, g.nama, g.nip
                ORDER BY g.nama
            )
            SELECT * FROM TeacherSchedule
        `);
        return res.rows;
    } catch (err) {
        console.error('Error getting teacher schedules:', err);
        throw err;
    }
}




export async function getTopAttendingStudents() {
  try {
    const result = await connectionPool.query(`
      SELECT 
        s.id as siswa_id,
        s.nama as nama_siswa,
        k.nama_kelas,
        COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as total_hadir
      FROM "SISWA" s
      JOIN "KELAS" k ON k.id = s.kelas_id
      JOIN "ABSENSI" a ON a.siswa_id = s.id
      WHERE a.status = 'hadir'
      GROUP BY s.id, s.nama, k.nama_kelas
      ORDER BY total_hadir DESC, nama_siswa ASC
      LIMIT 3
    `);

    return result.rows;
  } catch (error) {
    console.error('Error in getTopAttendingStudents:', error);
    throw error;
  }
}


export async function getProblemStudents(period: 'week' | 'month' | 'semester' = 'month') {
  const periodFilter = {
    week: "CURRENT_DATE - INTERVAL '7 days'",
    month: "DATE_TRUNC('month', CURRENT_DATE)",
    semester: "DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')"
  };

  try {
    const result = await connectionPool.query(`
      WITH StudentAbsences AS (
        SELECT 
          s.id as siswa_id,
          s.nama,
          k.nama_kelas,
          COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as total_alpha,
          array_agg(DISTINCT mp.nama_mapel) as frequently_skipped_subjects
        FROM "SISWA" s
        JOIN "KELAS" k ON s.kelas_id = k.id
        JOIN "ABSENSI" a ON s.id = a.siswa_id
        JOIN "JADWAL" j ON a.jadwal_id = j.id
        JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
        WHERE a.status = 'alpha'
        AND a.tanggal >= ${periodFilter[period]}
        GROUP BY s.id, s.nama, k.nama_kelas
        HAVING COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) >= 5
      )
      SELECT *
      FROM StudentAbsences
      ORDER BY total_alpha DESC, nama_kelas, nama
    `);

    return result.rows;
  } catch (error) {
    console.error('Error in getProblemStudents:', error);
    throw error;
  }
}

export async function getActiveClasses() {
  try {
    const result = await connectionPool.query(`
      SELECT 
        k.id,
        k.nama_kelas,
        COUNT(DISTINCT s.id) as jumlah_siswa
      FROM "KELAS" k
      LEFT JOIN "SISWA" s ON k.id = s.kelas_id
      GROUP BY k.id, k.nama_kelas
      ORDER BY k.nama_kelas
    `);

    return result.rows;
  } catch (error) {
    console.error('Error in getActiveClasses:', error);
    throw error;
  }
}



interface SubjectBreakdown {
  mapel_id: number;
  nama_mapel: string;
  alpha_count: number;
}

interface AbsenceHistory {
  id: number;
  tanggal: string;
  nama_mapel: string;
  status: string;
  keterangan: string | null;
}

interface StudentDetails {
  id: string;
  nama: string;
  nama_kelas: string;
  total_alpha: number;
  total_izin: number;
  total_sakit: number;
  subject_breakdown: SubjectBreakdown[];
  absence_history: AbsenceHistory[];
}

export async function getStudentDetails(id: string): Promise<StudentDetails | null> {
  try {
    // Get basic student info and attendance totals
    const studentResult = await connectionPool.query(`
      WITH AttendanceCounts AS (
        SELECT 
          COUNT(CASE WHEN status = 'alpha' THEN 1 END) as total_alpha,
          COUNT(CASE WHEN status = 'izin' THEN 1 END) as total_izin,
          COUNT(CASE WHEN status = 'sakit' THEN 1 END) as total_sakit
        FROM "ABSENSI"
        WHERE siswa_id = $1
      )
      SELECT 
        s.id,
        s.nama,
        k.nama_kelas,
        COALESCE(ac.total_alpha, 0) as total_alpha,
        COALESCE(ac.total_izin, 0) as total_izin,
        COALESCE(ac.total_sakit, 0) as total_sakit
      FROM "SISWA" s
      JOIN "KELAS" k ON s.kelas_id = k.id
      LEFT JOIN AttendanceCounts ac ON true
      WHERE s.id = $1
    `, [id]);

    if (studentResult.rows.length === 0) return null;

    // Get subject breakdown
    const subjectResult = await connectionPool.query(`
      SELECT 
        mp.id as mapel_id,
        mp.nama_mapel,
        COUNT(*) as alpha_count
      FROM "ABSENSI" a
      JOIN "JADWAL" j ON a.jadwal_id = j.id
      JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
      WHERE a.siswa_id = $1 AND a.status = 'alpha'
      GROUP BY mp.id, mp.nama_mapel
      HAVING COUNT(*) > 0
      ORDER BY alpha_count DESC
    `, [id]);

    // Get absence history
    const historyResult = await connectionPool.query(`
      SELECT 
        a.id,
        a.tanggal,
        mp.nama_mapel,
        a.status,
        a.keterangan
      FROM "ABSENSI" a
      JOIN "JADWAL" j ON a.jadwal_id = j.id
      JOIN "MATA_PELAJARAN" mp ON j.mata_pelajaran_id = mp.id
      WHERE a.siswa_id = $1 AND a.status != 'hadir'
      ORDER BY a.tanggal DESC
      LIMIT 50
    `, [id]);

    return {
      ...studentResult.rows[0],
      subject_breakdown: subjectResult.rows,
      absence_history: historyResult.rows
    };

  } catch (error) {
    console.error('Error in getStudentDetails:', error);
    throw error;
  }
}