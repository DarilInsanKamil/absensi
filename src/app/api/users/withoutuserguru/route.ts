import { connectionPool } from "@/app/_db/db";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
    try {
        const result = await connectionPool.query(`
           SELECT s.* 
    FROM "GURU" s
    LEFT JOIN "USERS" u ON 
      u.reference_id = s.id::text AND 
      u.reference_type = 'GURU'
    WHERE u.id IS NULL
        `);

        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: "No users found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (err) {
        console.error('Error executing query:', err);
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}