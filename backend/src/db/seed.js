const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres:0920@localhost:5432/postgres?schema=public"
});

async function main() {
  console.log('Connecting to Prisma...');
  const passwordHash = await bcrypt.hash('123456', 8);
  console.log('Creating Admin...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: passwordHash,
      role: 'ADMIN',
      name: 'Admin',
    },
  });
  console.log('Seeded Admin:', admin.email);
}
main().catch(e => {
  console.error("SEED EXPERIENCED AN ERROR:");
  console.error(e.message || e);
  process.exit(1);
});
