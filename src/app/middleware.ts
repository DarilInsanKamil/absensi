import { jwtVerify } from "jose";

export async function verifyRole(token: string, allowedRoles: string[]) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // Periksa apakah role pengguna termasuk dalam role yang diizinkan
        if (typeof payload.role !== "string" || !allowedRoles.includes(payload.role)) {
            throw new Error("Access denied");
        }

        return payload; // Payload berisi userId dan role
    } catch (err) {
        console.error("Role verification failed:", err);
        return null;
    }
}