# 🎯 GUIDE D'UTILISATION - Site CIP FARO 100% Fonctionnel

## 🚀 DÉMARRAGE RAPIDE

### 1. Vérifier que les serveurs sont actifs

**Backend API :**
```bash
cd api
npm run dev
# Serveur sur http://localhost:3000
```

**Frontend :**
```bash
npm run dev  
# Serveur sur http://localhost:5173
```

### 2. Tester toutes les fonctionnalités

Ouvrir : `http://localhost:5173/test-api-complete.html`

## 📋 FONCTIONNALITÉS TESTÉES ET VALIDÉES

### ✅ Authentification
- **Connexion** : `stagiaire@test.fr` / `stagiaire123`
- **Admin** : `admin@cipfaro.fr` / `admin123`
- **Inscription** : Création de nouveaux comptes

### ✅ Formulaires Opérationnels

#### 📧 Contact
- Validation des champs
- Email automatique
- Confirmation utilisateur
- Notification équipe

#### 📝 Pré-inscription
- Upload CV (PDF, DOC, DOCX)
- Validation formation
- Email confirmation
- Référence unique

#### 💰 Devis
- Calcul automatique
- Email confirmation  
- Suivi commercial
- Données entreprise

## 🔧 CONFIGURATION PRODUCTION

### Variables d'environnement à modifier :

```bash
# API (.env)
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/cipfaro
JWT_SECRET=your-super-secure-jwt-secret
EMAIL_USER=contact@cipfaro.fr
EMAIL_PASSWORD=your-gmail-app-password
```

### Base de données PostgreSQL

1. Créer la base de données :
```sql
CREATE DATABASE cipfaro;
```

2. Exécuter le schéma :
```bash
psql -d cipfaro -f database/schema.sql
```

### Configuration Email

1. Activer l'authentification 2 facteurs sur Gmail
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans EMAIL_PASSWORD

## 📊 MONITORING

### Logs API
- Console du serveur Node.js
- Requêtes HTTP avec Morgan
- Erreurs avec stack traces

### Santé du système
- `GET /api/health` pour status
- `GET /api` pour documentation
- Vérification ports 3000 et 5173

## 🔒 SÉCURITÉ

### Implémentée
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet pour headers sécurisés
- ✅ CORS configuré
- ✅ Validation des uploads
- ✅ Sanitisation des inputs

### Recommandations production
- [ ] HTTPS obligatoire
- [ ] Variables d'environnement sécurisées  
- [ ] Logs centralisés
- [ ] Monitoring d'erreurs
- [ ] Backup base de données

## 🚀 DÉPLOIEMENT

### Option 1: Serveur VPS
1. Node.js + PostgreSQL
2. Nginx reverse proxy
3. PM2 pour process management
4. Certificat SSL Let's Encrypt

### Option 2: Cloud
1. **Backend** : Railway/Render/Heroku
2. **Frontend** : Netlify/Vercel
3. **BDD** : Supabase/Railway PostgreSQL
4. **Email** : SendGrid/Mailgun

## 📞 SUPPORT

### En cas de problème

1. **API ne démarre pas** :
   - Vérifier les dépendances : `npm install`
   - Vérifier le port 3000 libre
   - Logs dans la console

2. **Upload de fichiers échoue** :
   - Vérifier dossier `/uploads` créé
   - Permissions d'écriture
   - Taille fichier < 5MB

3. **Emails non envoyés** :
   - Configuration Gmail correcte
   - Mot de passe d'application
   - Mode développement = logs console

### Tests disponibles
- Page de test : `test-api-complete.html`
- API documentation : `http://localhost:3000/api`
- Health check : `http://localhost:3000/api/health`

## 🎉 FÉLICITATIONS !

Votre site CIP FARO est maintenant **100% fonctionnel** avec :

- ✅ Formulaires réels avec base de données
- ✅ Upload de fichiers sécurisé
- ✅ Emails automatiques
- ✅ Authentification complète
- ✅ Interface d'administration
- ✅ API REST complète

**Prêt pour les vrais utilisateurs ! 🚀**