const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (!process.env.DATABASE_URL_UNPOOLED) {
  throw new Error('DATABASE_URL_UNPOOLED is required to apply schema changes directly');
}

const migrationUrl = new URL(process.env.DATABASE_URL_UNPOOLED);
if (migrationUrl.hostname.includes('-pooler')) {
  throw new Error('DATABASE_URL_UNPOOLED must use a direct, non-pooled connection');
}

process.env.DATABASE_URL = migrationUrl.toString();
const pool = require('../db');

async function setupDatabase() {
  const schema = fs.readFileSync(path.resolve(__dirname, '..', 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Database schema applied successfully.');
}

setupDatabase()
  .catch((error) => {
    console.error('Database schema setup failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
