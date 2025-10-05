Write-Host "🚀 Démarrage du nouveau design system CIP FARO..." -ForegroundColor Green
Write-Host ""
Write-Host "📋 Cette version inclut :" -ForegroundColor Cyan
Write-Host "   ✅ TypeScript pour la sécurité du code" -ForegroundColor White
Write-Host "   ✅ Tailwind CSS pour un design moderne" -ForegroundColor White
Write-Host "   ✅ Composants UI réutilisables" -ForegroundColor White
Write-Host "   ✅ Navigation responsive" -ForegroundColor White
Write-Host "   ✅ Page d'accueil redesignée" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Le serveur va démarrer sur http://localhost:5173" -ForegroundColor Yellow
Write-Host "📊 Consultez la nouvelle interface modernisée" -ForegroundColor Yellow
Write-Host ""

# Vérifier si les dépendances sont installées
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Blue
    npm install
}

# Démarrer le serveur de développement
Write-Host "🚀 Démarrage du serveur..." -ForegroundColor Green
npm run dev