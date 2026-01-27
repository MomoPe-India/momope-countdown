import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const PASSWORD = process.env.DATABASE_URL?.match(/:([^:@]+)@/)?.[1] || 'Bravo15%402026'; // Extract password from env or default
const PROJECT_REF = 'isvpvncghckqhioljotp';
const IPV4_HOST = '3.108.251.216'; // aws-0-ap-south-1.pooler.supabase.com

const configs = [
    {
        name: 'Transaction Pooler (Suffix User)',
        user: `postgres.${PROJECT_REF}`,
        port: 6543,
        ssl: false
    },
    {
        name: 'Transaction Pooler (Suffix User, SSL)',
        user: `postgres.${PROJECT_REF}`,
        port: 6543,
        ssl: true
    },
    {
        name: 'Session Pooler (Suffix User)',
        user: `postgres.${PROJECT_REF}`,
        port: 5432,
        ssl: false
    },
    {
        name: 'Session Pooler (Suffix User, SSL)',
        user: `postgres.${PROJECT_REF}`,
        port: 5432,
        ssl: true
    }
];

async function testAll() {
    console.log(`Testing Connection for Project: ${PROJECT_REF}`);
    console.log(`Using Password: ${PASSWORD.substring(0, 3)}***`);

    for (const config of configs) {
        console.log(`\n--- Testing ${config.name} ---`);
        const client = new Client({
            host: IPV4_HOST,
            port: config.port,
            user: config.user,
            password: decodeURIComponent(PASSWORD),
            database: 'postgres',
            ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
            connectionTimeoutMillis: 5000
        });

        try {
            await client.connect();
            const res = await client.query('SELECT version()');
            console.log(`✅ SUCCESS! Connected to ${config.name}`);
            console.log(`   Version: ${res.rows[0].version}`);

            // Generate the working connection string
            const connString = `postgresql://${config.user}:${PASSWORD}@${IPV4_HOST}:${config.port}/postgres`;
            console.log(`\n>>> WORKING CONNECTION STRING (Save this!):`);
            console.log(connString);

            await client.end();
            process.exit(0);
        } catch (error: any) {
            console.log(`❌ FAILED: ${error.message}`);
            await client.end().catch(() => { });
        }
    }
    console.log('\nAll attempts failed. Please verify password.');
}

testAll();
