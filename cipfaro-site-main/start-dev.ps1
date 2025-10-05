# Script de démarrage rapide pour le développement local CIP FARO (Windows)

Write-Host "🚀 Démarrage de l'environnement de développement CIP FARO" -ForegroundColor Green
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

# Installer les dépendances si nécessaire
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Vérifier le fichier .env.local
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️ Fichier .env.local manquant. Création automatique..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    
    # Modifier pour le local
    $envContent = Get-Content ".env.local"
    $envContent = $envContent -replace 'VITE_API_BASE=.*', 'VITE_API_BASE=http://localhost:3001/api'
    $envContent = $envContent -replace 'VITE_USE_LOCAL_AUTH=.*', 'VITE_USE_LOCAL_AUTH=true'
    $envContent = $envContent -replace 'VITE_GA_MEASUREMENT_ID=.*', 'VITE_GA_MEASUREMENT_ID='
    $envContent | Set-Content ".env.local"
    
    Write-Host "✅ Configuration locale créée" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Comptes de test disponibles:" -ForegroundColor Cyan
Write-Host "   Admin      : admin@cipfaro-formations.com / admin123" -ForegroundColor White
Write-Host "   Formateur  : formateur@cipfaro-formations.com / formateur123" -ForegroundColor White
Write-Host "   Stagiaire  : stagiaire@cipfaro-formations.com / stagiaire123" -ForegroundColor White
Write-Host "   Secrétariat: secretariat@cipfaro-formations.com / secretariat123" -ForegroundColor White
Write-Host ""

Write-Host "🌐 URLs de développement:" -ForegroundColor Cyan
Write-Host "   Application React: http://localhost:5173" -ForegroundColor White
Write-Host "   API Backend      : http://localhost:3001" -ForegroundColor White
Write-Host ""

# Menu de choix
Write-Host "Choisissez le mode de démarrage:" -ForegroundColor Yellow
Write-Host "1) Application seulement (React)" -ForegroundColor White
Write-Host "2) API seulement" -ForegroundColor White
Write-Host "3) Application + API (recommandé)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Votre choix (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🎨 Démarrage de l'application React..." -ForegroundColor Green
        npm run dev
    }
    "2" {
        Write-Host "🔧 Démarrage du serveur API..." -ForegroundColor Green
        npm run local
    }
    "3" {
        Write-Host "🚀 Démarrage complet (Application + API)..." -ForegroundColor Green
        try {
            npm run dev:full
        } catch {
            Write-Host "⚠️ Erreur avec concurrently. Démarrage séquentiel..." -ForegroundColor Yellow
            Write-Host "Démarrez manuellement l'API avec: npm run local" -ForegroundColor White
            npm run dev
        }
    }
    default {
        Write-Host "❌ Choix invalide. Démarrage par défaut de l'application..." -ForegroundColor Red
        npm run dev
    }
}