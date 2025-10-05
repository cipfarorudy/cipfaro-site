import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// Interface pour une requête validée avec des types spécifiques
export interface ValidatedRequest<TBody = any, TQuery = any, TParams = any>
  extends Request {
  body: TBody;
  query: TQuery;
  params: TParams;
}

// Types pour les schémas de validation
interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Middleware de validation utilisant Zod
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valider le body si un schéma est fourni
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      // Valider la query si un schéma est fourni
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      // Valider les params si un schéma est fourni
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      // L'erreur sera gérée par le middleware d'erreur global
      next(error);
    }
  };
}

// Export par défaut aussi
export default validate;
