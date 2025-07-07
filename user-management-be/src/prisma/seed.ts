import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      name: '',
    },
    create: {
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {
      name: 'Bob',
    },
    create: {
      email: 'user1@example.com',
      password: userPassword,
      role: 'user',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {
      name: 'Mike',
    },
    create: {
      email: 'user2@example.com',
      password: userPassword,
      role: 'user',
    },
  });

  console.log({ admin, user1, user2 });
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
