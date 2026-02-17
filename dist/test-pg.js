"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
async function testConnection() {
    console.log('Testing connection to:', connectionString?.split('@')[1]);
    const client = new pg_1.Client({
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
    }
    catch (err) {
        console.error('❌ Connection failed with pg:', err.message);
    }
}
testConnection();
//# sourceMappingURL=test-pg.js.map