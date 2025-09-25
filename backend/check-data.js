import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('=== USERS ===');
    const users = await prisma.user.findMany();
    console.log(users);

    console.log('\n=== TASKS ===');
    const tasks = await prisma.tache.findMany({
      include: { user: true, permission: { include: { user: true } } }
    });
    console.log(tasks);

    console.log('\n=== PERMISSIONS ===');
    const permissions = await prisma.permission.findMany({
      include: { user: true, task: true }
    });
    console.log(permissions);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();