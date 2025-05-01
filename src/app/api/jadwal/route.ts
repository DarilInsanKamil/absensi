import { createJadwal, getJadwal } from "@/app/libs/features/queryJadwal";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const allJadwal = await getJadwal();
        return new Response(JSON.stringify(allJadwal), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (err) {
        let errorMessage = "An error occurred while fetching data";
        return new Response(errorMessage, {
            status: 500,
            headers: {
                'Content-type': 'application/plain'
            }
        })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { mata_pelajaran_id, kelas_id, guru_id, tahun_ajaran_id, hari, jam_mulai, jam_selesai } = body

        const buatJadwal = await createJadwal({ mata_pelajaran_id, kelas_id, guru_id, tahun_ajaran_id, hari, jam_mulai, jam_selesai })

        return new Response(JSON.stringify({ buatJadwal, meesage: "create data success" }), {
            status: 201,
            headers: {
                'Content-type': "application/json"
            }

        })
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while create data';
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