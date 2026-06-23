const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'Vendor\'');
    console.log('Vendor columns:', res.rows);
    
    const statuses = await pool.query('SELECT DISTINCT status FROM "Vendor"');
    console.log('Status values in DB:', statuses.rows);

    const count = await pool.query('SELECT COUNT(*) FROM "Vendor" WHERE status = \'APPROVED\'');
    console.log('Count of APPROVED:', count.rows[0]);
  } catch (e) {
    console.error('Check failed:', e);
  } finally {
    await pool.end();
  }
}

check();
