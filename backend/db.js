const path = require('node:path');
const { Pool, types } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

types.setTypeParser(1082, (value) => value);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in the environment or a local env file');
}

const connectionUrl = new URL(process.env.DATABASE_URL);
if (connectionUrl.searchParams.get('sslmode') === 'require') {
  connectionUrl.searchParams.set('sslmode', 'verify-full');
}

const pool = new Pool({ connectionString: connectionUrl.toString() });

module.exports = pool;