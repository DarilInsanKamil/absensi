import { getRekapAbsensi } from "@/app/libs/features/queryAbsensi";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest,) {
    const { searchParams } = new URL(req.url);
    const kelasId = searchParams.get('kelas_id');
    const bulan = searchParams.get('bulan');
    const tahun = searchParams.get('tahun');

    if (!kelasId || !bulan || !tahun) {
        return new Response(JSON.stringify({ error: 'kelas_id, bulan, dan tahun wajib diisi' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    try {
        const res = await getRekapAbsensi(Number(bulan), Number(tahun), Number(kelasId))
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while fetching data';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

}