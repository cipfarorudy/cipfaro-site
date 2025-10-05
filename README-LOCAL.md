# 🚀 Environnement de Développement Local - CIP FARO

## ⚡ Démarrage Ultra-Rapide

### Windows (PowerShell)
```powershell
# Exécuter le script de démarrage automatique
.\start-dev.ps1
```

### Linux/Mac (Bash)
```bash
# Rendre le script exécutable et le lancer
chmod +x start-dev.sh
./start-dev.sh
```

### Démarrage Manuel
```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer l'application React (port 5173)
npm run dev

# 3. (Optionnel) Démarrer l'API locale (port 3001)
npm run local
```

## 🔑 Connexion Locale

L'authentification est configurée en mode **local** avec des comptes de test :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| 👑 **Admin** | `admin@cipfaro-formations.com` | `admin123` |
| 👨‍🏫 **Formateur** | `formateur@cipfaro-formations.com` | `formateur123` |
| 🎓 **Stagiaire** | `stagiaire@cipfaro-formations.com` | `stagiaire123` |
| 📋 **Secrétariat** | `secretariat@cipfaro-formations.com` | `secretariat123` |

## 🌐 URLs de Développement

- **Application** : http://localhost:5173
- **API Backend** : http://localhost:3001
- **Health Check** : http://localhost:3001/api/health

## 🧪 Test des Fonctionnalités

### ✅ Test Authentification
1. Aller sur http://localhost:5173/connexion
2. Utiliser un des comptes ci-dessus
3. Vérifier la redirection selon le rôle

### ✅ Test Formulaires
- **Préinscription** : `/preinscription` (génération PDF + API)
- **Recrutement** : `/recrutement` (candidature + offre d'emploi)
- **Contact** : `/contact` (envoi de message)
- **Devis** : `/devis` (demande personnalisée)

### ✅ Test Espaces Utilisateurs
- **Admin** : `/admin` - Gestion candidatures
- **Formateur** : `/formateur` - Suivi groupes
- **Stagiaire** : `/stagiaire` - Progression

## 🔧 Configuration Locale

Le fichier `.env.local` est automatiquement configuré avec :

```bash
# API locale
VITE_API_BASE=http://localhost:3001/api

# Authentification locale activée
VITE_USE_LOCAL_AUTH=true

# Google Analytics désactivé (pas de tracking en dev)
VITE_GA_MEASUREMENT_ID=

# EmailJS en mode test (emails simulés)
VITE_EMAILJS_SERVICE_ID=service_test
```

## 📊 API Endpoints Disponibles

```bash
# Authentification
POST /api/auth/login
POST /api/auth/refresh

# Données
POST /api/candidatures
GET /api/candidatures
POST /api/preinscriptions

# Utilitaires
GET /api/health
```

## 🚨 Résolution de Problèmes

### Port déjà utilisé
```bash
# Changer le port de l'API
PORT=3002 npm run local
```

### Redémarrage complet
```bash
# Arrêter tous les processus Node.js
taskkill /f /im node.exe  # Windows
# ou
pkill node  # Linux/Mac

# Relancer
npm run dev
```

### Réinitialiser la configuration
```bash
# Supprimer et recréer .env.local
rm .env.local
cp .env.example .env.local
# Puis modifier les valeurs pour le local
```

## 🎯 Fonctionnalités Activées en Local

- ✅ **Authentification** : Comptes de test intégrés
- ✅ **Formulaires** : Simulation d'envoi API
- ✅ **EmailJS** : Emails simulés (pas d'envoi réel)
- ✅ **PDF** : Génération de PDF fonctionnelle
- ✅ **Navigation** : Toutes les pages accessibles
- ❌ **Google Analytics** : Désactivé (pas de tracking)
- ❌ **Azure Services** : Simulés localement

## 📝 Logs de Développement

### Console API (Terminal)
```
📝 Nouvelle candidature reçue: {...}
🎓 Nouvelle préinscription reçue: {...}
🔑 Connexion utilisateur: admin@...
```

### Console Navigateur (F12)
```
🔐 Système d'authentification initialisé (LOCAL)
✅ Utilisateur connecté: Admin (admin)
📧 Email simulé (configuration manquante)
```

---

**🎯 Happy Coding !** L'environnement local est prêt pour le développement.