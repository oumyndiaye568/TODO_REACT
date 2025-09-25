#!/bin/bash

echo "🧪 Test de connexion MySQL..."
echo "=============================="

# Test de connexion MySQL
echo "Test de connexion à MySQL..."
mysql -h localhost -P 3306 -u phpmyadmin -poumy -e "SELECT 1;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Connexion MySQL réussie"
else
    echo "❌ Échec de connexion MySQL"
    echo "Vérifiez :"
    echo "  - MySQL est démarré"
    echo "  - L'utilisateur 'phpmyadmin' existe"
    echo "  - Le mot de passe 'oumy' est correct"
    exit 1
fi

# Test de la base de données
echo ""
echo "Test de la base de données 'todolist'..."
mysql -h localhost -P 3306 -u phpmyadmin -poumy -e "USE todolist; SELECT 'OK' as status;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Base de données 'todolist' accessible"
else
    echo "❌ Base de données 'todolist' introuvable"
    echo "Création de la base :"
    echo "mysql -u phpmyadmin -p -e 'CREATE DATABASE todolist;'"
    exit 1
fi

# Test Prisma
echo ""
echo "Test de Prisma..."
cd ..
npx prisma db push --accept-data-loss 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Schéma Prisma appliqué avec succès"
else
    echo "❌ Erreur Prisma"
    echo "Vérifiez la configuration dans .env et schema.prisma"
fi

echo ""
echo "🎉 Configuration MySQL terminée !"