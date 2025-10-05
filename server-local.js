// Serveur de développement local pour CIP FARO
// Lance un serveur API minimal pour tester les intégrations

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Base de données simulée en mémoire
let candidatures = [];
let offresEmploi = [];
let users = [];

// Routes API principales

// Authentification
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Comptes de test (mêmes que dans auth.js)
  const testAccounts = {
    "admin@cipfaro-formations.com": {
      password: "admin123",
      role: "admin",
      name: "Administrateur CIP FARO",
      permissions: ["users", "formations", "statistics", "system"],
    },
    "formateur@cipfaro-formations.com": {
      password: "formateur123",
      role: "formateur",
      name: "Jean-Paul Martin",
      permissions: ["formations", "stagiaires"],
    },
    "stagiaire@cipfaro-formations.com": {
      password: "stagiaire123",
      role: "stagiaire",
      name: "Marie Dupont",
      permissions: ["profile", "formations"],
    },
    "secretariat@cipfaro-formations.com": {
      password: "secretariat123",
      role: "secretariat",
      name: "Service Secrétariat",
      permissions: ["candidatures", "offres", "communications"],
    },
  };

  const account = testAccounts[email?.toLowerCase()];
  if (account && account.password === password) {
    const token = `local_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    res.json({
      success: true,
      token,
      user: {
        email,
        role: account.role,
        name: account.name,
        permissions: account.permissions,
        loginTime: new Date().toISOString(),
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Email ou mot de passe incorrect",
    });
  }
});

// Refresh token
app.post("/api/auth/refresh", (req, res) => {
  // Simulation simple du refresh
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const newToken = `local_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    res.json({ token: newToken });
  } else {
    res.status(401).json({ message: "Token invalide" });
  }
});

// Candidatures
app.post("/api/candidatures", (req, res) => {
  console.log("📝 Nouvelle candidature reçue:", req.body);

  const candidature = {
    id: Date.now(),
    ...req.body,
    dateReception: new Date().toISOString(),
    statut: "nouvelle",
  };

  candidatures.push(candidature);

  res.json({
    success: true,
    message: "Candidature reçue avec succès",
    id: candidature.id,
  });
});

app.get("/api/candidatures", (req, res) => {
  res.json({
    success: true,
    data: candidatures,
    total: candidatures.length,
  });
});

// Préinscriptions
app.post("/api/preinscriptions", (req, res) => {
  console.log("🎓 Nouvelle préinscription reçue:", req.body);

  const preinscription = {
    id: Date.now(),
    ...req.body,
    dateInscription: new Date().toISOString(),
    statut: "en_attente",
  };

  res.json({
    success: true,
    message: "Préinscription enregistrée avec succès",
    id: preinscription.id,
    data: preinscription,
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: "development",
  });
});

// Route 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
    path: req.originalUrl,
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`
🚀 Serveur API CIP FARO (Local)
📍 URL: http://localhost:${PORT}
🔧 Environnement: Développement
📊 Endpoints disponibles:
   - POST /api/auth/login
   - POST /api/candidatures
   - POST /api/preinscriptions
   - GET  /api/health
   
🎯 Pour tester: curl http://localhost:${PORT}/api/health
  `);
});
