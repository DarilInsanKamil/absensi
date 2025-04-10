import { deleteMapelById, getMapelById, updateMapelById } from "@/app/libs/features/queryMapel";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    try {
        const result = await getMapelById(parseInt(id));

        if (result.length === 0) {
            return new Response(JSON.stringify({ error: "Mapel not found" }), {
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
    const id = (await params).id;
    try {

        console.log('DELETE request received for ID:', id);

        const res = await deleteMapelById(parseInt(id))

        if (!res) {
            return new Response(JSON.stringify({ error: "Mapel not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }

        console.log('Mapel deleted successfully for ID:', id);

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
    const id = (await params).id;
    try {
        const body = await req.json();
        const existingMatpel = await getMapelById(parseInt(id));

        if (existingMatpel.length === 0) {
            return new Response(JSON.stringify({ error: "Mapel not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }

        const { kode_mapel, nama_mapel } = body;

        const updatedMatpel = {
            ...existingMatpel[0],
            kode_mapel: kode_mapel ?? existingMatpel[0].kode_mapel,
            nama_mapel: nama_mapel ?? existingMatpel[0].nama_mapel,
        }

        const mapelUpdated = await updateMapelById(parseInt(id), updatedMatpel);

        return new Response(JSON.stringify(mapelUpdated), {
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