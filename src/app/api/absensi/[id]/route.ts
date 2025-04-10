import { deleteAbsensiById, getAbsensiById, updateAbsensiById } from "@/app/libs/features/queryAbsensi";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const searchById = await getAbsensiById(parseInt(id));
        if (searchById.length === 0) {
            return new Response(JSON.stringify({ error: "Absensi not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
        return new Response(JSON.stringify(searchById), {
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
        const res = await deleteAbsensiById(parseInt(id));
        if (!res) {
            return new Response(JSON.stringify({ error: "Absensi not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }

        return new Response(JSON.stringify({ message: "Delete Succesfull" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while deleting data';
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json();

        const existingData = await getAbsensiById(parseInt(id));
        if (existingData.length === 0) {
            return new Response(JSON.stringify({ error: "Absensi not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
        const { siswa_id, jadwal_id, guru_id, tanggal, status, keterangan } = body;

        const updatedAbsensi = {
            ...existingData[0],
            siswa_id: siswa_id ?? existingData[0].siswa_id,
            jadwal_id: jadwal_id ?? existingData[0].jadwal_id,
            guru_id: guru_id ?? existingData[0].guru_id,
            tanggal: tanggal ?? existingData[0].tanggal,
            status: status ?? existingData[0].status,
            keterangan: keterangan ?? existingData[0].keterangan
        }
        
        const res = await updateAbsensiById(parseInt(id), updatedAbsensi);
        return new Response(JSON.stringify(res), {
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

