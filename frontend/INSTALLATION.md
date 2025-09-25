# 🚨 INSTALLATION REQUISE - GUIDE RAPIDE (JavaScript)

## Le problème :
Les erreurs montrent que React n'est pas installé.

## 🚀 SOLUTION LA PLUS SIMPLE : Script automatique

### Pour les installations normales :
```bash
cd frontend
chmod +x setup.sh
./setup.sh
```

### 🔧 Si vous avez des erreurs persistantes :
```bash
cd frontend
chmod +x clean-install.sh
./clean-install.sh
```

**Ce script fait un nettoyage complet et réinstalle tout avec gestion des erreurs.**

## 🛠️ GUIDE DE DÉPANNAGE PAR ERREUR

### Si `npm install` échoue → `./clean-install.sh`
### Si `npm run dev` donne une erreur Rollup → `./fix-rollup.sh`
### Pour une installation normale → `./setup.sh`

Ce script installe automatiquement toutes les dépendances avec la résolution des conflits.

## Installation manuelle (si le script ne fonctionne pas) :

### Étape 1 : Installer React
```bash
cd frontend
npm install react@18.2.0 react-dom@18.2.0 --save
```

### Étape 2 : Installer Vite
```bash
npm install vite@5.0.0 @vitejs/plugin-react@4.3.1 --save-dev
```

### Étape 3 : Installer Tailwind CSS
```bash
npm install tailwindcss@3.3.6 autoprefixer@10.4.16 postcss@8.4.31 --save-dev
```

### Étape 4 : Installer les autres libs
```bash
npm install axios@1.6.0 react-router-dom@6.20.0 --save
```

## 🔧 Dépannage des erreurs courantes :

### Erreur "ENOTEMPTY: directory not empty"
Si vous avez cette erreur, nettoyez d'abord :
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
```

### Erreurs de conflit de dépendances :
Utilisez l'option `--legacy-peer-deps` :
```bash
# Installation complète en une fois
npm install --legacy-peer-deps

# Ou utilisez le script automatique
./setup.sh
```

### Erreur "Invalid Version"
Cette erreur vient de versions incompatibles dans package.json. Utilisez :
```bash
./clean-install.sh
```

### Erreur "vite: command not found"
Les dépendances ne sont pas installées. Utilisez :
```bash
./clean-install.sh
```

### Erreur "Cannot find module @rollup/rollup-linux-x64-gnu"
Problème connu de npm avec les dépendances optionnelles. Utilisez :
```bash
./fix-rollup.sh
```

### Erreur "ENOTEMPTY: directory not empty"
Le cache npm est corrompu. Utilisez :
```bash
./clean-install.sh
```

## Démarrage :
```bash
# Backend
cd ../backend && npm install && npm run dev

# Frontend (nouvelle fenêtre)
cd frontend && npm run dev
```

## Accès :
- Frontend : http://localhost:5173
- Backend : http://localhost:3010

**Suivez ces étapes dans l'ordre et l'application fonctionnera !**