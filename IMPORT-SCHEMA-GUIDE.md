# Guide d'Import du SchÃ©ma CIP FARO vers Azure PostgreSQL

## ✅ Configuration TerminÃ©e avec SuccÃ¨s

### Variables d'Environnement ConfigurÃ©es

Toutes les variables d'environnement ont été configurées avec succès dans Azure App Service :

- **DATABASE_URL** : `postgresql://cipfaro_admin@cipfaro-db-prod.postgres.database.azure.com:5432/cipfaro_app?sslmode=require`
- **NODE_ENV** : `production`
- **JWT_SECRET** : `CipFaro2024SecureJWT!Key`
- **DB_HOST** : `cipfaro-db-prod.postgres.database.azure.com`
- **DB_NAME** : `cipfaro_app`
- **DB_USER** : `cipfaro_admin`
- **DB_PORT** : `5432`
- **EMAIL_SERVICE** : `enabled`
- **UPLOAD_MAX_SIZE** : `5242880`

### Base de DonnÃ©es CrÃ©Ã©e

✅ **Serveur PostgreSQL** : `cipfaro-db-prod.postgres.database.azure.com`  
✅ **Base de données** : `cipfaro_app`  
✅ **Utilisateur** : `cipfaro_admin`  
✅ **Région** : `France Central`  

### Ã‰tape Finale : Import du SchÃ©ma

Pour finaliser la configuration, il faut importer le schéma de base de données. Voici les options disponibles :

#### Option 1 : Via Azure Portal (Recommandée)

1. **Allez sur** : https://portal.azure.com
2. **Naviguez vers** : Serveurs PostgreSQL flexibles → cipfaro-db-prod
3. **Cliquez sur** : "Se connecter" dans le menu de gauche
4. **Sélectionnez** : Base de données `cipfaro_app`
5. **Copiez le contenu** du fichier `database/azure-schema.sql`
6. **Collez et exécutez** dans l'éditeur de requête

#### Option 2 : Via psql Local

Si vous avez psql installé :

```bash
# Connectez-vous à la base
psql "host=cipfaro-db-prod.postgres.database.azure.com port=5432 dbname=cipfaro_app user=cipfaro_admin sslmode=require"

# Importez le schéma
\i database/azure-schema.sql

# Vérifiez les tables créées
\dt
```

#### Option 3 : Via Azure Cloud Shell

1. **Ouvrez** : https://shell.azure.com
2. **Exécutez** :
```bash
# Téléchargez le fichier de schéma (si nécessaire)
# Puis exécutez :
psql "host=cipfaro-db-prod.postgres.database.azure.com port=5432 dbname=cipfaro_app user=cipfaro_admin sslmode=require" -f azure-schema.sql
```

#### Option 4 : Via DBeaver ou pgAdmin

1. **Créez une nouvelle connexion** avec :
   - Host: `cipfaro-db-prod.postgres.database.azure.com`
   - Port: `5432`
   - Database: `cipfaro_app`
   - User: `cipfaro_admin`
   - SSL Mode: `require`

2. **Ouvrez le fichier** `database/azure-schema.sql`
3. **Exécutez le script**

### Contenu du SchÃ©ma

Le fichier `database/azure-schema.sql` contient :

- ✅ **Extensions PostgreSQL** (uuid-ossp)
- ✅ **Tables principales** :
  - `users` (utilisateurs avec rôles)
  - `formations` (catalogue des formations)
  - `formation_sessions` (sessions planifiées)
  - `inscriptions` (inscriptions des stagiaires)
  - `contact_requests` (demandes de contact)
  - `quote_requests` (demandes de devis)
  - `uploaded_files` (fichiers uploadés)
- ✅ **Index optimisés** pour les performances
- ✅ **Données de test** (formations d'exemple)
- ✅ **Triggers** pour mise à jour automatique
- ✅ **Contraintes de sécurité** et validation

### VÃ©rification Post-Import

Après l'import du schéma, vous pouvez vérifier que tout fonctionne :

```sql
-- Vérifier les tables créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Vérifier les formations de test
SELECT title, category, price FROM formations;

-- Vérifier les utilisateurs
SELECT email, role FROM users;
```

### Statut Final

🎉 **DÉPLOIEMENT AZURE RÉUSSI** 🎉

- ✅ **Site Web** : https://cipfaro-formations.com
- ✅ **URL Azure** : https://cipfaro-formations.azurewebsites.net  
- ✅ **SSL/HTTPS** : Configuré et valide
- ✅ **Infrastructure** : Azure App Service + PostgreSQL
- ✅ **Variables d'environnement** : Configurées
- ✅ **CI/CD** : GitHub Actions actif
- ⏳ **Base de données** : Prête pour l'import du schéma

### Prochaines Ã‰tapes

1. **Importez le schéma** via une des options ci-dessus
2. **Testez les fonctionnalités** sur le site de production
3. **Configurez les emails** (optionnel)
4. **Ajoutez du contenu** via l'interface d'administration

---

**🚀 Votre site CIP FARO est maintenant déployé sur Azure avec succès !**