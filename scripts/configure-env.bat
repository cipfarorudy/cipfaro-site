@echo off
REM Configuration des variables d'environnement pour cipfaro-formations
REM Script batch pour Azure App Service

echo === Configuration Azure App Service cipfaro-formations ===

REM Variables de base de données
set DB_HOST=cipfaro-db-prod.postgres.database.azure.com
set DB_NAME=cipfaro_app
set DB_USER=cipfaro_admin
set DB_PORT=5432

REM Configuration une par une pour éviter les problèmes d'échappement
echo Configuration DATABASE_URL...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "DATABASE_URL=postgresql://%DB_USER%@%DB_HOST%:%DB_PORT%/%DB_NAME%?sslmode=require"

echo Configuration DB_HOST...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "DB_HOST=%DB_HOST%"

echo Configuration DB_NAME...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "DB_NAME=%DB_NAME%"

echo Configuration DB_USER...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "DB_USER=%DB_USER%"

echo Configuration DB_PORT...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "DB_PORT=%DB_PORT%"

echo Configuration JWT_SECRET...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "JWT_SECRET=cipfaro-jwt-secret-prod-2024-very-secure-key"

echo Configuration NODE_ENV...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "NODE_ENV=production"

echo Configuration CORS_ORIGIN...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "CORS_ORIGIN=https://cipfaro-formations.com,https://cipfaro-formations.azurewebsites.net"

echo Configuration PORT...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "PORT=8080"

echo Configuration SESSION_SECRET...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "SESSION_SECRET=cipfaro-session-secret-prod-2024"

echo Configuration UPLOAD_PATH...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "UPLOAD_PATH=/tmp/uploads"

echo Configuration EMAIL_SERVICE...
az webapp config appsettings set --resource-group rg-cipfaro-prod --name cipfaro-formations --settings "EMAIL_SERVICE=gmail"

echo Configuration terminée !
echo.
echo Vérification des paramètres...
az webapp config appsettings list --resource-group rg-cipfaro-prod --name cipfaro-formations --query "[?name=='DATABASE_URL' || name=='NODE_ENV' || name=='DB_HOST'].{Name:name, Value:value}" --output table

echo.
echo === Configuration terminée avec succès ===
pause