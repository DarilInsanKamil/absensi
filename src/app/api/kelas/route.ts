import { createKelas, getAllKelas } from "@/app/libs/features/queryKelas";

export async function GET(req: Request) {
    try {
        const kelas = await getAllKelas();
        return new Response(JSON.stringify(kelas), {
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
    try{
        const data = await req.json();

        const { nama_kelas, tahun_ajaran_id, walikelas_id } = data;

        const kelasBaru = await createKelas({ nama_kelas, tahun_ajaran_id, walikelas_id });

        return new Response(JSON.stringify(kelasBaru), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch(err) {
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