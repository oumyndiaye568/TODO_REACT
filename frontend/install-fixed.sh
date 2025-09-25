#!/bin/bash

echo "Installation des dépendances avec résolution des conflits..."
echo "======================================================="

# Installation avec --legacy-peer-deps pour éviter les conflits
echo "Installation de React..."
npm install react@18.2.0 react-dom@18.2.0 --save --legacy-peer-deps

echo "Installation de Vite..."
npm install vite@5.0.0 @vitejs/plugin-react@4.3.1 --save-dev --legacy-peer-deps

echo "Installation de Tailwind CSS..."
npm install tailwindcss@3.3.6 autoprefixer@10.4.16 postcss@8.4.31 --save-dev --legacy-peer-deps

echo "Installation des autres librairies..."
npm install axios@1.6.0 react-router-dom@6.20.0 --save --legacy-peer-deps

echo ""
echo "✅ Installation terminée !"
echo "Vous pouvez maintenant démarrer l'application avec :"
echo "npm run dev"