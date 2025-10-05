# API REST CIP FARO

## 🚀 Description

API REST moderne développée avec Express.js et TypeScript pour le site web de CIP FARO. Cette API fournit des endpoints sécurisés pour la gestion des formations, du contact et de la génération de devis.

## 🛠️ Technologies

- **Express.js** - Framework web Node.js
- **TypeScript** - Typage statique
- **Zod** - Validation de schémas
- **Helmet** - Sécurité HTTP
- **CORS** - Configuration des origines autorisées
- **Morgan** - Logging des requêtes
- **Compression** - Compression gzip

## 🏃‍♂️ Démarrage rapide

### Installation

```bash
cd api
npm install
```

### Développement

```bash
npm run dev
```

L'API sera accessible sur `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## 📚 Documentation API

### Endpoints principaux

- **GET** `/api/health` - Vérification de l'état de santé
- **GET** `/api` - Documentation de base

### Formations (`/api/formations`)

- **GET** `/api/formations` - Liste toutes les formations
- **GET** `/api/formations?q=recherche` - Recherche par mots-clés
- **GET** `/api/formations?certifiante=true` - Filtrer par certification
- **GET** `/api/formations?etat=active` - Filtrer par état
- **GET** `/api/formations/:slug` - Récupère une formation spécifique
- **GET** `/api/formations/stats` - Statistiques des formations
- **POST** `/api/formations/reload` - Recharge les données depuis le fichier

### Contact (`/api/contact`)

- **POST** `/api/contact` - Soumettre une demande de contact
- **GET** `/api/contact/info` - Informations de contact CIP FARO
- **GET** `/api/contact/options` - Options disponibles pour les objets

### Devis (`/api/devis`)

- **POST** `/api/devis` - Générer un devis complet
- **GET** `/api/devis/template` - Template de devis avec valeurs par défaut
- **GET** `/api/devis/tarifs` - Grille tarifaire
- **POST** `/api/devis/calculate` - Calculer le montant d'un devis

## 🔒 Sécurité

### Middlewares de sécurité

- **Helmet** - Headers de sécurité HTTP
- **CORS** - Origines autorisées configurées
- **Validation Zod** - Validation stricte des données

### Origines autorisées

#### Développement
- `http://localhost:3000-5176`

#### Production
- `https://cipfaro-site.azurewebsites.net`
- `https://www.cipfaro-formations.com`

## 📝 Validation des données

### Exemple de formulaire de contact

```json
{
  "nom": "John Doe",
  "email": "john@example.com",
  "telephone": "0123456789",
  "objet": "information-formation",
  "message": "Demande d'information sur vos formations...",
  "wantsCallback": true,
  "prefhoraire": "9h-12h"
}
```

### Exemple de génération de devis

```json
{
  "clientNom": "Entreprise XYZ",
  "clientEmail": "contact@xyz.com",
  "formationSlug": "formation-test",
  "mode": "groupe",
  "participants": 8,
  "heures": 35,
  "lieu": "Paris",
  "periode": "Janvier 2024",
  "tva": 20,
  "coutCertification": 500,
  "refDevis": "DEV-20240115-ABCD",
  "dateDevis": "2024-01-15",
  "echeance": "2024-02-15"
}
```

## 🔧 Configuration

### Variables d'environnement

```bash
PORT=3001
NODE_ENV=development
```

### Structure des dossiers

```
api/
├── src/
│   ├── middleware/     # Middlewares (validation, erreurs)
│   ├── routes/        # Routes API (formations, contact, devis)
│   ├── services/      # Services métier
│   ├── schemas/       # Schémas de validation Zod
│   └── server.ts      # Serveur principal
├── dist/             # Code compilé (production)
├── package.json
└── tsconfig.json
```

## 🧪 Test des endpoints

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Liste des formations

```bash
curl http://localhost:3001/api/formations
```

### Recherche de formations

```bash
curl "http://localhost:3001/api/formations?q=test&certifiante=true"
```

### Soumettre une demande de contact

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test User",
    "email": "test@example.com",
    "objet": "information-formation",
    "message": "Test message"
  }'
```

## 🐛 Débogage

### Logs en développement

Les logs incluent :
- Requêtes HTTP (via Morgan)
- Chargement des formations
- Erreurs de validation
- Génération de devis

### Erreurs courantes

1. **Port déjà utilisé** - Modifier la variable PORT
2. **Fichier formations.json manquant** - Créer le fichier dans `src/data/`
3. **Erreurs de validation** - Vérifier la structure des données envoyées

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

### Démarrage en production

```bash
NODE_ENV=production npm start
```

L'API servira également les fichiers statiques du frontend en production.

## 📊 Monitoring

### Health Check

L'endpoint `/api/health` retourne :

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

### Métriques

- Temps de réponse des requêtes
- Codes de statut HTTP
- Erreurs de validation
- Chargement des données

## 🤝 Contribution

1. Respecter les schémas de validation Zod
2. Ajouter les types TypeScript appropriés
3. Documenter les nouveaux endpoints
4. Tester les nouvelles fonctionnalités

---

**CIP FARO** - API REST Moderne v1.0.0