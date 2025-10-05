# CIP FARO - Site Web Officiel

> Site web moderne développé avec React et Vite pour CIP FARO, organisme de formation professionnelle en Guadeloupe.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev

# Construction pour la production
npm run build

# Aperçu de la version de production
npm run preview
```

## 📁 Structure du projet

```
cipfaro-site-main/
├── src/                    # Code source React
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   ├── data/              # Données (formations, posts)
│   └── utils/             # Utilitaires (SEO, analytics, email)
├── public/                # Fichiers statiques
│   ├── assets/           # Images, certificats, logos
│   └── legacy-html/      # Anciens fichiers HTML statiques
├── docs/                  # Documentation du projet
├── database/              # Scripts SQL
├── deployment/            # Configuration de déploiement
├── legacy/                # Code legacy (C#)
├── reports/               # Rapports Lighthouse
└── scripts/               # Scripts de build et utilitaires
```

## 🛠 Technologies utilisées

- **Frontend**: React 19, React Router DOM
- **Build Tool**: Vite 7
- **Styling**: CSS moderne avec variables CSS
- **PDF**: jsPDF + jspdf-autotable
- **Email**: EmailJS
- **Analytics**: Google Analytics 4
- **Qualité**: ESLint

## 🎯 Fonctionnalités

- ✅ Site web responsive et moderne
- ✅ Gestion des formations avec système de devis
- ✅ Pages de pré-inscription et contact
- ✅ Espaces utilisateurs (stagiaire, formateur, admin)
- ✅ Génération de PDF (devis, programmes)
- ✅ Système de cookies et RGPD
- ✅ SEO optimisé et accessibilité
- ✅ Blog intégré avec Markdown

## 📋 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Construction pour production
- `npm run preview` - Aperçu de production
- `npm run lint` - Vérification ESLint
- `npm run make-webp` - Conversion d'images en WebP

## 🚀 Déploiement

Le site est configuré pour Azure Static Web Apps. Consultez le dossier `deployment/` pour les configurations.

## 📞 Contact

**CIP FARO Rudy**
- Site web: [cipfaro-formations.com](https://cipfaro-formations.com)
- Email: contact@cipfaro-formations.com

## 📄 Licence

© 2025 CIP FARO Rudy. Tous droits réservés.