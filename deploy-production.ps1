# Script de déploiement Azure Static Web Apps - CIP FARO
# Version optimisée pour build de production

Write-Host "🚀 DÉPLOIEMENT CIP FARO SITE - VERSION PRODUCTION" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Vérification des prérequis
Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier si le dossier dist existe
if (-Not (Test-Path "dist")) {
    Write-Host "❌ Dossier 'dist' introuvable. Lancement du build..." -ForegroundColor Red
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Échec du build. Arrêt du déploiement." -ForegroundColor Red
        exit 1
    }
}

# Vérifier Azure CLI
try {
    $azVersion = az version 2>$null | ConvertFrom-Json
    Write-Host "✅ Azure CLI détecté: $($azVersion.'azure-cli')" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI non installé. Installation requise:" -ForegroundColor Red
    Write-Host "   Télécharger: https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor White
    exit 1
}

# Vérifier l'authentification Azure
try {
    $account = az account show 2>$null | ConvertFrom-Json
    Write-Host "✅ Connecté à Azure: $($account.user.name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Non connecté à Azure. Connexion..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Échec de connexion Azure." -ForegroundColor Red
        exit 1
    }
}

# Configuration du déploiement
$resourceGroup = "rg-cipfaro"
$appName = "cipfaro-site"
$location = "West Europe"

Write-Host "📋 Configuration du déploiement:" -ForegroundColor Cyan
Write-Host "   Resource Group: $resourceGroup" -ForegroundColor White
Write-Host "   App Name: $appName" -ForegroundColor White
Write-Host "   Location: $location" -ForegroundColor White
Write-Host "   Source: ./dist" -ForegroundColor White

# Confirmation utilisateur
$confirm = Read-Host "Continuer le déploiement? (y/N)"
if ($confirm -notmatch '^[Yy]$') {
    Write-Host "🚫 Déploiement annulé." -ForegroundColor Yellow
    exit 0
}

# Vérifier/créer le resource group
Write-Host "🏗️ Vérification du resource group..." -ForegroundColor Yellow
$rgExists = az group exists --name $resourceGroup 2>$null
if ($rgExists -eq "false") {
    Write-Host "   Création du resource group: $resourceGroup" -ForegroundColor White
    az group create --name $resourceGroup --location $location
}

# Vérifier/créer l'app Static Web App
Write-Host "🌐 Vérification de l'application Static Web App..." -ForegroundColor Yellow
$appExists = az staticwebapp list --resource-group $resourceGroup --query "[?name=='$appName']" --output tsv
if (-Not $appExists) {
    Write-Host "   Création de l'application: $appName" -ForegroundColor White
    az staticwebapp create `
        --name $appName `
        --resource-group $resourceGroup `
        --location $location `
        --source "https://github.com/cipfarorudy/cipfaro-site" `
        --branch "main" `
        --app-location "/" `
        --output-location "dist"
}

# Déploiement des fichiers
Write-Host "📦 Déploiement des fichiers..." -ForegroundColor Yellow
Write-Host "   Source: $(Get-Location)\dist" -ForegroundColor White

# Obtenir le token de déploiement
$deploymentToken = az staticwebapp secrets list --name $appName --resource-group $resourceGroup --query "properties.apiKey" --output tsv

if ($deploymentToken) {
    # Déploiement avec SWA CLI
    Write-Host "🚀 Lancement du déploiement avec SWA CLI..." -ForegroundColor Green
    
    # Installer SWA CLI si nécessaire
    try {
        swa --version | Out-Null
    } catch {
        Write-Host "   Installation de SWA CLI..." -ForegroundColor White
        npm install -g @azure/static-web-apps-cli
    }
    
    # Déployer
    swa deploy ./dist --deployment-token $deploymentToken --env production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ DÉPLOIEMENT RÉUSSI!" -ForegroundColor Green
        
        # Obtenir l'URL de l'application
        $appUrl = az staticwebapp show --name $appName --resource-group $resourceGroup --query "defaultHostname" --output tsv
        Write-Host "🌐 Site disponible à: https://$appUrl" -ForegroundColor Green
        
        # Statistiques du déploiement
        Write-Host "📊 Informations de déploiement:" -ForegroundColor Cyan
        $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "   Taille totale: $([math]::Round($distSize, 2)) MB" -ForegroundColor White
        Write-Host "   Fichiers déployés: $((Get-ChildItem -Path "dist" -Recurse -File).Count)" -ForegroundColor White
        Write-Host "   Date: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor White
        
    } else {
        Write-Host "❌ Échec du déploiement" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Impossible d'obtenir le token de déploiement" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green