import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const PASSWORD = process.env.DATABASE_URL?.match(/:([^:@]+)@/)?.[1] || 'PdlaJgKFVb4Hx6yD';
// Explicitly trying with suffix on user AND options param
const USER = 'postgres.isvpvncghckqhioljotp';
const IPV4_HOST = '3.108.251.216'; // aws-0-ap-south-1...

async function testWithReference() {
    console.log(`Testing with options...`);
    // Try forcing the project ID in options
    const client = new Client({
        host: IPV4_HOST,
        port: 6543,
        user: USER,
        password: PASSWORD,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        options: '-c project=isvpvncghckqhioljotp' // trying postgres CLI style option
    });

    try {
        await client.connect();
        console.log(`✅ SUCCESS with project option!`);
        await client.end();
    } catch (error: any) {
        console.log(`❌ FAILED (project): ${error.message}`);
        await client.end().catch(() => { });
    }

    // Try 'reference'
    const clientRef = new Client({
        host: IPV4_HOST,
        port: 6543, // Transaction Pooler
        user: USER, // Full User
        password: PASSWORD,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        // Some drivers support this
    });

    try {
        // Trying query param style via connection string parser manually
        console.log('Testing reference option via connection string...');
        const connStr = `postgresql://${USER}:${PASSWORD}@${IPV4_HOST}:6543/postgres?options=reference%3Disvpvncghckqhioljotp`;
        const client2 = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
        await client2.connect();
        console.log(`✅ SUCCESS with reference option!`);
        await client2.end();
    } catch (e: any) {
        console.log(`❌ FAILED (reference): ${e.message}`);
    }
}

testWithReference();
