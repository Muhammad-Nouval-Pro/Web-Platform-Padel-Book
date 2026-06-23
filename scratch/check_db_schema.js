const { prisma } = require('../src/lib/prisma');
require('dotenv').config();

async function test() {
  try {
    const result = await prisma.$queryRawUnsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Vendor'");
    console.log('Columns in Vendor table:', result);
    
    // Test the findMany with the same arguments as in page.tsx
    console.log('Testing findMany...');
    const vendors = await prisma.vendor.findMany({
      where: { status: 'APPROVED' },
      take: 2
    });
    console.log('Vendors found:', vendors.length);
  } catch (e) {
    console.error('Error in test script:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
