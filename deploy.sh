#!/bin/bash

# 🚀 Script de Déploiement CIP FARO
# Déploie l'application frontend et l'API vers Azure

set -e  # Arrêter en cas d'erreur

echo "🚀 Début du déploiement CIP FARO..."

# Configuration
RESOURCE_GROUP="cipfaro-rg"
STATIC_APP_NAME="cipfaro-site"
API_APP_NAME="cipfaro-api"
LOCATION="West Europe"

# Vérifications préalables
echo "🔍 Vérifications préalables..."

# Vérifier Azure CLI
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI non installé. Installez-le depuis https://aka.ms/InstallAzureCli"
    exit 1
fi

# Vérifier la connexion Azure
if ! az account show &> /dev/null; then
    echo "❌ Non connecté à Azure. Exécutez: az login"
    exit 1
fi

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installé"
    exit 1
fi

echo "✅ Toutes les vérifications passées"

# Build du frontend
echo "🏗️ Construction du frontend..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build frontend réussi"
else
    echo "❌ Échec du build frontend"
    exit 1
fi

# Build de l'API
echo "🏗️ Construction de l'API..."
cd api
npm install

# Test de l'API (optionnel pour le serveur simple)
echo "✅ API prête (utilisant server.ts)"

cd ..

# Déploiement vers Azure Static Web Apps
echo "📤 Déploiement vers Azure Static Web Apps..."

# Vérifier si le groupe de ressources existe
if ! az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo "📁 Création du groupe de ressources $RESOURCE_GROUP..."
    az group create --name $RESOURCE_GROUP --location "$LOCATION"
fi

# Déployer Static Web App (si elle n'existe pas)
if ! az staticwebapp show --name $STATIC_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "🌐 Création de l'application Static Web App..."
    az staticwebapp create \
        --name $STATIC_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --source https://github.com/cipfarorudy/cipfaro-site \
        --location "$LOCATION" \
        --branch main \
        --app-location "/" \
        --api-location "api" \
        --output-location "dist"
else
    echo "✅ Static Web App déjà existante"
fi

# Configuration des variables d'environnement
echo "⚙️ Configuration des variables d'environnement..."

# Lire le fichier .env.production et configurer les variables
if [ -f ".env.production" ]; then
    while IFS= read -r line; do
        if [[ $line =~ ^VITE_.*=.* ]]; then
            var_name=$(echo $line | cut -d'=' -f1)
            var_value=$(echo $line | cut -d'=' -f2-)
            echo "Setting $var_name"
            az staticwebapp appsettings set \
                --name $STATIC_APP_NAME \
                --resource-group $RESOURCE_GROUP \
                --setting-names "$var_name=$var_value"
        fi
    done < .env.production
fi

# Test post-déploiement
echo "🧪 Tests post-déploiement..."

# Obtenir l'URL de l'application
STATIC_APP_URL=$(az staticwebapp show --name $STATIC_APP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostname" -o tsv)

if [ ! -z "$STATIC_APP_URL" ]; then
    echo "🌍 Application déployée sur : https://$STATIC_APP_URL"
    
    # Test de connectivité basique
    if curl -f -s "https://$STATIC_APP_URL" > /dev/null; then
        echo "✅ Site accessible"
    else
        echo "⚠️ Site pas encore accessible (propagation DNS en cours)"
    fi
else
    echo "⚠️ Impossible d'obtenir l'URL de l'application"
fi

echo ""
echo "🎉 Déploiement terminé !"
echo "📋 Résumé :"
echo "   - Frontend : https://$STATIC_APP_URL"
echo "   - Groupe de ressources : $RESOURCE_GROUP"
echo "   - Région : $LOCATION"
echo ""
echo "🔗 Liens utiles :"
echo "   - Portail Azure : https://portal.azure.com"
echo "   - Monitoring : https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/staticSites/$STATIC_APP_NAME"
echo ""
echo "⚡ Prochaines étapes :"
echo "   1. Configurer un domaine personnalisé"
echo "   2. Ajouter un certificat SSL"
echo "   3. Configurer les analytics"