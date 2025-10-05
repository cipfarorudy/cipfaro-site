# Migration vers Azure Static Web Apps

## Problème Identifié
L'App Service Azure a des difficultés à démarrer correctement le serveur Node.js, causant des erreurs 503.

## Solution Recommandée
Migrer vers Azure Static Web Apps qui est parfaitement adapté aux applications React:

### Avantages d'Azure Static Web Apps:
1. **Optimisé pour les SPA**: Conçu spécifiquement pour React, Vue, Angular
2. **Déploiement automatique**: Intégration GitHub Actions native
3. **CDN global**: Performances optimales partout dans le monde  
4. **SSL automatique**: Certificats HTTPS automatiques
5. **Domaines personnalisés**: Support natif pour cipfaro-formations.com
6. **Coût réduit**: Moins cher qu'App Service pour les sites statiques

### Étapes de migration:
```bash
# 1. Créer Azure Static Web App
az staticwebapp create \
  --name cipfaro-formations-swa \
  --resource-group rg-cipfaro-prod \
  --source https://github.com/cipfarorudy/cipfaro-site \
  --location "West Europe" \
  --branch main \
  --app-location "/" \
  --output-location "dist"

# 2. Configuration automatique GitHub Actions
# 3. DNS update pour pointer vers la nouvelle URL
# 4. Configuration domaine personnalisé
```

## Alternative Immédiate
Si migration non possible maintenant, corriger l'App Service:
1. Vérifier que npm install s'exécute correctement
2. S'assurer que NODE_ENV=production
3. Vérifier les variables d'environnement
4. Tester le déploiement avec un serveur Express simplifié

## État Actuel
- Infrastructure déployée ✅
- Build local fonctionnel ✅  
- Problème: Serveur Node.js ne démarre pas sur Azure App Service ❌
- Alternative: Migration vers Static Web Apps recommandée ✅