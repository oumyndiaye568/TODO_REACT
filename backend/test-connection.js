// Script de test pour créer un utilisateur de test
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { login: 'admin' }
    });
    
    if (existingUser) {
      console.log('L\'utilisateur admin existe déjà');
      return;
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    // Créer l'utilisateur de test
    const user = await prisma.user.create({
      data: {
        fullname: 'Administrateur',
        login: 'admin',
        password: hashedPassword
      }
    });
    
    console.log('Utilisateur de test créé:', { id: user.id, fullname: user.fullname, login: user.login });
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
