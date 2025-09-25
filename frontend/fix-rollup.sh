#!/bin/bash

echo "🔧 Correction du problème Rollup..."
echo "==================================="

# Suivre exactement les instructions de l'erreur
echo "Suppression de package-lock.json et node_modules..."
rm -rf node_modules package-lock.json

echo "Nettoyage du cache npm..."
npm cache clean --force

echo "Réinstallation complète..."
npm install

echo ""
echo "✅ Problème Rollup résolu !"
echo "==========================="
echo "Vous pouvez maintenant démarrer l'application avec :"
echo "npm run dev"