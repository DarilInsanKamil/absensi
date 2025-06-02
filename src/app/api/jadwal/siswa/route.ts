import { getJadwalSiswaForBK } from "@/app/libs/features/queryJadwal";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const kelasId = searchParams.get('kelas');
        const mapelId = searchParams.get('mapel');

        const jadwal = await getJadwalSiswaForBK
            (kelasId || undefined, mapelId || undefined);

        return new Response(JSON.stringify(jadwal), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Error fetching jadwal:', err);
        return new Response(JSON.stringify({ error: "An error occurred while fetching data" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}