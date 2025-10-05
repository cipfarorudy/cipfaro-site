import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { DevisFormSchema } from "../schemas/index.js";
import { formationsService } from "../services/formationsService.js";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
  DevisForm,
} from "../schemas/index.js";

const router = Router();

/**
 * POST /api/devis
 * Génère un devis de formation
 */
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    // Validation du formulaire de devis
    const devisForm = DevisFormSchema.safeParse(req.body);

    if (!devisForm.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "VALIDATION_ERROR",
        message: "Données du formulaire de devis invalides",
        details: devisForm.error.issues,
      };
      return res.status(400).json(errorResponse);
    }

    const formData: DevisForm = devisForm.data;

    try {
      // Récupérer les informations de la formation
      const formation = await formationsService.getFormationBySlug(
        formData.formationSlug
      );

      if (!formation) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "FORMATION_NOT_FOUND",
          message: `Formation avec le slug "${formData.formationSlug}" non trouvée`,
        };
        return res.status(404).json(errorResponse);
      }

      // Calculs du devis
      const tarifHoraire = formData.mode === "individuel" ? 80 : 60; // €/h par participant
      const sousTotal = formData.heures * formData.participants * tarifHoraire;
      const montantTVA = sousTotal * (formData.tva / 100);
      const totalHT = sousTotal + formData.coutCertification;
      const totalTTC = totalHT + montantTVA;

      // Génération du devis
      const devis = {
        reference: formData.refDevis,
        dateDevis: formData.dateDevis,
        echeance: formData.echeance,

        // Informations client
        client: {
          nom: formData.clientNom,
          email: formData.clientEmail,
          telephone: formData.clientTelephone,
          adresse: formData.clientAdresse,
          siret: formData.clientSiret,
        },

        // Informations formation
        formation: {
          titre: formation.titre,
          code: formation.code_officiel,
          slug: formation.slug,
          certifiante: formation.certifiante,
        },

        // Détails prestation
        prestation: {
          mode: formData.mode,
          participants: formData.participants,
          heures: formData.heures,
          lieu: formData.lieu,
          periode: formData.periode,
          tarifHoraire,
        },

        // Calculs financiers
        financier: {
          sousTotal,
          coutCertification: formData.coutCertification,
          totalHT,
          tauxTVA: formData.tva,
          montantTVA,
          totalTTC,
        },

        // Conditions
        conditions: {
          validite: "30 jours",
          acompte: "30% à la signature",
          solde: "À réception de la facture",
          annulation: "Possible jusqu'à 15 jours avant le début",
        },
      };

      console.log("📄 Nouveau devis généré:");
      console.log(`   Référence: ${devis.reference}`);
      console.log(`   Client: ${formData.clientNom}`);
      console.log(`   Formation: ${formation.titre}`);
      console.log(`   Total TTC: ${totalTTC.toFixed(2)} €`);

      const response: ApiSuccessResponse = {
        success: true,
        data: devis,
        message: "Devis généré avec succès",
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("❌ Erreur lors de la génération du devis:", error);

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "PROCESSING_ERROR",
        message:
          "Erreur lors de la génération du devis. Veuillez réessayer plus tard.",
      };

      res.status(500).json(errorResponse);
    }
  })
);

/**
 * GET /api/devis/template
 * Récupère un template de devis avec les valeurs par défaut
 */
router.get(
  "/template",
  asyncHandler(async (req: Request, res: Response) => {
    const today = new Date();
    const echeance = new Date(today);
    echeance.setDate(today.getDate() + 30);

    const template = {
      refDevis: `DEV-${today.getFullYear()}${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${today
        .getDate()
        .toString()
        .padStart(2, "0")}-${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`,
      dateDevis: today.toISOString().split("T")[0],
      echeance: echeance.toISOString().split("T")[0],
      tva: 20,
      coutCertification: 0,
      mode: "individuel",
      participants: 1,
      heures: 35,
    };

    const response: ApiSuccessResponse = {
      success: true,
      data: template,
      message: "Template de devis récupéré",
    };

    res.json(response);
  })
);

/**
 * GET /api/devis/tarifs
 * Récupère la grille tarifaire
 */
router.get(
  "/tarifs",
  asyncHandler(async (req: Request, res: Response) => {
    const tarifs = {
      individuel: {
        tarifHoraire: 80,
        description: "Formation en individuel avec formateur dédié",
        minimumHeures: 7,
        maximumHeures: 2000,
      },
      groupe: {
        tarifHoraire: 60,
        description: "Formation en groupe (2 à 12 participants)",
        minimumParticipants: 2,
        maximumParticipants: 12,
        minimumHeures: 14,
        maximumHeures: 2000,
      },
      certification: {
        description: "Coût de certification variable selon la formation",
        exemples: [
          { formation: "RNCP Niveau 5", cout: 500 },
          { formation: "RNCP Niveau 6", cout: 750 },
          { formation: "Certification professionnelle", cout: 300 },
        ],
      },
      tva: {
        taux: 20,
        description: "TVA applicable aux formations professionnelles",
        exoneration: "Possible pour certaines formations éligibles",
      },
      conditions: {
        validiteDevis: "30 jours",
        acompte: "30% à la signature",
        soldeFinalisation: "À réception de la facture",
        delaiAnnulation: "15 jours avant le début",
        fraisDeplacementHorsDepartement: "Nous consulter",
      },
    };

    const response: ApiSuccessResponse = {
      success: true,
      data: tarifs,
      message: "Grille tarifaire récupérée",
    };

    res.json(response);
  })
);

/**
 * POST /api/devis/calculate
 * Calcule le montant d'un devis sans le sauvegarder
 */
router.post(
  "/calculate",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      mode,
      participants,
      heures,
      tva = 20,
      coutCertification = 0,
    } = req.body;

    // Validation basique
    if (!mode || !participants || !heures) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "MISSING_PARAMETERS",
        message:
          "Paramètres manquants pour le calcul (mode, participants, heures)",
      };
      return res.status(400).json(errorResponse);
    }

    const tarifHoraire = mode === "individuel" ? 80 : 60;
    const sousTotal = heures * participants * tarifHoraire;
    const totalHT = sousTotal + coutCertification;
    const montantTVA = totalHT * (tva / 100);
    const totalTTC = totalHT + montantTVA;

    const calcul = {
      parametres: {
        mode,
        participants,
        heures,
        tarifHoraire,
        tva,
        coutCertification,
      },
      resultats: {
        sousTotal,
        totalHT,
        montantTVA,
        totalTTC,
      },
    };

    const response: ApiSuccessResponse = {
      success: true,
      data: calcul,
      message: "Calcul effectué avec succès",
    };

    res.json(response);
  })
);

export default router;
