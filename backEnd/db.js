const { Pool } = require('pg');

const pool = new Pool({
    user: 'kingsley',
    host: 'localhost',
    database: 'jobseek_db',
    password: 'post123456',
    port: 5432, // default PostgreSQL port
});

module.exports = pool;
