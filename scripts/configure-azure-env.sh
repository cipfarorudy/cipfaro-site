#!/bin/bash

# Script de configuration des variables d'environnement Azure
# Configuration de l'application CIP FARO sur Azure App Service

echo "🔧 Configuration des variables d'environnement pour cipfaro-formations..."

# Variables de base
az webapp config appsettings set \
    --name "cipfaro-formations" \
    --resource-group "rg-cipfaro-prod" \
    --settings \
    NODE_ENV="production"

az webapp config appsettings set \
    --name "cipfaro-formations" \
    --resource-group "rg-cipfaro-prod" \
    --settings \
    WEBSITE_NODE_DEFAULT_VERSION="~20"

az webapp config appsettings set \
    --name "cipfaro-formations" \
    --resource-group "rg-cipfaro-prod" \
    --settings \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true"

# Base de données
az webapp config appsettings set \
    --name "cipfaro-formations" \
    --resource-group "rg-cipfaro-prod" \
    --settings \
    DATABASE_URL="postgresql://cipfaroadmin:CipFaro2024!Secure@cipfaro-db-prod.postgres.database.azure.com:5432/cipfaro_app?sslmode=require"

# Sécurité
az webapp config appsettings set \
    --name "cipfaro-formations" \
    --resource-group "rg-cipfaro-prod" \
    --settings \
    JWT_SECRET="CipFaro2024SecureJWT!Key123"

# Services
az webapp config appsettings set \
    --name "cipfaro-formations" \
    --resource-group "rg-cipfaro-prod" \
    --settings \
    EMAIL_SERVICE="enabled"

az webapp config appsettings set \
    --name "cipfaro-formations" \
    --resource-group "rg-cipfaro-prod" \
    --settings \
    UPLOAD_MAX_SIZE="5242880"

# CORS
az webapp config appsettings set \
    --name "cipfaro-formations" \
    --resource-group "rg-cipfaro-prod" \
    --settings \
    CORS_ORIGINS="https://cipfaro-formations.com,https://cipfaro-formations.azurewebsites.net"

echo "✅ Variables d'environnement configurées avec succès !"
echo "🔄 Redémarrage de l'application..."

# Redémarrage de l'application
az webapp restart --name "cipfaro-formations" --resource-group "rg-cipfaro-prod"

echo "🎉 Configuration terminée !"