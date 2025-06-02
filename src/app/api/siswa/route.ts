import { createSiswa, getSiswa } from '@/app/libs/features/querySiswa';
import { revalidateTag } from 'next/cache';

export async function GET(req: Request) {
    try {
        const siswa = await getSiswa();
        revalidateTag('siswa')
        return new Response(JSON.stringify(siswa), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'Database connection failed';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, status_aktif } = body;

        const siswaBaru = await createSiswa({ nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, status_aktif });

        return new Response(JSON.stringify({ siswaBaru, message: "Create Data Success" }), {
            status: 201,
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
        });
    }
}