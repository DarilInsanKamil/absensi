import { deleteJadwalById, getJadwalById, updateJadwalById } from "@/app/libs/features/queryJadwal";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const res = await getJadwalById(parseInt(id));
        if (res.length === 0) {
            return new Response(JSON.stringify({ message: "Jadwal Not Found" }), {
                status: 404,
                headers: {
                    'Content-type': "application/json"
                }
            })
        }
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                'Content-type': "application/json"
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
        const res = await deleteJadwalById(parseInt(id))

        if (!res) {
            return new Response(JSON.stringify({ error: "Jadwal Not Found" }), {
                status: 404,
                headers: {
                    "Conten-type": "application/json"
                }
            })
        }
        return new Response(JSON.stringify({ message: "Delete Jadwal Success" }), {
            status: 200,
            headers: {
                "Content-type": "text/plain"
            }
        })
    } catch (err) {
        console.error("Error executing query", err)
        let errorMessage = "An error occured while deleting jadwal"
        return new Response(JSON.stringify(errorMessage), {
            status: 500,
            headers: {
                "Content-type": "text/plain"
            }
        })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json()
    try {
        const existingJadwal = await getJadwalById(parseInt(id))

        if (existingJadwal.length === 0) {
            return new Response(JSON.stringify({ error: "Kelas not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }

        const { mata_pelajaran_id, kelas_id, guru_id, tahun_ajaran_id, hari, jam_mulai, jam_selesai } = body
        const updatedJadwal = {
            ...existingJadwal[0],
            ...body
        }

        const jadwalBaru = await updateJadwalById(parseInt(id), updatedJadwal)

        return new Response(JSON.stringify(jadwalBaru), {
            status: 200,
            headers: {
                "Content-type": "application/json"
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