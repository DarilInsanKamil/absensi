import { createTahunAjaran, getTahunAjaran } from "@/app/libs/features/queryTahunAjaran";

export async function GET(req: Request) {
    try {
        const res = await getTahunAjaran();
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                "Content-type": "application/json"
            }
        })
    } catch (err) {

    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nama, tanggal_mulai, tanggal_selesai, status_aktif } = body
        const tahunAjaranBaru = await createTahunAjaran({ nama, tanggal_mulai, tanggal_selesai, status_aktif })

        return new Response(JSON.stringify(tahunAjaranBaru), {
            status: 201,
            headers: {
                "Content-type": 'application/json'
            }
        })
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
        });
    }
}