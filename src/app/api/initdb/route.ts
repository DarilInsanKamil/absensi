import { initDb } from '@/app/_db/init_db';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
    try {
        await initDb();
        return NextResponse.json({ message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Database initialization failed:', error);
        return NextResponse.json(
            { error: 'Failed to initialize database' },
            { status: 500 }
        );
    }
}