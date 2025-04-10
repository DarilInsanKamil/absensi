import { connectionPool } from "@/app/api/db";

export async function queryLength() {
    const res = await connectionPool.query(`
        SELECT 
            (SELECT COUNT(*) FROM "KELAS") AS kelas_count,
            (SELECT COUNT(*) FROM "GURU") AS guru_count,
            (SELECT COUNT(*) FROM "SISWA") AS siswa_count
    `);

    return {
        kelas: res.rows[0].kelas_count,
        guru: res.rows[0].guru_count,
        siswa: res.rows[0].siswa_count,
    };
}