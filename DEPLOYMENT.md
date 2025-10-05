# 🚀 Guide de Déploiement - CIP FARO Site

## Architecture de Production

### Frontend - Azure Static Web Apps
- **Build** : `npm run build` 
- **Dossier de sortie** : `dist/`
- **Configuration** : `staticwebapp.config.json`
- **Variables d'environnement** : `.env.production`

### Backend API - Azure Functions ou App Service
- **Serveur** : Express.js avec TypeScript
- **Port** : 4000 (développement), configuré pour la production
- **Endpoints** : `/api/health`, `/api/formations`, `/api/contact`, `/api/devis`

## 📋 Checklist de Déploiement

### Étape 1 : Préparation
- [ ] Tests de l'application complétés
- [ ] Variables d'environnement configurées
- [ ] Build de production testé localement
- [ ] Documentation à jour

### Étape 2 : Build de Production
```bash
# Frontend
npm run build
npm run preview  # Test du build local

# API (si nécessaire)
cd api
npm run build
```

### Étape 3 : Configuration Azure

#### Static Web Apps
1. Créer une nouvelle Static Web App dans Azure
2. Connecter au repository GitHub
3. Configurer le workflow GitHub Actions
4. Ajouter les variables d'environnement dans Azure

#### App Service (API)
1. Créer un App Service pour l'API
2. Configurer Node.js 18+ runtime
3. Déployer via Git ou GitHub Actions
4. Configurer les variables d'environnement

### Étape 4 : DNS et Domaine
- [ ] Configurer le domaine personnalisé
- [ ] Certificat SSL activé
- [ ] Redirection HTTPS configurée

### Étape 5 : Tests Post-Déploiement
- [ ] Vérifier toutes les pages
- [ ] Tester l'intégration API
- [ ] Vérifier les formulaires de contact
- [ ] Tests de performance (Lighthouse)

## 🔧 Scripts de Déploiement

### Déploiement automatique (GitHub Actions)
Le fichier `.github/workflows/azure-static-web-apps.yml` est configuré pour :
- Build automatique sur push vers `main`
- Tests automatisés
- Déploiement vers Azure Static Web Apps

### Déploiement manuel
```bash
# 1. Construire le projet
npm run build

# 2. Déployer vers Azure Static Web Apps (avec SWA CLI)
npx @azure/static-web-apps-cli deploy ./dist --env production

# 3. Ou utiliser Azure CLI
az staticwebapp create --name cipfaro-site --resource-group cipfaro-rg
```

## 📊 Monitoring et Maintenance

### Analytics et Monitoring
- Google Analytics configuré
- Azure Application Insights pour l'API
- Monitoring des performances avec Lighthouse

### Sauvegarde et Versioning
- Code versionné sur GitHub
- Branches : `main` (production), `develop` (développement)
- Tags pour les releases

## 🔐 Sécurité

### Headers de Sécurité
- HTTPS uniquement
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- Headers sécurisés via `helmet.js`

### Variables Sensibles
- Toutes les clés API dans Azure Key Vault
- Variables d'environnement sécurisées
- Pas de secrets dans le code source

## 📞 Support

### Logs et Debugging
- Logs API dans Azure App Service
- Console navigateur pour erreurs frontend
- Monitoring des performances avec Azure

### Contacts
- **Développement** : GitHub Issues
- **Production** : Contact administrateur Azure
- **Domaine** : Configuration DNS via registrar