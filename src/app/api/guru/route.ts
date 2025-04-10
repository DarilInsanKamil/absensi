import { createGuru, getGuru } from "@/app/libs/features/queryGuru";
import bcrypt from 'bcrypt';

export async function GET(req: Request) {
    try {
        const siswa = await getGuru();
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

export async function POST(req: Request) {
    try {

        const body = await req.json();

        const { nip, nama, jenis_kelamin, alamat, no_telepon, email, username, password } = body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const guruBaru = await createGuru({ nip, nama, jenis_kelamin, alamat, no_telepon, email, username, hashedPassword });

        return new Response(JSON.stringify(guruBaru), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            }
        });

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
    };
}
