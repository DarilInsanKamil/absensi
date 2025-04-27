import bcrypt from "bcrypt";
import { connectionPool } from "@/app/api/db";
import { FormState, SignupFormSchema } from "@/definitions";
import { SignJWT } from "jose";

export async function signup(state: FormState, formData: any) {
    // Validasi form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.name, // Akses langsung dari objek JSON
        email: formData.email,
        password: formData.password,
        role: formData.role, // Tambahkan role
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, password, role } = validatedFields.data;

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Simpan user ke database
        const res = await connectionPool.query(
            `INSERT INTO "users" (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, role`,
            [name, email, hashedPassword, role || "siswa"] // Default role adalah "siswa"
        );

        const user = res.rows[0];

        if (!user) {
            return {
                message: "An error occurred while creating your account.",
            };
        }

        return {
            message: "Account created successfully!",
            userId: user.id,
            role: user.role,
        };
    } catch (err) {
        console.error("Error creating user:", err);
        return {
            message: "An error occurred while creating your account.",
        };
    }
}

export async function login(email: string, password: string) {
    try {
        // Cari user berdasarkan email
        const res = await connectionPool.query(
            `SELECT id, password, role FROM "users" WHERE email = $1`,
            [email]
        );

        const user = res.rows[0];

        if (!user) {
            return { message: "Invalid email or password." };
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { message: "Invalid email or password." };
        }

        // Buat JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ userId: user.id, role: user.role }) // Tambahkan role ke payload
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h") // Token berlaku selama 2 jam
            .sign(secret);

        return { token, role: user.role };
    } catch (err) {
        console.error("Error logging in:", err);
        return { message: "An error occurred while logging in." };
    }
}