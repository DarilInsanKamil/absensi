import { connectionPool } from "@/app/_db/db";
import { getSiswaKelasId } from "@/app/libs/features/querySiswa";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    try {
        const result = await connectionPool.query(`
          SELECT DISTINCT
            s.id,
            s.nis,
            s.nama,
            s.jenis_kelamin,
            s.tanggal_lahir,
            s.alamat,
            s.no_telepon,
            s.email,
            s.status_aktif,
            k.nama_kelas
          FROM "SISWA" s
          JOIN "KELAS" k ON s.kelas_id = k.id
          WHERE s.kelas_id = $1 AND s.status_aktif = true
          ORDER BY s.nama ASC
        `, [id]);

        return new Response(JSON.stringify(result.rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch students' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}