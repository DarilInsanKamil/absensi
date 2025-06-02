import { connectionPool } from "@/app/_db/db";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
    try {
        const result = await connectionPool.query(`
           SELECT 
                u.id,
                u.username,
                u.password,
                u.role,
                u.reference_id,
                u.reference_type,
                u.created_at,
                u.updated_at,
                CASE 
                    WHEN u.reference_type = 'GURU' THEN g.nama
                    WHEN u.reference_type = 'SISWA' THEN s.nama
                    WHEN u.reference_type = 'ADMIN' THEN a.nama
                    ELSE NULL 
                END as nama,
                CASE 
                    WHEN u.reference_type = 'GURU' THEN g.nip
                    WHEN u.reference_type = 'SISWA' THEN s.nis
                    WHEN u.reference_type = 'ADMIN' THEN a.username
                    ELSE NULL 
                END as nomor_induk
            FROM "USERS" u
            LEFT JOIN "GURU" g ON 
                u.reference_type = 'GURU' 
                AND CASE 
                    WHEN u.reference_type = 'GURU' THEN u.reference_id::integer
                    ELSE NULL
                END = g.id
            LEFT JOIN "SISWA" s ON 
                u.reference_type = 'SISWA' 
                AND CASE 
                    WHEN u.reference_type = 'SISWA' THEN u.reference_id::uuid
                    ELSE NULL
                END = s.id
            LEFT JOIN "ADMIN" a ON 
                u.reference_type = 'ADMIN' 
                AND CASE 
                    WHEN u.reference_type = 'ADMIN' THEN u.reference_id::integer
                    ELSE NULL
                END = a.id
            ORDER BY u.id 
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