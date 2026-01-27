import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

console.log('Connection String:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@')); // Hide password

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        console.log('Testing DB Connection...');
        const res = await pool.query('SELECT NOW() as current_time');
        console.log('Connection Successful:', res.rows[0]);
        process.exit(0);
    } catch (error) {
        console.error('Connection Failed:', error);
        process.exit(1);
    }
}

testConnection();
