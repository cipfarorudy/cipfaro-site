# 🚀 Script de Déploiement CIP FARO (PowerShell)
# Déploie l'application frontend et l'API vers Azure

param(
    [string]$ResourceGroup = "cipfaro-rg",
    [string]$StaticAppName = "cipfaro-site",
    [string]$Location = "West Europe",
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Début du déploiement CIP FARO..." -ForegroundColor Green

# Vérifications préalables
Write-Host "🔍 Vérifications préalables..." -ForegroundColor Yellow

# Vérifier Azure CLI
if (!(Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Azure CLI non installé. Installez-le depuis https://aka.ms/InstallAzureCli" -ForegroundColor Red
    exit 1
}

# Vérifier la connexion Azure
try {
    az account show | Out-Null
} catch {
    Write-Host "❌ Non connecté à Azure. Exécutez: az login" -ForegroundColor Red
    exit 1
}

# Vérifier Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js non installé" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Toutes les vérifications passées" -ForegroundColor Green

if (!$SkipBuild) {
    # Build du frontend
    Write-Host "🏗️ Construction du frontend..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Échec de l'installation des dépendances frontend" -ForegroundColor Red
        exit 1
    }

    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Échec du build frontend" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build frontend réussi" -ForegroundColor Green

    # Build de l'API
    Write-Host "🏗️ Préparation de l'API..." -ForegroundColor Yellow
    Push-Location api
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Échec de l'installation des dépendances API" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
    Write-Host "✅ API prête" -ForegroundColor Green
}

# Déploiement vers Azure
Write-Host "📤 Déploiement vers Azure..." -ForegroundColor Yellow

# Vérifier si le groupe de ressources existe
$rgExists = az group exists --name $ResourceGroup
if ($rgExists -eq "false") {
    Write-Host "📁 Création du groupe de ressources $ResourceGroup..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location
}

# Vérifier si Static Web App existe
$appExists = $false
try {
    az staticwebapp show --name $StaticAppName --resource-group $ResourceGroup | Out-Null
    $appExists = $true
    Write-Host "✅ Static Web App déjà existante" -ForegroundColor Green
} catch {
    Write-Host "🌐 Création de l'application Static Web App..." -ForegroundColor Yellow
    
    # Créer la Static Web App
    az staticwebapp create `
        --name $StaticAppName `
        --resource-group $ResourceGroup `
        --source "https://github.com/cipfarorudy/cipfaro-site" `
        --location $Location `
        --branch main `
        --app-location "/" `
        --api-location "api" `
        --output-location "dist"
}

# Configuration des variables d'environnement
Write-Host "⚙️ Configuration des variables d'environnement..." -ForegroundColor Yellow

if (Test-Path ".env.production") {
    Get-Content ".env.production" | ForEach-Object {
        if ($_ -match "^VITE_.*=.*") {
            $parts = $_ -split "=", 2
            $varName = $parts[0]
            $varValue = $parts[1]
            
            Write-Host "Setting $varName" -ForegroundColor Cyan
            az staticwebapp appsettings set `
                --name $StaticAppName `
                --resource-group $ResourceGroup `
                --setting-names "$varName=$varValue"
        }
    }
}

# Obtenir l'URL de l'application
Write-Host "🔗 Récupération de l'URL..." -ForegroundColor Yellow
$staticAppUrl = az staticwebapp show --name $StaticAppName --resource-group $ResourceGroup --query "defaultHostname" -o tsv

# Tests post-déploiement
Write-Host "🧪 Tests post-déploiement..." -ForegroundColor Yellow

if ($staticAppUrl) {
    $fullUrl = "https://$staticAppUrl"
    Write-Host "🌍 Application déployée sur : $fullUrl" -ForegroundColor Green
    
    # Test de connectivité basique
    try {
        Invoke-WebRequest -Uri $fullUrl -Method Head -TimeoutSec 10 | Out-Null
        Write-Host "✅ Site accessible" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Site pas encore accessible (propagation DNS en cours)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ Impossible d'obtenir l'URL de l'application" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Déploiement terminé !" -ForegroundColor Green
Write-Host "📋 Résumé :" -ForegroundColor Cyan
Write-Host "   - Frontend : https://$staticAppUrl" -ForegroundColor White
Write-Host "   - Groupe de ressources : $ResourceGroup" -ForegroundColor White
Write-Host "   - Région : $Location" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Liens utiles :" -ForegroundColor Cyan
Write-Host "   - Portail Azure : https://portal.azure.com" -ForegroundColor White

$subscriptionId = az account show --query id -o tsv
Write-Host "   - Monitoring : https://portal.azure.com/#@/resource/subscriptions/$subscriptionId/resourceGroups/$ResourceGroup/providers/Microsoft.Web/staticSites/$StaticAppName" -ForegroundColor White

Write-Host ""
Write-Host "⚡ Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. Configurer un domaine personnalisé" -ForegroundColor White
Write-Host "   2. Ajouter un certificat SSL" -ForegroundColor White
Write-Host "   3. Configurer les analytics" -ForegroundColor White