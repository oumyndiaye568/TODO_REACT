#!/bin/bash

echo "Installation des dépendances pour Todo App Frontend..."
echo "================================================"

# Fonction pour installer un package
install_package() {
    local package=$1
    echo "Installation de $package..."
    if npm install $package --save 2>/dev/null; then
        echo "✅ $package installé avec succès"
    else
        echo "❌ Échec de l'installation de $package"
        return 1
    fi
}

# Fonction pour installer un package dev
install_dev_package() {
    local package=$1
    echo "Installation de $package (dev)..."
    if npm install $package --save-dev 2>/dev/null; then
        echo "✅ $package installé avec succès"
    else
        echo "❌ Échec de l'installation de $package"
        return 1
    fi
}

echo "Installation des dépendances principales..."

# Dépendances principales
install_package "react"
install_package "react-dom"
install_package "axios"
install_package "react-router-dom"

echo ""
echo "Installation des dépendances de développement..."

# Dépendances de développement
install_dev_package "@types/react"
install_dev_package "@types/react-dom"
install_dev_package "@vitejs/plugin-react"
install_dev_package "typescript"
install_dev_package "tailwindcss"
install_dev_package "autoprefixer"
install_dev_package "postcss"
install_dev_package "vite"

echo ""
echo "Installation terminée !"
echo "Vous pouvez maintenant démarrer l'application avec :"
echo "npm run dev"