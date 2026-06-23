const { Pool } = require('pg');
const pool = new Pool({ connectionString: "postgresql://neondb_owner:npg_6ZQ1ueAYEfWg@ep-aged-hall-aopstsfs-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true" });

pool.query('SELECT * FROM "Vendor" LIMIT 1', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Columns:', Object.keys(res.rows[0]));
    console.log('Sample Row:', res.rows[0]);
  }
  pool.end();
});
