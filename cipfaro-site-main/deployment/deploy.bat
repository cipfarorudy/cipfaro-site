@echo off
REM ========================================
REM SCRIPT DE DEPLOIEMENT CIP FARO
REM Version automatisée pour Windows
REM ========================================

echo.
echo ========================================
echo   🚀 DEPLOIEMENT CIP FARO - PHASE 2
echo ========================================
echo.

echo ✅ Verification de l'environnement...
if not exist "package.json" (
    echo ❌ Erreur: package.json non trouve
    echo    Verifiez que vous etes dans le bon repertoire
    pause
    exit /b 1
)

echo ✅ Nettoyage des anciens builds...
if exist "dist" rmdir /s /q dist

echo ✅ Installation des dependances...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur lors de l'installation des dependances
    pause
    exit /b 1
)

echo ✅ Build de production...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo.
echo ========================================
echo   📁 CONTENU DU BUILD GENERE
echo ========================================
dir /b dist\

echo.
echo ========================================
echo   🎯 PROCHAINES ETAPES
echo ========================================
echo.
echo 1. 📂 Le dossier 'dist\' contient votre site optimise
echo 2. 🌐 Uploader le CONTENU de dist\ vers votre serveur web
echo 3. ⚙️  Configurer EmailJS et Google Analytics (voir GUIDE-DEPLOIEMENT.md)
echo.
echo 📊 STATISTIQUES DU BUILD:
for %%f in (dist\index.html) do echo    - index.html: %%~zf bytes
for /f %%i in ('dir /s /b dist\assets\*.js ^| find /c /v ""') do echo    - Fichiers JS: %%i
for /f %%i in ('dir /s /b dist\assets\*.css ^| find /c /v ""') do echo    - Fichiers CSS: %%i
echo.

echo ✅ DEPLOIEMENT PRET !
echo.
echo 📖 Consultez GUIDE-DEPLOIEMENT.md pour les instructions detaillees
echo.

choice /c ON /n /m "Ouvrir le guide de deploiement ? (O)ui / (N)on: "
if %ERRORLEVEL%==1 (
    if exist "GUIDE-DEPLOIEMENT.md" (
        start GUIDE-DEPLOIEMENT.md
    ) else (
        echo ❌ Guide non trouve
    )
)

echo.
echo 🎉 MISSION ACCOMPLIE ! CIP FARO est pret pour le succes a 100%%
pause