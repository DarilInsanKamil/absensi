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

export async function getUserById(id: number) {
    try {
        const result = await connectionPool.query(`
            SELECT * FROM "USERS" u
            WHERE u.id = $1
        `, [id]);

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        throw err;
    }
}

export async function updateUserPassword(id: number, hashedPassword: string) {
    // Validate inputs
    if (!id || !hashedPassword) {
        throw new Error('ID and password are required');
    }

    try {
        const result = await connectionPool.query(`
            UPDATE "USERS" 
            SET 
                "password" = $1,
                "updated_at" = CURRENT_TIMESTAMP
            WHERE "id" = $2
            RETURNING "id", "username", "updated_at"
        `, [hashedPassword, id]);

        // Log the result for debugging
        console.log('Update result:', result.rowCount, 'rows affected');

        // Check if any row was updated
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    } catch (err) {
        // Log the specific error
        console.error('Error updating user password:', err);

        // Rethrow with more specific message
        throw new Error(`Failed to update password for user ${id}`);
    }
}



export async function deleteUserById(id: number) {
    const result = await connectionPool.query('DELETE FROM "USERS" WHERE "id" = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
}
