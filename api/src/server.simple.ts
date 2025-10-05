import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";

// Configuration
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3002;

// Middlewares de sécurité et performance
app.use(
  helmet({
    contentSecurityPolicy: false, // Désactivé pour le développement
  })
);

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

app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Route de santé
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes API temporaires pour les formations
app.get("/api/formations", (req: Request, res: Response) => {
  const formations = [
    {
      id: 1,
      titre: "Formation React Moderne",
      description: "Apprenez React 18 avec TypeScript",
      duree: 35,
      prix: 2100,
      certifiante: true,
      status: "active",
    },
    {
      id: 2,
      titre: "API REST avec Node.js",
      description: "Développement d'APIs robustes",
      duree: 28,
      prix: 1890,
      certifiante: true,
      status: "active",
    },
  ];

  res.json({ formations, total: formations.length });
});

// Route contact temporaire
app.post("/api/contact", (req: Request, res: Response) => {
  console.log("Contact reçu:", req.body);
  res.status(200).json({
    success: true,
    message: "Votre message a été envoyé avec succès",
    id: Math.random().toString(36).substring(7),
  });
});

// Route devis temporaire
app.post("/api/devis/calculate", (req: Request, res: Response) => {
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
  });
});

// Documentation API simple
app.get("/api", (req: Request, res: Response) => {
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
app.get("/", (req: Request, res: Response) => {
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
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
