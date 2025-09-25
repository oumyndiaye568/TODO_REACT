# 🛠️ Configuration MySQL pour Todo App

## Problème identifié :
Votre projet utilise maintenant MySQL au lieu de SQLite, mais la configuration doit être ajustée.

## ✅ Corrections appliquées :

### 1. **Fichier .env corrigé**
```env
DATABASE_URL=mysql://phpmyadmin:oumy@localhost:3306/todolist
```

### 2. **Schéma Prisma mis à jour**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## 🚀 Étapes pour finaliser la configuration :

### Étape 1 : Vérifier MySQL
Assurez-vous que MySQL est installé et démarré :
```bash
sudo systemctl status mysql
# ou
sudo systemctl status mysqld
```

### Étape 2 : Créer la base de données
```sql
-- Dans MySQL :
CREATE DATABASE todolist;
GRANT ALL PRIVILEGES ON todolist.* TO 'phpmyadmin'@'localhost' IDENTIFIED BY 'oumy';
FLUSH PRIVILEGES;
```

### Étape 3 : Tester la connexion
```bash
cd backend
npx prisma db push
# ou si ça ne marche pas :
npx prisma migrate dev --name init_mysql
```

### Étape 4 : Régénérer Prisma
```bash
npx prisma generate
```

## 🔧 Dépannage :

### Erreur "Access denied"
- Vérifiez le mot de passe dans `.env`
- Assurez-vous que l'utilisateur `phpmyadmin` existe
- Vérifiez les permissions MySQL

### Erreur "Can't connect to MySQL server"
- Vérifiez que MySQL est démarré
- Vérifiez le port (3306)
- Vérifiez l'hôte (localhost)

### Alternative : Rester sur SQLite
Si MySQL pose trop de problèmes, vous pouvez revenir à SQLite :
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 🎯 Test final :
```bash
cd backend
npm run dev
```

L'application devrait maintenant fonctionner avec votre base MySQL !