# Import du schÃ©ma CIP FARO vers Azure PostgreSQL
# Script PowerShell pour la configuration de production

param(
    [string]$ServerName = "cipfaro-db-prod.postgres.database.azure.com",
    [string]$DatabaseName = "cipfaro_app",
    [string]$Username = "cipfaro_admin",
    [string]$SchemaFile = "database\azure-schema.sql"
)

Write-Host "=== Import du schéma CIP FARO vers Azure PostgreSQL ===" -ForegroundColor Green

# VÃ©rifier si le fichier de schÃ©ma existe
if (-not (Test-Path $SchemaFile)) {
    Write-Error "Fichier de schéma non trouvé : $SchemaFile"
    exit 1
}

# Installer psql si nécessaire
Write-Host "Vérification de psql..." -ForegroundColor Yellow
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "psql non trouvé. Installation de PostgreSQL client..." -ForegroundColor Yellow
    
    # TÃ©lÃ©charger et installer PostgreSQL client
    $url = "https://get.enterprisedb.com/postgresql/postgresql-15.5-1-windows-x64-binaries.zip"
    $tempDir = "$env:TEMP\postgresql-client"
    $zipFile = "$tempDir\postgresql-client.zip"
    
    if (-not (Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir -Force
    }
    
    Write-Host "Téléchargement du client PostgreSQL..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $url -OutFile $zipFile -UseBasicParsing
        
        # Extraire l'archive
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $tempDir)
        
        # Ajouter au PATH temporairement
        $env:PATH = "$tempDir\bin;$env:PATH"
        
        Write-Host "Client PostgreSQL installé avec succès" -ForegroundColor Green
    } catch {
        Write-Warning "Impossible d'installer automatiquement psql. Veuillez l'installer manuellement."
        Write-Host "Alternative : utilisez Azure Cloud Shell ou installez PostgreSQL depuis https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    }
}

# Variables de connexion
$connectionString = "host=$ServerName port=5432 dbname=$DatabaseName user=$Username sslmode=require"

Write-Host "Connexion à : $ServerName" -ForegroundColor Yellow
Write-Host "Base de données : $DatabaseName" -ForegroundColor Yellow

# Import du schÃ©ma
Write-Host "`nImport du schéma depuis $SchemaFile..." -ForegroundColor Yellow

try {
    # Exécuter le script SQL
    $env:PGPASSWORD = Read-Host "Mot de passe pour $Username" -AsSecureString
    $env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))
    
    Write-Host "Exécution du script SQL..." -ForegroundColor Yellow
    & psql $connectionString -f $SchemaFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Schéma importé avec succès !" -ForegroundColor Green
        
        # VÃ©rifier les tables crÃ©Ã©es
        Write-Host "`nVérification des tables créées..." -ForegroundColor Yellow
        $checkTablesQuery = @"
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
"@
        
        echo $checkTablesQuery | & psql $connectionString
        
        Write-Host "`n✅ Base de données prête pour la production !" -ForegroundColor Green
        Write-Host "URL de connexion : $ServerName" -ForegroundColor Cyan
        Write-Host "Base de données : $DatabaseName" -ForegroundColor Cyan
        
    } else {
        Write-Error "Erreur lors de l'import du schéma (Exit code: $LASTEXITCODE)"
    }
    
} catch {
    Write-Error "Erreur lors de l'import : $_"
    Write-Host "`nAlternatives disponibles :" -ForegroundColor Yellow
    Write-Host "1. Utilisez Azure Cloud Shell avec az postgres flexible-server connect" -ForegroundColor Cyan
    Write-Host "2. Utilisez pgAdmin ou DBeaver pour vous connecter manuellement" -ForegroundColor Cyan
    Write-Host "3. Copiez le contenu de $SchemaFile dans l'éditeur de requête Azure Portal" -ForegroundColor Cyan
}

# Nettoyer les variables d'environnement
$env:PGPASSWORD = $null

Write-Host "`n=== Script terminé ===" -ForegroundColor Green