import { NextRequest } from "next/server";
import { connectionPool } from "../../../_db/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    try {
        const result = await connectionPool.query(`SELECT * FROM "ADMIN" WHERE id = $1`, [parseInt(id)]);
        const data = await result.rows
        if (!data) {
            return new Response(JSON.stringify({ error: "Guru not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }

        return new Response(JSON.stringify(data[0]), {
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