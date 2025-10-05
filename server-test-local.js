import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;

// Configuration CORS pour le développement local
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Base de données en mémoire pour les tests locaux
let candidatures = [];
let offresEmploi = [
  {
    id: 1,
    entreprise: "Tech Solutions",
    titre: "Développeur Full Stack",
    type: "CDI",
    description:
      "Recherche développeur expérimenté React/Node.js pour rejoindre notre équipe dynamique.",
    emailContact: "rh@techsolutions.fr",
    datePublication: new Date().toISOString(),
  },
  {
    id: 2,
    entreprise: "Digital Corp",
    titre: "Chef de Projet Web",
    type: "CDD",
    description:
      "Pilotage de projets digitaux innovants dans un environnement agile.",
    emailContact: "jobs@digitalcorp.com",
    datePublication: new Date().toISOString(),
  },
  {
    id: 3,
    entreprise: "StartupX",
    titre: "UX/UI Designer",
    type: "Freelance",
    description: "Création d'interfaces utilisateur modernes et intuitives.",
    emailContact: "contact@startupx.fr",
    datePublication: new Date().toISOString(),
  },
];

let nextCandidatureId = 1;
let nextOffreId = 4;

// Clé secrète JWT pour les tests
const JWT_SECRET = "CipFaro-Local-Test-Secret-Key-2024";

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "In-Memory (Test)",
    environment: "Development Local",
  });
});

// Authentification - Générer un token JWT
app.post("/api/auth/token", (req, res) => {
  const { username, password } = req.body;

  if (username === "cipfaro" && password === "admin123") {
    const token = jwt.sign({ username: username, role: "Admin" }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token: token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } else {
    res.status(401).json({ error: "Identifiants invalides" });
  }
});

// CANDIDATURES
// GET - Récupérer toutes les candidatures
app.get("/api/candidatures", (req, res) => {
  console.log(`📄 Récupération de ${candidatures.length} candidature(s)`);
  res.json(candidatures);
});

// POST - Créer une nouvelle candidature
app.post("/api/candidature", (req, res) => {
  const { nom, prenom, email, domaine, message } = req.body;

  if (!nom || !prenom || !email || !domaine || !message) {
    return res.status(400).json({
      error: "Tous les champs sont obligatoires",
      success: false,
    });
  }

  const nouvelleCandidature = {
    id: nextCandidatureId++,
    nom,
    prenom,
    email,
    domaine,
    message,
    dateCreation: new Date().toISOString(),
  };

  candidatures.push(nouvelleCandidature);

  console.log(
    `✅ Nouvelle candidature enregistrée: ${prenom} ${nom} (${email})`
  );

  res.json({
    message: "Candidature enregistrée avec succès",
    success: true,
    data: nouvelleCandidature,
  });
});

// OFFRES D'EMPLOI
// GET - Récupérer toutes les offres
app.get("/api/offres", (req, res) => {
  console.log(`📋 Récupération de ${offresEmploi.length} offre(s) d'emploi`);
  res.json(offresEmploi);
});

// POST - Créer une nouvelle offre
app.post("/api/offre", (req, res) => {
  const { entreprise, titre, type, description, emailContact } = req.body;

  if (!entreprise || !titre || !type || !description || !emailContact) {
    return res.status(400).json({
      error: "Tous les champs sont obligatoires",
      success: false,
    });
  }

  const nouvelleOffre = {
    id: nextOffreId++,
    entreprise,
    titre,
    type,
    description,
    emailContact,
    datePublication: new Date().toISOString(),
  };

  offresEmploi.unshift(nouvelleOffre); // Ajouter en début de liste

  console.log(`✅ Nouvelle offre enregistrée: ${titre} chez ${entreprise}`);

  res.json({
    message: "Offre d'emploi enregistrée avec succès",
    success: true,
    data: nouvelleOffre,
  });
});

// Endpoint pour réinitialiser les données de test
app.post("/api/dev/reset-database", (req, res) => {
  candidatures = [];
  offresEmploi = [
    {
      id: 1,
      entreprise: "Tech Solutions",
      titre: "Développeur Full Stack",
      type: "CDI",
      description:
        "Recherche développeur expérimenté React/Node.js pour rejoindre notre équipe dynamique.",
      emailContact: "rh@techsolutions.fr",
      datePublication: new Date().toISOString(),
    },
    {
      id: 2,
      entreprise: "Digital Corp",
      titre: "Chef de Projet Web",
      type: "CDD",
      description:
        "Pilotage de projets digitaux innovants dans un environnement agile.",
      emailContact: "jobs@digitalcorp.com",
      datePublication: new Date().toISOString(),
    },
    {
      id: 3,
      entreprise: "StartupX",
      titre: "UX/UI Designer",
      type: "Freelance",
      description: "Création d'interfaces utilisateur modernes et intuitives.",
      emailContact: "contact@startupx.fr",
      datePublication: new Date().toISOString(),
    },
  ];
  nextCandidatureId = 1;
  nextOffreId = 4;

  console.log("🔄 Base de données réinitialisée");

  res.json({ message: "Base de données réinitialisée avec succès" });
});

// Middleware pour gérer les erreurs
app.use((error, req, res, next) => {
  console.error("❌ Erreur:", error);
  res.status(500).json({
    error: "Erreur interne du serveur",
    success: false,
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log("🚀 API CIP FARO démarrée en mode test local");
  console.log(`🌐 Serveur accessible sur: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/auth/token`);
  console.log(`   - GET  /api/candidatures`);
  console.log(`   - POST /api/candidature`);
  console.log(`   - GET  /api/offres`);
  console.log(`   - POST /api/offre`);
  console.log(`   - POST /api/dev/reset-database`);
  console.log("");
  console.log("✅ Prêt pour les tests!");
});

export default app;
