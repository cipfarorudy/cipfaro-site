# 🚀 Guide de Développement Local - CIP FARO

## 📋 Prérequis

- Node.js 18+ installé
- npm ou yarn
- Navigateur moderne

## ⚡ Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration locale
Le fichier `.env.local` est déjà configuré avec :
- API locale sur `http://localhost:3000`
- Authentification locale activée
- EmailJS en mode test
- Google Analytics désactivé

### 3. Démarrage du serveur API local
```bash
npm run local
```
Serveur API disponible sur : http://localhost:3000

### 4. Démarrage de l'application
```bash
npm run dev
```
Application disponible sur : http://localhost:5173

### 5. Démarrage complet (API + App)
```bash
npm run dev:full
```
Lance simultanément le serveur API et l'application.

## 🔑 Comptes de Test Locaux

| Rôle | Email | Mot de passe | Permissions |
|------|-------|--------------|-------------|
| **Admin** | `admin@cipfaro-formations.com` | `admin123` | Tous les droits |
| **Formateur** | `formateur@cipfaro-formations.com` | `formateur123` | Formations, stagiaires |
| **Stagiaire** | `stagiaire@cipfaro-formations.com` | `stagiaire123` | Profil, formations |
| **Secrétariat** | `secretariat@cipfaro-formations.com` | `secretariat123` | Candidatures, offres |

## 🛠 API Endpoints Locaux

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/refresh` - Rafraîchissement du token

### Candidatures & Recrutement
- `POST /api/candidatures` - Soumettre une candidature
- `GET /api/candidatures` - Lister les candidatures
- `POST /api/offres-emploi` - Publier une offre d'emploi
- `GET /api/offres-emploi` - Lister les offres

### Formations
- `POST /api/preinscriptions` - Préinscription à une formation
- `POST /api/devis` - Demande de devis

### Utilitaires
- `GET /api/health` - Vérification de l'état du serveur
- `GET /api/stats` - Statistiques (admin)
- `POST /api/contact` - Messages de contact

## 📊 Tests des Fonctionnalités

### ✅ Test de Connexion
1. Aller sur http://localhost:5173/connexion
2. Utiliser un des comptes de test
3. Vérifier la redirection selon le rôle

### ✅ Test des Formulaires
1. **Préinscription** : `/preinscription` - Test avec génération PDF
2. **Recrutement** : `/recrutement` - Test candidature/offre
3. **Contact** : `/contact` - Test envoi message
4. **Devis** : `/devis` - Test demande personnalisée

### ✅ Test des Espaces Utilisateurs
- **Admin** : `/admin` - Gestion des candidatures
- **Formateur** : `/formateur` - Suivi des groupes
- **Stagiaire** : `/stagiaire` - Progression formations

## 🔧 Configuration des Services

### EmailJS (Mode Local)
- Service ID: `service_test`
- Templates configurés en mode test
- Emails simulés dans la console

### Google Analytics (Désactivé)
- Pas de tracking en local
- Variable `VITE_GA_MEASUREMENT_ID` vide

### Azure Services (Simulés)
- Logic Apps webhook : `http://localhost:8080/webhook`
- Azure Functions : `http://localhost:7071/api`

## 📝 Logs et Debug

### Serveur API
Les logs s'affichent dans le terminal du serveur :
- 📝 Candidatures reçues
- 🏢 Offres d'emploi
- 🎓 Préinscriptions
- 🔑 Authentifications

### Application React
Logs dans la console du navigateur (F12) :
- 🔐 État d'authentification
- 📧 Envois d'emails simulés
- 🚀 Navigation entre pages

## 🚨 Résolution de Problèmes

### Port déjà utilisé
```bash
# Changer le port de l'API
PORT=3001 npm run local

# Ou modifier server-local.js ligne 7
```

### Erreurs CORS
- Le serveur local inclut CORS activé
- Vérifier que l'API tourne sur le bon port

### Variables d'environnement
```bash
# Vérifier le fichier actuel
cat .env.local

# Créer si manquant
cp .env.example .env.local
```

## 🔄 Hot Reload

- **Application** : Rechargement automatique avec Vite
- **API** : Redémarrage manuel nécessaire après modifications

## 📦 Build Local

```bash
# Build avec config locale
npm run build

# Prévisualiser le build
npm run preview
```

## 🌍 Migration vers Production

1. Configurer `.env.production` avec les vraies URLs
2. Remplacer `VITE_USE_LOCAL_AUTH=false`
3. Ajouter les vraies clés EmailJS et GA
4. Déployer sur Azure Static Web Apps

---

**🎯 Bon développement !** 
Pour toute question, consulter la documentation dans `/docs/`