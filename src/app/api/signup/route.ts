import { NextResponse } from "next/server";
import { signup } from "@/app/libs/auth";

export async function POST(req: Request) {
    const formData = await req.json(); // Ambil data JSON dari request body
    
    const result = await signup({}, formData);

    if (result.errors) {
        return NextResponse.json({ errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
}