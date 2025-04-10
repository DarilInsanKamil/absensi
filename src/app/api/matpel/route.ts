import { createMapel, getMapel } from "@/app/libs/features/queryMapel";

export async function GET(req: Request) {
    try {
        const mapel = await getMapel();
        return new Response(JSON.stringify(mapel), {
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

export async function POST(req: Request) {
    try {

        const body = await req.json();

        const { kode_mapel, nama_mapel } = body;

        const mapelBaru = await createMapel({ kode_mapel, nama_mapel });

        return new Response(JSON.stringify({ mapelBaru, message: "Create Data Success" }), {
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
    };
}
