import { deleteGuruById, getGuruById, updateGuru } from "@/app/libs/features/queryGuru";
import { NextRequest } from "next/server";
import bcrypt from 'bcrypt';


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    try {
        const result = await getGuruById(parseInt(id));

        if (result.length === 0) {
            return new Response(JSON.stringify({ error: "Guru not found" }), {
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
        const res = await deleteGuruById(parseInt(id));
        if (!res) {
            return new Response(JSON.stringify({ error: "Guru not found" }), {
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
    const { id } = await params
    try {
        const body = await req.json();
        const existingGuru = await getGuruById(parseInt(id));
        if (existingGuru.length === 0) {
            return new Response(JSON.stringify({ error: "Guru not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
        const { nip, nama, jenis_kelamin, alamat, no_telepon, email, username, password } = body;

        const updatedGuru = {
            ...existingGuru[0],
            nip: nip ?? existingGuru[0].nip,
            nama: nama ?? existingGuru[0].nama,
            jenis_kelamin: jenis_kelamin ?? existingGuru[0].jenis_kelamin,
            alamat: alamat ?? existingGuru[0].alamat,
            no_telepon: no_telepon ?? existingGuru[0].no_telepon,
            email: email ?? existingGuru[0].email,
            username: username ?? existingGuru[0].username,
            password: password ? await bcrypt.hash(password, 10) : existingGuru[0].password
        }

        const guruBaru = await updateGuru(parseInt(id), updatedGuru);

        return new Response(JSON.stringify(guruBaru), {
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