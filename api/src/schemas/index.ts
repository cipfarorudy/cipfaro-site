import { z } from "zod";

// Schéma pour les formations
export const FormationSchema = z.object({
  slug: z.string().min(1),
  code_officiel: z.string().min(1),
  titre: z.string().min(1),
  certifiante: z.boolean(),
  rncp: z.string().nullable(),
  certificateur: z.string().nullable(),
  date_enregistrement: z.string().nullable(),
  objectifs: z.array(z.string()),
  prerequis: z.string(),
  duree: z.string(),
  modalites: z.string(),
  delais_acces: z.string(),
  tarifs: z.string(),
  contacts: z.string(),
  methodes_mobilisees: z.string(),
  modalites_evaluation: z.string(),
  accessibilite_psh: z.string(),
  debouches: z.string(),
  passerelles: z.string(),
  blocs_competences: z.array(z.string()),
  etat: z.string(),
});

// Schéma pour le formulaire de contact
export const ContactFormSchema = z.object({
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),

  email: z
    .string()
    .email("Adresse email invalide")
    .min(5, "L'email doit contenir au moins 5 caractères")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),

  telephone: z
    .string()
    .regex(
      /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
      "Numéro de téléphone français invalide"
    )
    .optional()
    .or(z.literal("")),

  objet: z.enum([
    "information-formation",
    "inscription",
    "financement",
    "accessibilite",
    "partenariat",
    "autre",
  ]),

  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères"),

  wantsCallback: z.boolean().optional().default(false),

  prefhoraire: z
    .string()
    .max(200, "La préférence horaire ne peut pas dépasser 200 caractères")
    .optional()
    .or(z.literal("")),
});

// Schéma pour le générateur de devis
export const DevisFormSchema = z.object({
  // Informations client
  clientNom: z
    .string()
    .min(2, "Le nom du client doit contenir au moins 2 caractères")
    .max(200, "Le nom du client ne peut pas dépasser 200 caractères"),

  clientEmail: z
    .string()
    .email("Adresse email invalide")
    .min(5, "L'email doit contenir au moins 5 caractères")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),

  clientTelephone: z
    .string()
    .regex(
      /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
      "Numéro de téléphone français invalide"
    )
    .optional()
    .or(z.literal("")),

  clientAdresse: z
    .string()
    .max(500, "L'adresse ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),

  clientSiret: z
    .string()
    .regex(/^[0-9]{14}$/, "Le SIRET doit contenir 14 chiffres")
    .optional()
    .or(z.literal("")),

  // Formation
  formationSlug: z.string().min(1, "Veuillez sélectionner une formation"),

  mode: z.enum(["individuel", "groupe"]),

  participants: z
    .number()
    .int("Le nombre de participants doit être un entier")
    .min(1, "Le nombre de participants doit être au moins 1")
    .max(50, "Le nombre de participants ne peut pas dépasser 50"),

  heures: z
    .number()
    .int("Le nombre d'heures doit être un entier")
    .min(1, "Le nombre d'heures doit être au moins 1")
    .max(2000, "Le nombre d'heures ne peut pas dépasser 2000"),

  lieu: z
    .string()
    .min(1, "Le lieu ne peut pas être vide")
    .max(200, "Le lieu ne peut pas dépasser 200 caractères"),

  periode: z
    .string()
    .min(1, "La période ne peut pas être vide")
    .max(200, "La période ne peut pas dépasser 200 caractères"),

  // Financier
  tva: z
    .number()
    .min(0, "La TVA ne peut pas être négative")
    .max(100, "La TVA ne peut pas dépasser 100%"),

  coutCertification: z
    .number()
    .min(0, "Le coût de certification ne peut pas être négatif")
    .max(10000, "Le coût de certification ne peut pas dépasser 10000€"),

  // Admin
  refDevis: z
    .string()
    .min(1, "La référence du devis ne peut pas être vide")
    .max(50, "La référence du devis ne peut pas dépasser 50 caractères"),

  dateDevis: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD"),

  echeance: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "L'échéance doit être au format YYYY-MM-DD"),
});

// Types TypeScript dérivés des schémas Zod
export type Formation = z.infer<typeof FormationSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type DevisForm = z.infer<typeof DevisFormSchema>;

// Schémas pour les réponses API
export const ApiSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
});

export type ApiSuccessResponse<T = any> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  message?: string;
  details?: any;
};
