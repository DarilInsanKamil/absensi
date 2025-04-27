import { connectionPool } from "@/app/api/db";

export async function createUser(name: string, email: string, hashedPassword: string, role?: string) {
    const res = await connectionPool.query(
        `INSERT INTO "users" (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, role`,
        [name, email, hashedPassword, role || "siswa"]
    );
    return res.rows[0]
}