import { getQueryFormJadwal } from "@/app/libs/features/queryFormJadwal";

export async function GET() {
    try {
        const siswa = await getQueryFormJadwal();
        return new Response(JSON.stringify(siswa), {
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