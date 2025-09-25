import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données avant de seeder
  await prisma.historique.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.tache.deleteMany();
  await prisma.user.deleteMany();

  // Créer des utilisateurs de test avec des données textuelles variées
  const user1 = await prisma.user.create({
    data: {
      fullname: 'Paul Dubois',
      username: 'paul',
      password: bcrypt.hashSync('test123', 10),
      isTestUser: false,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      fullname: 'bachir',
      username: 'bachir@test.com',
      password: bcrypt.hashSync('test123', 10),
      isTestUser: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      fullname: 'ami ',
      username: 'ami@test.com',
      password: bcrypt.hashSync('test123', 10),
      isTestUser: true,
    },
  });

  // Créer des tâches de test avec des descriptions détaillées et variées
  const task1 = await prisma.tache.create({
    data: {
      libelle: 'Préparer la réunion d\'équipe hebdomadaire',
      description: 'Rassembler tous les documents importants, préparer l\'ordre du jour détaillé, vérifier la disponibilité de la salle de réunion et envoyer les invitations à tous les membres de l\'équipe avec les points à discuter.',
      status: 'EN_COURS',
      userId: user1.id,
    },
  });

  const task2 = await prisma.tache.create({
    data: {
      libelle: 'Faire les courses pour la semaine',
      description: 'Établir une liste complète des courses : pain frais, lait demi-écrémé, œufs bio, fromage de chèvre, pommes, bananes, carottes, tomates, riz complet, pâtes, huile d\'olive, et ne pas oublier les produits d\'hygiène.',
      status: 'TERMINE',
      userId: user1.id,
    },
  });

  const task3 = await prisma.tache.create({
    data: {
      libelle: 'Développer la fonctionnalité d\'authentification',
      description: 'Implémenter un système d\'authentification complet avec JWT pour sécuriser les routes API, ajouter la validation des données d\'entrée, gérer les erreurs de manière appropriée et créer des tests unitaires pour vérifier la robustesse du système.',
      status: 'EN_COURS',
      userId: user2.id,
    },
  });

  const task4 = await prisma.tache.create({
    data: {
      libelle: 'Finaliser le rapport annuel de l\'entreprise',
      description: 'Corriger toutes les erreurs typographiques et factuelles, ajouter les graphiques manquants pour illustrer les performances, vérifier la cohérence des données financières, et préparer la version finale pour impression et distribution.',
      status: 'EN_COURS',
      userId: user2.id,
    },
  });

  const task5 = await prisma.tache.create({
    data: {
      libelle: 'Organiser la fête d\'anniversaire surprise',
      description: 'Réserver un lieu adapté pour 20 personnes, créer la liste des invités et envoyer des invitations discrètes, préparer les décorations thématiques, organiser les jeux et animations, et s\'assurer que le gâteau soit commandé à temps.',
      status: 'EN_COURS',
      userId: user3.id,
    },
  });

  const task6 = await prisma.tache.create({
    data: {
      libelle: 'Mettre à jour le site web personnel',
      description: 'Ajouter de nouvelles photos dans la galerie, mettre à jour la section portfolio avec les derniers projets, corriger les liens brisés, optimiser les images pour le web, et vérifier la compatibilité avec les navigateurs modernes.',
      status: 'EN_COURS',
      userId: user3.id,
    },
  });

  const task7 = await prisma.tache.create({
    data: {
      libelle: 'Préparer le dossier pour la demande de prêt',
      description: 'Rassembler tous les documents nécessaires : bulletins de salaire, relevés bancaires, justificatifs de domicile, déclaration d\'impôts, et préparer une lettre de motivation expliquant l\'utilisation des fonds demandés.',
      status: 'TERMINE',
      userId: user1.id,
    },
  });

  // Créer des permissions de test (partage de tâches entre utilisateurs)
  await prisma.permission.create({
    data: {
      userId: user2.id,
      taskId: task1.id,
    },
  });

  await prisma.permission.create({
    data: {
      userId: user3.id,
      taskId: task3.id,
    },
  });

  await prisma.permission.create({
    data: {
      userId: user1.id,
      taskId: task5.id,
    },
  });

  // Créer des historiques de test avec différents types d'actions
  await prisma.historique.create({
    data: {
      action: 'création',
      userId: user1.id,
      tacheId: task1.id,
    },
  });

  await prisma.historique.create({
    data: {
      action: 'modification',
      userId: user1.id,
      tacheId: task2.id,
    },
  });

  await prisma.historique.create({
    data: {
      action: 'lecture',
      userId: user2.id,
      tacheId: task3.id,
    },
  });

  await prisma.historique.create({
    data: {
      action: 'suppression',
      userId: user3.id,
      tacheId: task5.id,
    },
  });

  await prisma.historique.create({
    data: {
      action: 'création',
      userId: user2.id,
      tacheId: task4.id,
    },
  });

  await prisma.historique.create({
    data: {
      action: 'modification',
      userId: user3.id,
      tacheId: task6.id,
    },
  });

  console.log('Base de données seedée avec succès avec des données de test complètes et variées pour valider toutes les fonctionnalités de l\'application TODO !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });