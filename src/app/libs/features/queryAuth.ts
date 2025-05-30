import { connectionPool } from "@/app/_db/db";
import { Users } from "@/definitions";

export async function createUser(user: Users) {
    const { username, hashedPassword, reference_id, reference_type, role } = user
    const req = await connectionPool.query(`INSERT INTO "USERS" ("username", "password", "reference_id", "reference_type", "role") VALUES($1, $2, $3, $4, $5) RETURNING *`, [username, hashedPassword, reference_id, reference_type, role])
    return req.rows;
}


export async function searchUsernameAdmin(username: string) {
    try {
        const result = await connectionPool.query(`SELECT id FROM "ADMIN" WHERE username = $1`, [username]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
        console.error('Error searching username in ADMIN table', err);
        throw err;
    }
}

// const result = await connectionPool.query('INSERT INTO "SISWA" ("nis", "nama", "jenis_kelamin", "tanggal_lahir", "alamat", "no_telepon", "email", "kelas_id", "status_aktif") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, status_aktif]);