import { createAbsensi, getAbsensi } from "@/app/libs/features/queryAbsensi";

export async function GET(req: Request) {
    try {
        const res = await getAbsensi();

        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { siswa_id, jadwal_id, guru_id, tanggal, status, keterangan } = body;
        const absen = await createAbsensi({ siswa_id, jadwal_id, guru_id, tanggal, status, keterangan });

        return new Response(JSON.stringify({ absen, message: "Create Data Success" }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while creating data';
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