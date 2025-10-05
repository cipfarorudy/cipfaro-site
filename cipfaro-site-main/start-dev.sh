#!/bin/bash
# Script de démarrage rapide pour le développement local CIP FARO

echo "🚀 Démarrage de l'environnement de développement CIP FARO"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier le fichier .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️ Fichier .env.local manquant. Création automatique..."
    cp .env.example .env.local
    
    # Modifier pour le local
    sed -i 's|VITE_API_BASE=.*|VITE_API_BASE=http://localhost:3001/api|' .env.local
    sed -i 's|VITE_USE_LOCAL_AUTH=.*|VITE_USE_LOCAL_AUTH=true|' .env.local
    sed -i 's|VITE_GA_MEASUREMENT_ID=.*|VITE_GA_MEASUREMENT_ID=|' .env.local
    
    echo "✅ Configuration locale créée"
fi

echo ""
echo "🎯 Comptes de test disponibles:"
echo "   Admin      : admin@cipfaro-formations.com / admin123"
echo "   Formateur  : formateur@cipfaro-formations.com / formateur123"
echo "   Stagiaire  : stagiaire@cipfaro-formations.com / stagiaire123"
echo "   Secrétariat: secretariat@cipfaro-formations.com / secretariat123"
echo ""

echo "🌐 URLs de développement:"
echo "   Application React: http://localhost:5173"
echo "   API Backend      : http://localhost:3001"
echo ""

# Demander le mode de démarrage
echo "Choisissez le mode de démarrage:"
echo "1) Application seulement (React)"
echo "2) API seulement"
echo "3) Application + API (recommandé)"
echo ""
read -p "Votre choix (1-3): " choice

case $choice in
    1)
        echo "🎨 Démarrage de l'application React..."
        npm run dev
        ;;
    2)
        echo "🔧 Démarrage du serveur API..."
        npm run local
        ;;
    3)
        echo "🚀 Démarrage complet (Application + API)..."
        if command -v concurrently &> /dev/null; then
            npm run dev:full
        else
            echo "⚠️ concurrently non installé. Démarrage séquentiel..."
            echo "Démarrez manuellement l'API avec: npm run local"
            npm run dev
        fi
        ;;
    *)
        echo "❌ Choix invalide. Démarrage par défaut de l'application..."
        npm run dev
        ;;
esac