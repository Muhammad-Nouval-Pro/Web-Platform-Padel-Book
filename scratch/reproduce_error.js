const { PrismaClient } = require('../src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const vendors = await prisma.vendor.findMany({
      take: 1
    });
    console.log('Success:', vendors.length, 'vendors found');
  } catch (e) {
    console.error('Error Details:');
    console.error(JSON.stringify(e, null, 2));
    console.error('Message:', e.message);
    if (e.code) console.error('Prisma Error Code:', e.code);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
