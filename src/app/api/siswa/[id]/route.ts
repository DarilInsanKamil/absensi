import { deleteSiswaById, getSiswaById, updateSiswa } from "@/app/libs/features/querySiswa";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    try {
        const result = await getSiswaById(id);

        if (result.length === 0) {
            return new Response(JSON.stringify({ error: "Siswa not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
        return new Response(JSON.stringify(result), {
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        const res = await deleteSiswaById(id);
        if (!res) {
            return new Response(JSON.stringify({ error: "Siswa not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
        return new Response(JSON.stringify({message: "Delete Siswa Success"}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while deleting data';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

}



export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const body = await req.json();
        const existingSiswa = await getSiswaById(id);
        if (existingSiswa.length === 0) {
            return new Response(JSON.stringify({ error: "Siswa not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }

        const { nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, status_aktif } = body;

        const updatedSiswa = {
            ...existingSiswa[0],
            nis: nis ?? existingSiswa[0].nis,
            nama: nama ?? existingSiswa[0].nama,
            jenis_kelamin: jenis_kelamin ?? existingSiswa[0].jenis_kelamin,
            tanggal_lahir: tanggal_lahir ?? existingSiswa[0].tanggal_lahir,
            alamat: alamat ?? existingSiswa[0].alamat,
            no_telepon: no_telepon ?? existingSiswa[0].no_telepon,
            email: email ?? existingSiswa[0].email,
            kelas_id: kelas_id ?? existingSiswa[0].kelas_id,
            status_aktif: status_aktif ?? existingSiswa[0].status_aktif
        }

        const siswaBaru = await updateSiswa(id, updatedSiswa);

        return new Response(JSON.stringify(siswaBaru), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while updating data';
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