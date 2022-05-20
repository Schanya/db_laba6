const { Pool } = require('pg');

const pool = new Pool({//созд один раз
    user: 'postgres',
    password: 'SCH08',
    host: 'localhost',
    port: 5432,
    database: 'laba_Shop_db',
    max: 10
});

module.exports = pool;