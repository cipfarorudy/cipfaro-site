import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { formationsService } from "../services/formationsService.js";
import { z } from "zod";
import type { ApiSuccessResponse, ApiErrorResponse } from "../schemas/index.js";

const router = Router();

// Schéma de validation pour les paramètres de recherche
const SearchQuerySchema = z.object({
  q: z.string().optional(),
  certifiante: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  etat: z.string().optional(),
});

// Schéma de validation pour le paramètre slug
const SlugParamSchema = z.object({
  slug: z.string().min(1, "Le slug est requis"),
});

/**
 * GET /api/formations
 * Récupère toutes les formations ou recherche avec des critères
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    // Validation manuelle des query params
    const searchQuery = SearchQuerySchema.safeParse(req.query);
    if (!searchQuery.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "VALIDATION_ERROR",
        message: "Paramètres de recherche invalides",
        details: searchQuery.error.issues,
      };
      return res.status(400).json(errorResponse);
    }

    const { q, certifiante, etat } = searchQuery.data;

    let formations;

    // Si des critères de recherche sont fournis
    if (q || certifiante !== undefined || etat) {
      formations = await formationsService.searchFormations({
        query: q,
        certifiante: certifiante,
        etat: etat,
      });
    } else {
      // Sinon, récupérer toutes les formations
      formations = await formationsService.getAllFormations();
    }

    const response: ApiSuccessResponse = {
      success: true,
      data: formations,
      message: `${formations.length} formation(s) trouvée(s)`,
    };

    res.json(response);
  })
);

/**
 * GET /api/formations/stats
 * Récupère les statistiques des formations
 */
router.get(
  "/stats",
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await formationsService.getFormationsStats();

    const response: ApiSuccessResponse = {
      success: true,
      data: stats,
      message: "Statistiques des formations récupérées",
    };

    res.json(response);
  })
);

/**
 * GET /api/formations/:slug
 * Récupère une formation par son slug
 */
router.get(
  "/:slug",
  asyncHandler(async (req: Request, res: Response) => {
    // Validation manuelle des params
    const slugParam = SlugParamSchema.safeParse(req.params);
    if (!slugParam.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "VALIDATION_ERROR",
        message: "Paramètre slug invalide",
        details: slugParam.error.issues,
      };
      return res.status(400).json(errorResponse);
    }

    const { slug } = slugParam.data;

    const formation = await formationsService.getFormationBySlug(slug);

    if (!formation) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "FORMATION_NOT_FOUND",
        message: `Formation avec le slug "${slug}" non trouvée`,
      };
      return res.status(404).json(errorResponse);
    }

    const response: ApiSuccessResponse = {
      success: true,
      data: formation,
      message: "Formation récupérée avec succès",
    };

    res.json(response);
  })
);

/**
 * POST /api/formations/reload
 * Recharge les données des formations depuis le fichier
 */
router.post(
  "/reload",
  asyncHandler(async (req: Request, res: Response) => {
    await formationsService.reloadFormations();

    const response: ApiSuccessResponse = {
      success: true,
      data: null,
      message: "Données des formations rechargées avec succès",
    };

    res.json(response);
  })
);

export default router;
