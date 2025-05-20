import { Pool } from 'pg';
require('dotenv').config();

export const connectionPool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait for a connection
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : undefined
});

// Add error handler
connectionPool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test connection
connectionPool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Successfully connected to database');
        done();
    }
});