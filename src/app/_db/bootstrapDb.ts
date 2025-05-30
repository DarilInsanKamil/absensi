import { initDb } from './init_db';

let isInitialized = false;

export async function bootstrapDatabase() {
    if (isInitialized) return;
    
    try {
        await initDb();
        isInitialized = true;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}