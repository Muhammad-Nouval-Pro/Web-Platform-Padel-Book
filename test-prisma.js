const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

prisma.vendor.findFirst().then(v => {
  console.log('Keys in Vendor object:', Object.keys(v));
  console.log('mapsUrl value:', v.mapsUrl);
  process.exit();
}).catch(e => {
  console.error(e);
  process.exit(1);
});
