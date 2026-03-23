import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

  console.log('Seeded Categories...');
  const categories = ['rings', 'necklaces', 'earrings', 'bracelets'];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c },
      update: {},
      create: { name: c }
    });
  }

  console.log('Seeded Metal Types...');
  const metals = [
    { name: 'gold', price: 6500 },
    { name: 'silver', price: 150 },
    { name: 'rose-gold', price: 6600 },
    { name: 'platinum', price: 7500 }
  ];
  for (const m of metals) {
    await prisma.metalType.upsert({
      where: { name: m.name },
      update: { pricePerGram: m.price },
      create: { name: m.name, pricePerGram: m.price }
    });
  }
}
main().catch(e => {
  console.error("SEED EXPERIENCED AN ERROR:");
  console.error(e.message || e);
  process.exit(1);
});
