# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## CIP FARO - Frontend (React + Vite)

Ce dépôt contient le front-end du site CIP FARO construit avec React et Vite.

## Développement

- Installer les dépendances : npm install
- Lancer le serveur de développement : npm run dev

## Variables d'environnement (Vite)

Le front-end communique avec une API pour envoyer les préinscriptions. L'URL de base de l'API peut être configurée avec la variable d'environnement Vite `VITE_API_BASE`.

1. Copier `.env.example` en `.env` à la racine du projet.
2. Modifier `VITE_API_BASE` si nécessaire. Exemple :

```bash
VITE_API_BASE=http://localhost:3000
```

Vite expose les variables commençant par `VITE_` via `import.meta.env.VITE_API_BASE`.

Si `VITE_API_BASE` n'est pas défini, le front-end utilisera par défaut `https://api.cipfaro-formation.com`.

## Fonctionnalités pertinentes

- Page /preinscription : formulaire de préinscription avec génération PDF (jsPDF) et upload de CV. Le formulaire peut être envoyé au secrétariat via l'API (multipart/form-data).

## Notes

- Ce README a été étendu pour inclure des instructions locales sur la configuration d'API.
# cipfaro-site
