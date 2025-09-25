# Todo App Frontend

Application frontend React pour la gestion des tâches Todo, développée avec Vite, React et Tailwind CSS.

## 🚨 PROBLÈME D'INSTALLATION - SOLUTION REQUISE

**Les dépendances npm ne s'installent pas automatiquement.** Vous devez les installer manuellement.

### Étapes de dépannage :

1. **Vérifiez votre connexion internet**
2. **Essayez avec un VPN** si nécessaire
3. **Installez Node.js/npm** depuis le site officiel si problème

### Installation manuelle des dépendances :

```bash
cd frontend

# Installation des dépendances principales
npm install react@18.2.0 react-dom@18.2.0 --save
npm install axios@1.6.0 react-router-dom@6.20.0 --save

# Installation des dépendances de développement
npm install @types/react@18.2.37 @types/react-dom@18.2.15 --save-dev
npm install @vitejs/plugin-react@4.1.1 typescript@5.2.2 vite@5.0.0 --save-dev
npm install tailwindcss@3.3.6 autoprefixer@10.4.16 postcss@8.4.31 --save-dev
```

### Alternative : Script d'installation automatique
```bash
cd frontend
chmod +x install-deps.sh
./install-deps.sh
```

## 🔧 GUIDE DE DÉPANNAGE COMPLET

### Problème identifié :
Les erreurs TypeScript indiquent que les modules React ne sont pas installés :
```
Le module 'react' n'a pas d'exportation par défaut
```

### Solutions par ordre de priorité :

#### 1. **Installation manuelle étape par étape**
```bash
cd frontend

# Étape 1 : Installer React
npm install react@18.2.0 --save

# Étape 2 : Installer React DOM
npm install react-dom@18.2.0 --save

# Étape 3 : Installer les types TypeScript
npm install @types/react@18.2.37 @types/react-dom@18.2.15 --save-dev

# Étape 4 : Installer Vite et TypeScript
npm install vite@5.0.0 @vitejs/plugin-react@4.1.1 typescript@5.2.2 --save-dev

# Étape 5 : Installer Tailwind CSS
npm install tailwindcss@3.3.6 autoprefixer@10.4.16 postcss@8.4.31 --save-dev

# Étape 6 : Installer les autres dépendances
npm install axios@1.6.0 react-router-dom@6.20.0 --save
```

#### 2. **Si npm ne fonctionne toujours pas**
- Vérifiez votre connexion internet
- Essayez avec un VPN
- Utilisez un autre réseau
- Réinstallez Node.js depuis https://nodejs.org

#### 3. **Installation alternative avec yarn**
```bash
cd frontend
yarn install
```

#### 4. **Vérification de l'installation**
Après installation, vérifiez que `node_modules` existe :
```bash
ls -la frontend/node_modules | head -10
```

### Démarrage de l'application :
```bash
# Terminal 1 : Backend
cd backend
npm install
npm run dev

# Terminal 2 : Frontend
cd frontend
npm run dev
```

### URLs d'accès :
- Frontend : http://localhost:5173
- Backend : http://localhost:3010

### Démarrage du serveur de développement

```bash
npm run dev
# ou
yarn dev
```

L'application sera disponible sur `http://localhost:5173`

## Démarrage du backend

Assurez-vous que le backend est démarré sur le port 3010 :

```bash
cd ../backend
npm install
npm run dev
```

## Fonctionnalités

- ✅ Authentification (login/register)
- ✅ Gestion complète des tâches (CRUD)
- ✅ Délégation des tâches
- ✅ Historique des actions
- ✅ Interface responsive avec Tailwind CSS
- ✅ Upload d'images pour les tâches

## Structure du projet

```
src/
├── components/
│   ├── Login.tsx          # Page de connexion
│   ├── Register.tsx       # Page d'inscription
│   ├── Dashboard.tsx      # Page principale
│   ├── TaskList.tsx       # Liste des tâches
│   ├── TaskForm.tsx       # Formulaire de tâche
│   └── History.tsx        # Historique des actions
├── context/
│   └── AuthContext.tsx    # Gestion de l'authentification
├── App.tsx                # Configuration des routes
├── main.tsx               # Point d'entrée
└── index.css              # Styles Tailwind
```

## API Endpoints utilisés

- `POST /auth` - Connexion
- `POST /auth/create` - Inscription
- `GET /tasks` - Liste des tâches
- `POST /tasks` - Créer une tâche
- `PUT /tasks/:id` - Modifier une tâche
- `DELETE /tasks/:id` - Supprimer une tâche
- `POST /tasks/:id/delegate/:userId` - Déléguer une tâche
- `GET /users` - Liste des utilisateurs
- `GET /history` - Historique des actions