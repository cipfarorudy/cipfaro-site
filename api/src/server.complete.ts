import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

// Configuration
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Configuration Multer pour uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${timestamp}-${cleanName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Format de fichier non autorisé"));
    }
  },
});

// Configuration Nodemailer (mode développement)
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "test@cipfaro.fr",
    pass: process.env.EMAIL_PASSWORD || "test-password",
  },
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  message: { error: "Trop de requêtes, veuillez réessayer plus tard." },
});

// Middlewares de sécurité et performance
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
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

app.use(limiter);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Stockage temporaire en mémoire (remplacer par DB en production)
const storage_data = {
  contacts: [],
  preinscriptions: [],
  devis: [],
  candidatures: [],
  users: [
    {
      id: 1,
      email: "admin@cipfaro.fr",
      nom: "Admin",
      prenom: "CIP FARO",
      role: "admin",
      password: "admin123", // En production : hash BCrypt
    },
    {
      id: 2,
      email: "stagiaire@test.fr",
      nom: "Test",
      prenom: "Stagiaire",
      role: "stagiaire",
      password: "stagiaire123",
    },
  ],
};

// Utilitaire pour envoyer des emails
const sendEmail = async (options: any) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email envoyé (mode développement):", {
        to: options.to,
        subject: options.subject,
        html: options.html?.substring(0, 100) + "...",
      });
      return { success: true, message: "Email envoyé (mode dev)" };
    }

    const result = await transporter.sendMail(options);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
};

// ROUTES API

// Test de santé
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    features: {
      database: false, // À passer à true quand PostgreSQL sera configuré
      email: true,
      upload: true,
      auth: true,
    },
  });
});

// Routes d'authentification simplifiées
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  const user = storage_data.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  // JWT simple (en production : utiliser jsonwebtoken)
  const token = Buffer.from(`${user.id}:${user.email}:${user.role}`).toString(
    "base64"
  );

  res.json({
    message: "Connexion réussie",
    user: {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
    },
    token,
  });
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const {
    email,
    password,
    nom,
    prenom,
    telephone,
    role = "stagiaire",
  } = req.body;

  if (!email || !password || !nom || !prenom) {
    return res
      .status(400)
      .json({ error: "Tous les champs requis doivent être remplis" });
  }

  const existingUser = storage_data.users.find((u) => u.email === email);
  if (existingUser) {
    return res
      .status(409)
      .json({ error: "Un utilisateur avec cet email existe déjà" });
  }

  const newUser = {
    id: storage_data.users.length + 1,
    email,
    nom,
    prenom,
    telephone,
    role,
    password, // En production : hash avec BCrypt
  };

  storage_data.users.push(newUser);

  sendEmail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Bienvenue chez CIP FARO - Compte créé",
    html: `
      <h2>Bienvenue ${prenom} ${nom} !</h2>
      <p>Votre compte CIP FARO a été créé avec succès.</p>
      <p><strong>Rôle :</strong> ${role}</p>
      <p>Vous pouvez maintenant vous connecter à votre espace personnel.</p>
    `,
  });

  const token = Buffer.from(
    `${newUser.id}:${newUser.email}:${newUser.role}`
  ).toString("base64");

  res.status(201).json({
    message: "Utilisateur créé avec succès",
    user: {
      id: newUser.id,
      email: newUser.email,
      nom: newUser.nom,
      prenom: newUser.prenom,
      role: newUser.role,
    },
    token,
  });
});

// Routes pour les formulaires
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const { nom, prenom, email, telephone, sujet, message } = req.body;

    if (!nom || !prenom || !email || !sujet || !message) {
      return res
        .status(400)
        .json({ error: "Tous les champs requis doivent être remplis" });
    }

    const contact = {
      id: storage_data.contacts.length + 1,
      nom,
      prenom,
      email,
      telephone,
      sujet,
      message,
      created_at: new Date().toISOString(),
    };

    storage_data.contacts.push(contact);

    // Email à l'équipe
    await sendEmail({
      from: process.env.EMAIL_USER,
      to: "contact@cipfaro.fr",
      subject: `Nouveau message de contact : ${sujet}`,
      html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>De :</strong> ${prenom} ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${telephone || "Non renseigné"}</p>
        <p><strong>Sujet :</strong> ${sujet}</p>
        <p><strong>Message :</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-left: 3px solid #007bff;">
          ${message.replace(/\n/g, "<br>")}
        </div>
      `,
    });

    // Email de confirmation
    await sendEmail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation de réception - CIP FARO",
      html: `
        <h2>Merci pour votre message !</h2>
        <p>Bonjour ${prenom},</p>
        <p>Nous avons bien reçu votre message concernant : <strong>${sujet}</strong></p>
        <p>Notre équipe vous répondra dans les meilleurs délais.</p>
        <p>Cordialement,<br>L'équipe CIP FARO</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès",
      id: contact.id,
    });
  } catch (error) {
    console.error("Erreur contact:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});

app.post(
  "/api/preinscription",
  upload.single("cv"),
  async (req: Request, res: Response) => {
    try {
      const {
        nom,
        prenom,
        email,
        telephone,
        adresse,
        ville,
        codePostal,
        formationSouhaitee,
        situationActuelle,
        motivations,
        disponibilite,
      } = req.body;

      if (!nom || !prenom || !email || !telephone || !formationSouhaitee) {
        return res
          .status(400)
          .json({ error: "Tous les champs requis doivent être remplis" });
      }

      const preinscription = {
        id: storage_data.preinscriptions.length + 1,
        nom,
        prenom,
        email,
        telephone,
        adresse,
        ville,
        codePostal,
        formationSouhaitee,
        situationActuelle,
        motivations,
        disponibilite,
        cv_path: req.file ? req.file.filename : null,
        created_at: new Date().toISOString(),
      };

      storage_data.preinscriptions.push(preinscription);

      await sendEmail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirmation de pré-inscription - CIP FARO",
        html: `
        <h2>Pré-inscription enregistrée !</h2>
        <p>Bonjour ${prenom},</p>
        <p>Votre pré-inscription pour la formation <strong>${formationSouhaitee}</strong> a été enregistrée avec succès.</p>
        <p><strong>Numéro de référence :</strong> PRE-${preinscription.id}</p>
        <p>Notre équipe pédagogique étudiera votre candidature et vous recontactera rapidement.</p>
        <p>Cordialement,<br>L'équipe CIP FARO</p>
      `,
      });

      res.status(201).json({
        success: true,
        message: "Pré-inscription enregistrée avec succès",
        reference: `PRE-${preinscription.id}`,
      });
    } catch (error) {
      console.error("Erreur pré-inscription:", error);
      res.status(500).json({ error: "Erreur lors de la pré-inscription" });
    }
  }
);

app.post("/api/devis", async (req: Request, res: Response) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      entreprise,
      secteur,
      typeFormation,
      nombreParticipants,
      dureePreferee,
      objectifs,
      contraintes,
      budget,
    } = req.body;

    if (!nom || !prenom || !email || !telephone || !typeFormation) {
      return res
        .status(400)
        .json({ error: "Tous les champs requis doivent être remplis" });
    }

    const devis = {
      id: storage_data.devis.length + 1,
      nom,
      prenom,
      email,
      telephone,
      entreprise,
      secteur,
      typeFormation,
      nombreParticipants,
      dureePreferee,
      objectifs,
      contraintes,
      budget,
      created_at: new Date().toISOString(),
    };

    storage_data.devis.push(devis);

    await sendEmail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Demande de devis reçue - CIP FARO",
      html: `
        <h2>Demande de devis enregistrée !</h2>
        <p>Bonjour ${prenom},</p>
        <p>Votre demande de devis pour <strong>${typeFormation}</strong> a été enregistrée.</p>
        <p><strong>Numéro de référence :</strong> DEV-${devis.id}</p>
        <p>Notre équipe commerciale étudiera votre demande et vous enverra un devis personnalisé sous 48h.</p>
        <p>Cordialement,<br>L'équipe CIP FARO</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Demande de devis enregistrée avec succès",
      reference: `DEV-${devis.id}`,
    });
  } catch (error) {
    console.error("Erreur devis:", error);
    res.status(500).json({ error: "Erreur lors de la demande de devis" });
  }
});

// Calcul de devis en temps réel
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

// Routes formations (données statiques enrichies)
app.get("/api/formations", (req: Request, res: Response) => {
  const formations = [
    {
      id: 1,
      titre: "Développement Web Full-Stack",
      description:
        "Formation complète en développement web moderne avec React, Node.js et bases de données",
      duree: 280,
      duree_jours: 35,
      prix: 4200,
      certifiante: true,
      cpf_eligible: true,
      niveau: "intermédiaire",
      categorie: "Développement Web",
      status: "active",
    },
    {
      id: 2,
      titre: "Intelligence Artificielle et Machine Learning",
      description:
        "Initiation à l'IA et au Machine Learning avec Python et TensorFlow",
      duree: 210,
      duree_jours: 30,
      prix: 3150,
      certifiante: true,
      cpf_eligible: true,
      niveau: "avancé",
      categorie: "Intelligence Artificielle",
      status: "active",
    },
    {
      id: 3,
      titre: "Cybersécurité Avancée",
      description:
        "Formation approfondie en sécurité informatique et protection des données",
      duree: 175,
      duree_jours: 25,
      prix: 2625,
      certifiante: true,
      cpf_eligible: true,
      niveau: "avancé",
      categorie: "Cybersécurité",
      status: "active",
    },
    {
      id: 4,
      titre: "DevOps et Cloud Computing",
      description:
        "Maîtrise des outils DevOps et des plateformes cloud (AWS, Azure, GCP)",
      duree: 245,
      duree_jours: 35,
      prix: 3675,
      certifiante: true,
      cpf_eligible: true,
      niveau: "intermédiaire",
      categorie: "Cloud Computing",
      status: "active",
    },
    {
      id: 5,
      titre: "Analyse de Données avec Python",
      description:
        "Manipulation et analyse de données avec pandas, numpy et matplotlib",
      duree: 140,
      duree_jours: 20,
      prix: 2100,
      certifiante: true,
      cpf_eligible: true,
      niveau: "débutant",
      categorie: "Data Science",
      status: "active",
    },
  ];

  const { categorie, niveau, recherche } = req.query;
  let filteredFormations = [...formations];

  if (categorie) {
    filteredFormations = filteredFormations.filter((f) =>
      f.categorie.toLowerCase().includes((categorie as string).toLowerCase())
    );
  }

  if (niveau) {
    filteredFormations = filteredFormations.filter((f) => f.niveau === niveau);
  }

  if (recherche) {
    const searchTerm = (recherche as string).toLowerCase();
    filteredFormations = filteredFormations.filter(
      (f) =>
        f.titre.toLowerCase().includes(searchTerm) ||
        f.description.toLowerCase().includes(searchTerm)
    );
  }

  res.json({
    formations: filteredFormations,
    total: filteredFormations.length,
  });
});

app.get("/api/formations/:id", (req: Request, res: Response) => {
  const formations = [
    {
      id: 1,
      titre: "Développement Web Full-Stack",
      description:
        "Formation complète pour devenir développeur web full-stack moderne",
      objectifs: [
        "Maîtriser React et ses écosystèmes",
        "Développer des APIs REST avec Node.js",
        "Gérer les bases de données SQL et NoSQL",
        "Déployer des applications web",
      ],
      contenu: [
        "HTML5, CSS3, JavaScript ES6+",
        "React 18, Redux, React Router",
        "Node.js, Express.js, API REST",
        "MongoDB, PostgreSQL",
        "Git, Docker, Déploiement cloud",
      ],
      duree: 280,
      duree_jours: 35,
      prix: 4200,
      certifiante: true,
      cpf_eligible: true,
      code_cpf: "RS6204",
      niveau: "intermédiaire",
      categorie: "Développement Web",
    },
  ];

  const formation = formations.find((f) => f.id === parseInt(req.params.id));

  if (!formation) {
    return res.status(404).json({ error: "Formation non trouvée" });
  }

  res.json({ formation });
});

// Routes d'administration
app.get("/api/admin/stats", (req: Request, res: Response) => {
  // Simple vérification d'auth (améliorer en production)
  const auth = req.headers.authorization;
  if (!auth || !auth.includes("admin")) {
    return res.status(403).json({ error: "Accès non autorisé" });
  }

  res.json({
    utilisateurs: storage_data.users.length,
    preinscriptions: storage_data.preinscriptions.length,
    devis: storage_data.devis.length,
    candidatures: storage_data.candidatures.length,
    messages: storage_data.contacts.length,
    derniere_maj: new Date().toISOString(),
  });
});

app.get("/api/admin/contacts", (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.includes("admin")) {
    return res.status(403).json({ error: "Accès non autorisé" });
  }

  res.json({ contacts: storage_data.contacts });
});

// Documentation API
app.get("/api", (req: Request, res: Response) => {
  res.json({
    name: "CIP FARO API Complete",
    version: "2.0.0",
    description: "API REST complète pour le site CIP FARO",
    features: [
      "Authentication",
      "File Upload",
      "Email Notifications",
      "Rate Limiting",
    ],
    endpoints: {
      health: "/api/health",
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
      },
      formations: {
        list: "GET /api/formations",
        detail: "GET /api/formations/:id",
      },
      forms: {
        contact: "POST /api/contact",
        preinscription: "POST /api/preinscription (avec upload CV)",
        devis: "POST /api/devis",
        calculate: "POST /api/devis/calculate",
      },
      admin: {
        stats: "GET /api/admin/stats",
        contacts: "GET /api/admin/contacts",
      },
    },
  });
});

// Route de base
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "🚀 CIP FARO API Complete Server",
    version: "2.0.0",
    frontend: "Vite Server on port 5177+",
    api: `http://localhost:${PORT}/api`,
    status: "✅ Tous les formulaires fonctionnels",
    features: [
      "✅ Authentification",
      "✅ Upload fichiers",
      "✅ Emails",
      "✅ Rate limiting",
    ],
  });
});

// Middleware de gestion des erreurs
app.use((error: any, req: any, res: any, next: any) => {
  console.error("Erreur non gérée:", error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Fichier trop volumineux (max 5MB)" });
    }
  }

  res.status(500).json({ error: "Erreur interne du serveur" });
});

// Route 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 CIP FARO API Server v2.0 running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📧 Email System: ${
      process.env.NODE_ENV === "development" ? "Development Mode" : "Production"
    }`
  );
  console.log(`📁 Upload Directory: ${path.join(__dirname, "../uploads")}`);
});

// Création du répertoire uploads s'il n'existe pas
import fs from "fs";
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Upload directory created: ${uploadDir}`);
}

// Gestion propre de l'arrêt
process.on("SIGTERM", () => {
  console.log("SIGTERM reçu, arrêt du serveur...");
  server.close(() => {
    console.log("Serveur arrêté proprement.");
    process.exit(0);
  });
});

export default app;
