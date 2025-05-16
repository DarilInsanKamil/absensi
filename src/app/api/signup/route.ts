import { createUser, searchUsernameAdmin } from "@/app/libs/features/queryAuth";
import { searchUsernameGuru } from "@/app/libs/features/queryGuru";
import { searchUsernameSiswa } from "@/app/libs/features/querySiswa";
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { username, password, role } = data;
        let userData = null;

        // Check for valid role first
        const validRoles = ['admin', 'guru', 'siswa', 'kepsek', 'bk'];
        if (!validRoles.includes(role)) {
            return new Response(JSON.stringify({ error: "Invalid role" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get user data based on role
        switch (role) {
            case 'guru':
            case 'kepsek':
            case 'bk':
                userData = await searchUsernameGuru(username);
                break;
            case 'siswa':
                userData = await searchUsernameSiswa(username);
                break;
            case 'admin':
                userData = await searchUsernameAdmin(username);
                break;
        }

        if (!userData) {
            return new Response(JSON.stringify({ error: "Username not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const reference_id = userData?.id;
        if (!reference_id) {
            return new Response(JSON.stringify({ error: "Reference ID is missing" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // All special roles (kepsek, bk) are stored as GURU in reference_type
        const reference_type = ['kepsek', 'bk'].includes(role) ? 'GURU' : role.toUpperCase();

        const hashedPassword = await bcrypt.hash(password, 10);
        const userBaru = await createUser({
            username,
            hashedPassword,
            reference_id,
            reference_type,
            role
        });

        return new Response(JSON.stringify({ message: "Berhasil membuat akun", userBaru }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while create data';
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