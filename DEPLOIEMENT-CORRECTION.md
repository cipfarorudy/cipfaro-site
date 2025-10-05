# Correction du problème de déploiement Azure

## Problème identifié
- L'App Service retourne une erreur 503
- Les logs montrent que npm n'est pas trouvé, indiquant que l'environnement PHP est utilisé au lieu de Node.js
- Configuration runtime correcte mais déploiement défaillant

## Corrections apportées
1. Configuration explicite du runtime Node.js 20-lts
2. Variables d'environnement WEBSITE_NODE_DEFAULT_VERSION et SCM_DO_BUILD_DURING_DEPLOYMENT configurées
3. Force un nouveau déploiement via GitHub Actions

## Déploiement forcé
Ce fichier déclenche automatiquement un redéploiement via GitHub Actions
Date: 2025-10-05 16:56:00