import { connectionPool } from "@/app/api/_db/db";

export async function getQueryFormJadwal() {
    const namaGuru = await connectionPool.query('SELECT id,nama FROM "GURU"');
    const namaMapel = await connectionPool.query('SELECT id,nama_mapel FROM "MATA_PELAJARAN"');
    const namaTahunAjaran = await connectionPool.query('SELECT id,nama FROM "TAHUN_AJARAN"');
    const namaKelas = await connectionPool.query('SELECT id,nama_kelas FROM "KELAS"');

    return {
        guru: namaGuru.rows,
        mataPelajaran: namaMapel.rows,
        tahunAjaran: namaTahunAjaran.rows,
        kelas: namaKelas.rows
    };
}