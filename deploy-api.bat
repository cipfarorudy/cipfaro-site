@echo off
REM Script de déploiement automatisé pour CIP FARO API
REM Assurez-vous d'avoir Azure CLI installé et d'être connecté

echo ========================================
echo DEPLOIEMENT CIPFARO API SUR AZURE
echo ========================================

REM Variables de configuration
set RESOURCE_GROUP=cipfaro-rg
set LOCATION=westeurope
set APP_SERVICE_PLAN=cipfaro-plan
set API_NAME=cipfaro-api
set SQL_SERVER=cipfaro-sql-server
set DATABASE_NAME=cipfaro-db
set SQL_ADMIN=cipfaroadmin

echo.
echo 1. Vérification de la connexion Azure...
az account show > nul 2>&1
if errorlevel 1 (
    echo ERREUR: Vous devez vous connecter à Azure avec 'az login'
    pause
    exit /b 1
)

echo ✅ Connexion Azure OK

echo.
echo 2. Création du groupe de ressources...
az group create --name %RESOURCE_GROUP% --location %LOCATION%
if errorlevel 1 (
    echo ERREUR: Échec de création du groupe de ressources
    pause
    exit /b 1
)
echo ✅ Groupe de ressources créé

echo.
echo 3. Création du plan App Service...
az appservice plan create ^
  --name %APP_SERVICE_PLAN% ^
  --resource-group %RESOURCE_GROUP% ^
  --location %LOCATION% ^
  --sku B1 ^
  --is-linux
if errorlevel 1 (
    echo ERREUR: Échec de création du plan App Service
    pause
    exit /b 1
)
echo ✅ Plan App Service créé

echo.
echo 4. Création de l'App Service...
az webapp create ^
  --name %API_NAME% ^
  --resource-group %RESOURCE_GROUP% ^
  --plan %APP_SERVICE_PLAN% ^
  --runtime "DOTNET:8.0"
if errorlevel 1 (
    echo ERREUR: Échec de création de l'App Service
    pause
    exit /b 1
)
echo ✅ App Service créée

echo.
echo 5. Configuration HTTPS obligatoire...
az webapp config set ^
  --resource-group %RESOURCE_GROUP% ^
  --name %API_NAME% ^
  --https-only true
echo ✅ HTTPS configuré

echo.
echo 6. Création du serveur SQL...
set /p SQL_PASSWORD="Entrez le mot de passe admin SQL (min 8 caractères, majuscules, minuscules, chiffres): "
az sql server create ^
  --name %SQL_SERVER% ^
  --resource-group %RESOURCE_GROUP% ^
  --location %LOCATION% ^
  --admin-user %SQL_ADMIN% ^
  --admin-password %SQL_PASSWORD%
if errorlevel 1 (
    echo ERREUR: Échec de création du serveur SQL
    pause
    exit /b 1
)
echo ✅ Serveur SQL créé

echo.
echo 7. Configuration du pare-feu SQL...
az sql server firewall-rule create ^
  --resource-group %RESOURCE_GROUP% ^
  --server %SQL_SERVER% ^
  --name AllowAzureServices ^
  --start-ip-address 0.0.0.0 ^
  --end-ip-address 0.0.0.0

REM Obtenir l'IP publique pour autoriser l'accès
for /f "delims=" %%i in ('powershell -Command "Invoke-RestMethod -Uri 'https://api.ipify.org'"') do set PUBLIC_IP=%%i

az sql server firewall-rule create ^
  --resource-group %RESOURCE_GROUP% ^
  --server %SQL_SERVER% ^
  --name AllowMyIP ^
  --start-ip-address %PUBLIC_IP% ^
  --end-ip-address %PUBLIC_IP%
echo ✅ Pare-feu SQL configuré

echo.
echo 8. Création de la base de données...
az sql db create ^
  --resource-group %RESOURCE_GROUP% ^
  --server %SQL_SERVER% ^
  --name %DATABASE_NAME% ^
  --service-objective Basic
if errorlevel 1 (
    echo ERREUR: Échec de création de la base de données
    pause
    exit /b 1
)
echo ✅ Base de données créée

echo.
echo 9. Configuration de la chaîne de connexion...
set CONNECTION_STRING=Server=tcp:%SQL_SERVER%.database.windows.net,1433;Initial Catalog=%DATABASE_NAME%;User ID=%SQL_ADMIN%;Password=%SQL_PASSWORD%;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;

az webapp config connection-string set ^
  --resource-group %RESOURCE_GROUP% ^
  --name %API_NAME% ^
  --connection-string-type SQLServer ^
  --settings DefaultConnection="%CONNECTION_STRING%"
echo ✅ Chaîne de connexion configurée

echo.
echo 10. Compilation et déploiement de l'API...
if not exist "bin" mkdir bin
dotnet publish -c Release -o ./bin/publish
if errorlevel 1 (
    echo ERREUR: Échec de compilation
    pause
    exit /b 1
)

cd bin\publish
powershell -Command "Compress-Archive -Path '.\*' -DestinationPath '..\app.zip' -Force"
cd ..\..

az webapp deployment source config-zip ^
  --resource-group %RESOURCE_GROUP% ^
  --name %API_NAME% ^
  --src bin\app.zip
if errorlevel 1 (
    echo ERREUR: Échec de déploiement
    pause
    exit /b 1
)
echo ✅ API déployée

echo.
echo 11. Configuration des variables d'environnement...
az webapp config appsettings set ^
  --resource-group %RESOURCE_GROUP% ^
  --name %API_NAME% ^
  --settings ^
    "Jwt__Key=CipFaro-Secret-Key-2024-Super-Secure-Random-String-256bits" ^
    "Jwt__Issuer=CipFaro-API" ^
    "Jwt__Audience=CipFaro-Frontend" ^
    "ASPNETCORE_ENVIRONMENT=Production"
echo ✅ Variables d'environnement configurées

echo.
echo ========================================
echo DÉPLOIEMENT TERMINÉ AVEC SUCCÈS ! ✅
echo ========================================
echo.
echo 📍 URL de votre API: https://%API_NAME%.azurewebsites.net
echo 📍 Documentation Swagger: https://%API_NAME%.azurewebsites.net
echo 📍 Health Check: https://%API_NAME%.azurewebsites.net/health
echo.
echo 📋 Actions suivantes:
echo 1. Exécutez les scripts SQL dans votre base de données:
echo    - create_candidatures_table.sql
echo    - create_offres_emploi_table.sql
echo    - ajouter_candidature_procedure.sql  
echo    - ajouter_offre_emploi_procedure.sql
echo.
echo 2. Mettez à jour l'URL dans offres_dynamic_script.js:
echo    const API_BASE_URL = 'https://%API_NAME%.azurewebsites.net';
echo.
echo 3. Testez votre API avec le token d'authentification
echo.
echo 🔑 Informations de connexion SQL:
echo Serveur: %SQL_SERVER%.database.windows.net
echo Base: %DATABASE_NAME%
echo Utilisateur: %SQL_ADMIN%
echo Mot de passe: [celui que vous avez saisi]
echo.

pause