import { deleteTahunAjaranById, getTahunAjaranById, updateTahunAjaranById } from "@/app/libs/features/queryTahunAjaran";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const searchById = await getTahunAjaranById(parseInt(id))
        if (searchById.length === 0) {
            return new Response(JSON.stringify({ error: "Tahun Ajaran Not Found" }), {
                status: 404,
                headers: {
                    "Content-type": "application/json"
                }
            })
        }

        return new Response(JSON.stringify(searchById), {
            status: 200,
            headers: {
                "Content-type": "application/json"
            }
        })

    } catch (err) {

    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const body = await req.json();

        const existingTahunAjaran = await getTahunAjaranById(parseInt(id))

        if (existingTahunAjaran.length === 0) {
            return new Response(JSON.stringify({ error: "Tahun Ajaran Not Found" }), {
                status: 404,
                headers: {
                    "Content-type": "application/json"
                }
            })
        }

        const { nama, tanggal_mulai, tanggal_selesai, status_aktif } = body;

        const updateById = await updateTahunAjaranById(parseInt(id), { nama, tanggal_mulai, tanggal_selesai, status_aktif })

        return new Response(JSON.stringify({ updateById, message: "Update data success" }), {
            status: 200,
            headers: {
                "Content-type": "application/json"
            }
        })
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while updating data';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                "Content-type": "application/json"
            }
        })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const deleteById = await deleteTahunAjaranById(parseInt(id))
        if (!deleteById) {
            return new Response(JSON.stringify({ error: "Tahun Ajaran Not Found" }), {
                status: 404,
                headers: {
                    "Content-type": "application/json"
                }
            })
        }
        return new Response(JSON.stringify({ message: "Delete Success" }), {
            status: 200,
            headers: {
                "Content-type": "application/json"
            }
        })
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while deleting data';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                "Content-type": "application/json"
            }
        })
    }
}