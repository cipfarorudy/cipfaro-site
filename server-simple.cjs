const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3002;

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5178",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Route de santé
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: "development",
  });
});

// Routes API pour les formations
app.get("/api/formations", (req, res) => {
  const formations = [
    {
      id: 1,
      titre: "Formation React Moderne",
      description: "Apprenez React 18 avec TypeScript",
      duree: 35,
      prix: 2100,
      certifiante: true,
      status: "active",
      niveau: "Intermédiaire",
      programme: [
        "Introduction à React 18",
        "Hooks et Context",
        "TypeScript avec React",
      ],
    },
    {
      id: 2,
      titre: "API REST avec Node.js",
      description: "Développement d'APIs robustes",
      duree: 28,
      prix: 1890,
      certifiante: true,
      status: "active",
      niveau: "Avancé",
      programme: ["Express.js", "Base de données", "Sécurité"],
    },
    {
      id: 3,
      titre: "Développement Full-Stack",
      description: "Formation complète frontend/backend",
      duree: 70,
      prix: 4200,
      certifiante: true,
      status: "active",
      niveau: "Expert",
      programme: ["React + Node.js", "Déploiement", "DevOps"],
    },
  ];

  res.json({ formations, total: formations.length });
});

// Route contact
app.post("/api/contact", (req, res) => {
  console.log("Contact reçu:", req.body);
  res.status(200).json({
    success: true,
    message: "Votre message a été envoyé avec succès",
    id: Math.random().toString(36).substring(7),
  });
});

// Route devis
app.post("/api/devis/calculate", (req, res) => {
  const { mode, participants, heures, tva } = req.body;

  const tauxHoraire = mode === "individuel" ? 60 : 45;
  const coutHT = participants * heures * tauxHoraire;
  const montantTVA = (coutHT * tva) / 100;
  const coutTTC = coutHT + montantTVA;

  res.json({
    mode,
    participants,
    heures,
    tauxHoraire,
    coutHT,
    tva,
    montantTVA,
    coutTTC,
    reference: `DEV-${Date.now()}`,
  });
});

// Documentation API
app.get("/api", (req, res) => {
  res.json({
    name: "CIP FARO API",
    version: "1.0.0",
    description: "API REST pour le site CIP FARO",
    endpoints: {
      health: "/api/health",
      formations: "/api/formations",
      contact: "/api/contact",
      devis: "/api/devis/calculate",
    },
  });
});

// Route de base
app.get("/", (req, res) => {
  res.json({
    message: "CIP FARO API Development Server",
    frontend: "Run with Vite on port 5177+",
    api: `http://localhost:${PORT}/api`,
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 CIP FARO API Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: development`);
});

module.exports = app;
