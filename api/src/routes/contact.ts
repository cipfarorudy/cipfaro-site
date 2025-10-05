import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ContactFormSchema } from "../schemas/index.js";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
  ContactForm,
} from "../schemas/index.js";

const router = Router();

/**
 * POST /api/contact
 * Traite les demandes de contact
 */
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    // Validation du formulaire de contact
    const contactForm = ContactFormSchema.safeParse(req.body);

    if (!contactForm.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "VALIDATION_ERROR",
        message: "Données du formulaire de contact invalides",
        details: contactForm.error.issues,
      };
      return res.status(400).json(errorResponse);
    }

    const formData: ContactForm = contactForm.data;

    try {
      // Ici, on pourrait intégrer un service d'envoi d'email
      // Pour l'instant, on simule le traitement

      console.log("📧 Nouvelle demande de contact reçue:");
      console.log(`   Nom: ${formData.nom}`);
      console.log(`   Email: ${formData.email}`);
      console.log(`   Téléphone: ${formData.telephone || "Non fourni"}`);
      console.log(`   Objet: ${formData.objet}`);
      console.log(`   Message: ${formData.message.substring(0, 100)}...`);

      if (formData.wantsCallback) {
        console.log(
          `   Demande de rappel: ${formData.prefhoraire || "Aucune préférence"}`
        );
      }

      // Simulation d'un traitement asynchrone
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Génération d'un numéro de référence
      const reference = `CONT-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;

      const response: ApiSuccessResponse = {
        success: true,
        data: {
          reference,
          message: "Votre demande a été enregistrée avec succès",
          estimatedResponse: formData.wantsCallback ? "24 heures" : "48 heures",
          contact: {
            nom: formData.nom,
            email: formData.email,
            objet: formData.objet,
          },
        },
        message: "Demande de contact traitée avec succès",
      };

      res.status(201).json(response);
    } catch (error) {
      console.error(
        "❌ Erreur lors du traitement de la demande de contact:",
        error
      );

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "PROCESSING_ERROR",
        message:
          "Erreur lors du traitement de votre demande. Veuillez réessayer plus tard.",
      };

      res.status(500).json(errorResponse);
    }
  })
);

/**
 * GET /api/contact/info
 * Récupère les informations de contact de CIP FARO
 */
router.get(
  "/info",
  asyncHandler(async (req: Request, res: Response) => {
    const contactInfo = {
      entreprise: "CIP FARO",
      adresse: {
        rue: "Adresse à définir",
        ville: "Ville à définir",
        codePostal: "Code postal à définir",
        pays: "France",
      },
      telephone: {
        principal: "Numéro à définir",
        mobile: "Mobile à définir",
      },
      email: {
        principal: "contact@cipfaro.fr",
        formation: "formation@cipfaro.fr",
        commercial: "commercial@cipfaro.fr",
      },
      horaires: {
        lundi: "9h00 - 18h00",
        mardi: "9h00 - 18h00",
        mercredi: "9h00 - 18h00",
        jeudi: "9h00 - 18h00",
        vendredi: "9h00 - 18h00",
        samedi: "Fermé",
        dimanche: "Fermé",
      },
      certifications: ["Qualiopi", "ICPF & PSI"],
      reseauxSociaux: {
        linkedin: "https://linkedin.com/company/cipfaro",
        facebook: "https://facebook.com/cipfaro",
      },
    };

    const response: ApiSuccessResponse = {
      success: true,
      data: contactInfo,
      message: "Informations de contact récupérées",
    };

    res.json(response);
  })
);

/**
 * GET /api/contact/options
 * Récupère les options disponibles pour les objets de contact
 */
router.get(
  "/options",
  asyncHandler(async (req: Request, res: Response) => {
    const options = {
      objets: [
        {
          value: "information-formation",
          label: "Information sur une formation",
          description: "Demande de renseignements sur nos formations",
        },
        {
          value: "inscription",
          label: "Inscription à une formation",
          description: "Demande d'inscription à une formation spécifique",
        },
        {
          value: "financement",
          label: "Financement de formation",
          description:
            "Questions sur le financement des formations (CPF, OPCO, etc.)",
        },
        {
          value: "accessibilite",
          label: "Accessibilité handicap",
          description: "Questions sur l'accessibilité de nos formations",
        },
        {
          value: "partenariat",
          label: "Partenariat entreprise",
          description: "Proposition de partenariat ou formation en entreprise",
        },
        {
          value: "autre",
          label: "Autre demande",
          description: "Toute autre demande non listée ci-dessus",
        },
      ],
    };

    const response: ApiSuccessResponse = {
      success: true,
      data: options,
      message: "Options de contact récupérées",
    };

    res.json(response);
  })
);

export default router;
