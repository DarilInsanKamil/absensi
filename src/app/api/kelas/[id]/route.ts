import { deleteKelasById, getKelasById, updateKelasById } from "@/app/libs/features/queryKelas";
import { getSiswaByKelasId } from "@/app/libs/features/querySiswa";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const result = await getSiswaByKelasId(parseInt(id))

        if (result.length === 0) {
            return new Response(JSON.stringify({ error: "Kelas not found" }), {
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const res = await deleteKelasById(parseInt(id));
        if (!res) {
            return new Response(JSON.stringify({ error: "Kelas not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }

        return new Response(JSON.stringify({ message: "Delete Successfull" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        })

    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'Internal Server Error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

}


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();
    try {
        const existingKelas = await updateKelasById(parseInt(id), body);
        if (existingKelas.length === 0) {
            return new Response(JSON.stringify({ error: "Kelas not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
        const { nama_kelas, tahun_ajaran_id, walikelas_id } = body;

        const updatedKelas = {
            ...existingKelas[0],
            nama_kelas: nama_kelas ?? existingKelas[0].nama_kelas,
            tahun_ajaran_id: tahun_ajaran_id ?? existingKelas[0].tahun_ajaran_id,
            walikelas_id: walikelas_id ?? existingKelas[0].walikelas_id,
        }

        const kelasBaru = await updateKelasById(parseInt(id), updatedKelas)

        return new Response(JSON.stringify(kelasBaru), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        })

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