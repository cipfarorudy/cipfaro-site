import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log de l'erreur pour le debugging
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Erreur de validation Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      message: "Les données fournies ne sont pas valides",
      details: err.issues.map((issue: any) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Erreurs HTTP personnalisées
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // Erreur interne du serveur par défaut
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Une erreur interne s'est produite",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Middleware pour créer des erreurs HTTP personnalisées
export const createHttpError = (
  statusCode: number,
  message: string
): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  return error;
};

// Middleware async error handler
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
