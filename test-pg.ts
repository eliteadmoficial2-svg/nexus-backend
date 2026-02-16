import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

async function testConnection() {
    console.log('Testing connection to:', connectionString?.split('@')[1]);
    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('✅ Connection successful with pg!');
        const res = await client.query('SELECT NOW()');
        console.log('Server time:', res.rows[0].now);
        await client.end();
    } catch (err) {
        console.error('❌ Connection failed with pg:', err.message);
    }
}

testConnection();
