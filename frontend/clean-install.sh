#!/bin/bash

echo "🧹 Nettoyage complet du projet..."
echo "================================="

# Nettoyer complètement
rm -rf node_modules package-lock.json .npm
npm cache clean --force 2>/dev/null || true

echo ""
echo "📦 Réinstallation complète des dépendances..."
echo "============================================="

# Installation étape par étape avec gestion d'erreurs
install_with_retry() {
    local package=$1
    local max_attempts=3
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo "Tentative $attempt/$max_attempts : Installation de $package"
        if npm install $package --legacy-peer-deps 2>/dev/null; then
            echo "✅ $package installé avec succès"
            return 0
        else
            echo "❌ Échec tentative $attempt pour $package"
            attempt=$((attempt + 1))
            sleep 2
        fi
    done

    echo "💥 Échec définitif de l'installation de $package"
    return 1
}

# Installation des dépendances principales
install_with_retry "react@18.2.0"
install_with_retry "react-dom@18.2.0"
install_with_retry "axios@1.6.0"
install_with_retry "react-router-dom@6.20.0"

# Installation des dépendances de développement
install_with_retry "vite@5.0.0 --save-dev"
install_with_retry "@vitejs/plugin-react@4.3.1 --save-dev"
install_with_retry "tailwindcss@3.3.6 --save-dev"
install_with_retry "autoprefixer@10.4.16 --save-dev"
install_with_retry "postcss@8.4.31 --save-dev"

echo ""
echo "🎉 Installation terminée !"
echo "=========================="
echo "Vous pouvez maintenant démarrer l'application avec :"
echo "npm run dev"