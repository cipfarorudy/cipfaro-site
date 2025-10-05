@echo off
echo 🚀 Démarrage de l'API CIP FARO en mode test local...
echo.

REM Vérifier si .NET est installé
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo ❌ .NET n'est pas installé ou accessible
    echo Veuillez installer .NET 8.0 SDK depuis https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

echo ✅ .NET détecté: 
dotnet --version

REM Copier le fichier Program.Local.cs vers Program.cs pour les tests locaux
echo.
echo 📋 Configuration pour les tests locaux...
copy /Y "Program.Local.cs" "Program.cs"
if errorlevel 1 (
    echo ❌ Erreur lors de la copie du fichier Program.Local.cs
    pause
    exit /b 1
)

echo ✅ Configuration locale appliquée

REM Restaurer les packages NuGet
echo.
echo 📦 Installation des dépendances...
dotnet restore
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo ✅ Dépendances installées

REM Compiler le projet
echo.
echo 🔨 Compilation du projet...
dotnet build
if errorlevel 1 (
    echo ❌ Erreur lors de la compilation
    pause
    exit /b 1
)

echo ✅ Projet compilé avec succès

REM Démarrer l'API
echo.
echo 🌐 Démarrage de l'API sur http://localhost:5000...
echo 📊 Swagger UI sera disponible à: http://localhost:5000
echo 🔍 Health check: http://localhost:5000/api/health
echo.
echo Appuyez sur Ctrl+C pour arrêter l'API
echo.

dotnet run --urls "http://localhost:5000"