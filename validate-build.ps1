# Validation Pre-Déploiement CIP FARO Site
# Script pour vérifier que tout est prêt avant le déploiement

Write-Host "🔍 VALIDATION PRE-DÉPLOIEMENT - CIP FARO SITE" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$errors = @()
$warnings = @()

# 1. Vérification du build
Write-Host "📦 1. Vérification du build..." -ForegroundColor Yellow
if (Test-Path "dist/index.html") {
    $distFiles = Get-ChildItem -Path "dist" -Recurse -File
    Write-Host "   ✅ Build trouvé ($($distFiles.Count) fichiers)" -ForegroundColor Green
    
    # Vérifier les fichiers critiques
    $criticalFiles = @("index.html", "assets")
    foreach ($file in $criticalFiles) {
        if (Test-Path "dist/$file") {
            Write-Host "   ✅ $file présent" -ForegroundColor Green
        } else {
            $errors += "Fichier critique manquant: $file"
        }
    }
} else {
    $errors += "Build manquant - exécuter 'npm run build'"
}

# 2. Vérification des assets
Write-Host "🖼️ 2. Vérification des assets..." -ForegroundColor Yellow
$assetFiles = Get-ChildItem -Path "dist/assets" -File -ErrorAction SilentlyContinue
if ($assetFiles) {
    Write-Host "   ✅ $($assetFiles.Count) assets trouvés" -ForegroundColor Green
    
    # Vérifier la taille des assets
    $totalSize = ($assetFiles | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   📊 Taille totale des assets: $([math]::Round($totalSize, 2)) MB" -ForegroundColor White
    
    if ($totalSize -gt 50) {
        $warnings += "Assets volumineux ($([math]::Round($totalSize, 2)) MB) - considerer optimisation"
    }
} else {
    $warnings += "Aucun asset trouvé dans dist/assets"
}

# 3. Validation du HTML
Write-Host "📄 3. Validation du HTML principal..." -ForegroundColor Yellow
if (Test-Path "dist/index.html") {
    $htmlContent = Get-Content "dist/index.html" -Raw
    
    # Vérifications HTML critiques
    $htmlChecks = @{
        "<!DOCTYPE html>" = "DOCTYPE déclaré"
        "<meta charset=" = "Charset défini"
        "<title>" = "Titre présent"
        "<meta name=`"viewport`"" = "Viewport responsive"
    }
    
    foreach ($check in $htmlChecks.GetEnumerator()) {
        if ($htmlContent -match [regex]::Escape($check.Key)) {
            Write-Host "   ✅ $($check.Value)" -ForegroundColor Green
        } else {
            $warnings += "HTML: $($check.Value) manquant"
        }
    }
}

# 4. Vérification des configurations
Write-Host "⚙️ 4. Vérification des configurations..." -ForegroundColor Yellow

# staticwebapp.config.json
if (Test-Path "staticwebapp.config.json") {
    Write-Host "   ✅ Configuration Static Web App présente" -ForegroundColor Green
} else {
    $warnings += "staticwebapp.config.json manquant - routes par défaut utilisées"
}

# package.json
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "   ✅ package.json: $($packageJson.name) v$($packageJson.version)" -ForegroundColor Green
} else {
    $errors += "package.json manquant"
}

# 5. Vérification des dépendances de sécurité
Write-Host "🛡️ 5. Audit de sécurité..." -ForegroundColor Yellow
try {
    $auditResult = npm audit --json 2>$null | ConvertFrom-Json
    if ($auditResult.metadata.vulnerabilities.total -eq 0) {
        Write-Host "   ✅ Aucune vulnérabilité détectée" -ForegroundColor Green
    } else {
        $high = $auditResult.metadata.vulnerabilities.high
        $critical = $auditResult.metadata.vulnerabilities.critical
        if ($critical -gt 0 -or $high -gt 0) {
            $errors += "Vulnérabilités critiques/élevées détectées ($critical critiques, $high élevées)"
        } else {
            $warnings += "Vulnérabilités mineures détectées"
        }
    }
} catch {
    $warnings += "Impossible d'exécuter l'audit de sécurité"
}

# 6. Test de performance du build
Write-Host "⚡ 6. Analyse de performance..." -ForegroundColor Yellow
$jsFiles = Get-ChildItem -Path "dist/assets" -Filter "*.js" -ErrorAction SilentlyContinue
$cssFiles = Get-ChildItem -Path "dist/assets" -Filter "*.css" -ErrorAction SilentlyContinue

if ($jsFiles) {
    $jsSize = ($jsFiles | Measure-Object -Property Length -Sum).Sum / 1KB
    Write-Host "   📊 JavaScript total: $([math]::Round($jsSize, 2)) KB" -ForegroundColor White
    
    if ($jsSize -lt 500) {
        Write-Host "   ✅ Taille JavaScript optimale" -ForegroundColor Green
    } elseif ($jsSize -lt 1000) {
        Write-Host "   ⚠️ Taille JavaScript acceptable" -ForegroundColor Yellow
    } else {
        $warnings += "JavaScript volumineux ($([math]::Round($jsSize, 2)) KB)"
    }
}

if ($cssFiles) {
    $cssSize = ($cssFiles | Measure-Object -Property Length -Sum).Sum / 1KB
    Write-Host "   📊 CSS total: $([math]::Round($cssSize, 2)) KB" -ForegroundColor White
}

# 7. Vérification des certificats et assets spécifiques
Write-Host "📜 7. Vérification des assets spécifiques..." -ForegroundColor Yellow
$specificAssets = @(
    "public/assets/certificat-B04066-2025-03-30.pdf",
    "src/assets/logo-cipfaro.png"
)

foreach ($asset in $specificAssets) {
    if (Test-Path $asset) {
        Write-Host "   ✅ $(Split-Path $asset -Leaf) présent" -ForegroundColor Green
    } else {
        $warnings += "Asset spécifique manquant: $asset"
    }
}

# Résumé final
Write-Host "`n📋 RÉSUMÉ DE LA VALIDATION" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "✅ Aucune erreur critique - DÉPLOIEMENT POSSIBLE" -ForegroundColor Green
} else {
    Write-Host "❌ ERREURS CRITIQUES DÉTECTÉES:" -ForegroundColor Red
    foreach ($err in $errors) {
        Write-Host "   • $err" -ForegroundColor Red
    }
    Write-Host "`n🚫 DÉPLOIEMENT NON RECOMMANDÉ" -ForegroundColor Red
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️ AVERTISSEMENTS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}

# Statistiques finales
$totalSize = (Get-ChildItem -Path "dist" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "`n📊 STATISTIQUES FINALES:" -ForegroundColor Cyan
Write-Host "   Taille totale: $([math]::Round($totalSize, 2)) MB" -ForegroundColor White
Write-Host "   Fichiers total: $((Get-ChildItem -Path "dist" -Recurse -File).Count)" -ForegroundColor White
Write-Host "   Date validation: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor White

# Code de sortie
if ($errors.Count -eq 0) {
    Write-Host "`n🎉 VALIDATION RÉUSSIE - PRÊT POUR LE DÉPLOIEMENT!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ VALIDATION ÉCHOUÉE - CORRIGER LES ERREURS AVANT LE DÉPLOIEMENT" -ForegroundColor Red
    exit 1
}