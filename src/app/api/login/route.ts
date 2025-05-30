import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { connectionPool } from '../../_db/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const { username, password } = data;
        // Cari user berdasarkan username di tabel USERS
        const userResult = await connectionPool.query(
            `SELECT * FROM "USERS" WHERE username = $1`,
            [username]
        );

        const userData = userResult.rows[0];

        // Cek apakah user ditemukan
        if (!userData) {
            return new Response(JSON.stringify({ error: "Username tidak ditemukan" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verifikasi password
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return new Response(JSON.stringify({ error: "Password salah" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Ambil data tambahan dari tabel referensi (GURU atau SISWA)
        let additionalData = null;

        if (userData.reference_type === "GURU") {
            const guruResult = await connectionPool.query(
                `SELECT * FROM "GURU" WHERE id = $1`,
                [userData.reference_id]
            );
            additionalData = guruResult.rows[0];
        } else if (userData.reference_type === "SISWA") {
            const siswaResult = await connectionPool.query(
                `SELECT * FROM "SISWA" WHERE id = $1`,
                [userData.reference_id]
            );
            additionalData = siswaResult.rows[0];
        } else if (userData.reference_type === "KEPSEK") {
            const siswaResult = await connectionPool.query(
                `SELECT * FROM "GURU" WHERE id = $1`,
                [userData.reference_id]
            );
            additionalData = siswaResult.rows[0];
        } else if (userData.reference_type === "BK") {
            const siswaResult = await connectionPool.query(
                `SELECT * FROM "GURU" WHERE id = $1`,
                [userData.reference_id]
            );
            additionalData = siswaResult.rows[0];
        }

        // Buat token JWT
        const token = jwt.sign(
            {
                id: userData.id,
                username: userData.username,
                role: userData.role,
                reference_id: userData.reference_id,
                reference_type: userData.reference_type
            },
            process.env.SESSION_SECRET || 'your_jwt_secret_key', // Sebaiknya gunakan env variable
            { expiresIn: '24h' }
        );


        const response = NextResponse.json(
            {
                message: "Berhasil login",
                token,
                user: {
                    id: userData.id,
                    username: userData.username,
                    role: userData.role,
                    ...additionalData
                }
            },
            { status: 200 }
        );
        (await cookies()).set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production', // TRUE kalau deploy
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 hari
        });

        return response;

    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while logging in';
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