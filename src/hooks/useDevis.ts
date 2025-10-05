import { useState, useCallback, useEffect } from "react";
import {
  devisService,
  DevisForm,
  DevisResponse,
  TarifsInfo,
  DevisCalculation,
} from "../services/devisService";

/**
 * Hook pour générer un devis
 */
export const useDevisGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [devis, setDevis] = useState<DevisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (formData: DevisForm) => {
    try {
      setLoading(true);
      setError(null);
      setDevis(null);

      const result = await devisService.generateDevis(formData);

      if (result) {
        setDevis(result);
        return { success: true, data: result };
      } else {
        setError("Erreur lors de la génération du devis");
        return { success: false, error: "Erreur lors de la génération" };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDevis(null);
    setError(null);
  }, []);

  return {
    generate,
    loading,
    devis,
    error,
    reset,
  };
};

/**
 * Hook pour récupérer les tarifs
 */
export const useTarifs = () => {
  const [tarifs, setTarifs] = useState<TarifsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTarifs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await devisService.getTarifs();
      setTarifs(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des tarifs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTarifs();
  }, [fetchTarifs]);

  return {
    tarifs,
    loading,
    error,
    refetch: fetchTarifs,
  };
};

/**
 * Hook pour les calculs de devis en temps réel
 */
export const useDevisCalculation = () => {
  const [calculation, setCalculation] = useState<DevisCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(
    async (params: {
      mode: "individuel" | "groupe";
      participants: number;
      heures: number;
      tva?: number;
      coutCertification?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);

        // Utiliser le calcul côté client pour des performances meilleures
        const result = devisService.calculateTTC(
          params.heures,
          params.participants,
          params.mode,
          params.tva,
          params.coutCertification
        );

        setCalculation(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du calcul");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const calculateServer = useCallback(
    async (params: {
      mode: string;
      participants: number;
      heures: number;
      tva?: number;
      coutCertification?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const result = await devisService.calculateDevis(params);
        setCalculation(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du calcul");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    calculation,
    loading,
    error,
    calculate,
    calculateServer,
  };
};

/**
 * Hook pour la gestion d'un formulaire de devis
 */
export const useDevisForm = (initialData?: Partial<DevisForm>) => {
  const [formData, setFormData] = useState<DevisForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialisation du formulaire avec le template
  useEffect(() => {
    const initializeForm = async () => {
      try {
        const emptyForm = await devisService.createEmptyForm();
        setFormData({ ...emptyForm, ...initialData });
      } catch (err) {
        console.error("Erreur lors de l'initialisation du formulaire:", err);
        // Fallback avec des valeurs par défaut
        setFormData({
          clientNom: "",
          clientEmail: "",
          clientTelephone: "",
          clientAdresse: "",
          clientSiret: "",
          formationSlug: "",
          mode: "individuel",
          participants: 1,
          heures: 35,
          lieu: "",
          periode: "",
          tva: 20,
          coutCertification: 0,
          refDevis: devisService.generateReference(),
          dateDevis: new Date().toISOString().split("T")[0],
          echeance: devisService.calculateEcheance(
            new Date().toISOString().split("T")[0]
          ),
          ...initialData,
        } as DevisForm);
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [initialData]);

  const updateField = useCallback(
    (field: keyof DevisForm, value: any) => {
      if (!formData) return;

      setFormData((current) => {
        if (!current) return current;

        let newData = { ...current, [field]: value };

        // Calculs automatiques pour certains champs
        if (field === "dateDevis") {
          newData.echeance = devisService.calculateEcheance(value);
        }

        return newData;
      });

      setIsDirty(true);

      // Supprimer l'erreur du champ si elle existe
      if (errors[field]) {
        setErrors((current) => {
          const newErrors = { ...current };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [formData, errors]
  );

  const validate = useCallback(() => {
    if (!formData) return false;

    const validation = devisService.validateForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const reset = useCallback(async () => {
    try {
      const emptyForm = await devisService.createEmptyForm();
      setFormData({ ...emptyForm, ...initialData });
      setErrors({});
      setIsDirty(false);
    } catch (err) {
      console.error("Erreur lors du reset:", err);
    }
  }, [initialData]);

  return {
    formData,
    errors,
    isDirty,
    loading,
    updateField,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Hook pour l'auto-calcul lors des modifications du formulaire
 */
export const useDevisAutoCalculation = (
  mode: "individuel" | "groupe",
  participants: number,
  heures: number,
  tva: number = 20,
  coutCertification: number = 0
) => {
  const [calculation, setCalculation] = useState<DevisCalculation | null>(null);

  useEffect(() => {
    if (participants > 0 && heures > 0) {
      const result = devisService.calculateTTC(
        heures,
        participants,
        mode,
        tva,
        coutCertification
      );
      setCalculation(result);
    } else {
      setCalculation(null);
    }
  }, [mode, participants, heures, tva, coutCertification]);

  return calculation;
};

/**
 * Hook pour valider un champ spécifique
 */
export const useDevisFieldValidation = () => {
  const validateField = useCallback((field: keyof DevisForm, value: any) => {
    switch (field) {
      case "clientNom":
        return value && value.trim().length >= 2
          ? ""
          : "Le nom doit contenir au moins 2 caractères";

      case "clientEmail":
        if (!value) return "L'adresse email est requise";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Adresse email invalide";

      case "clientSiret":
        return !value || devisService.validateSiret(value)
          ? ""
          : "Le SIRET doit contenir 14 chiffres";

      case "participants":
        return value >= 1 && value <= 50
          ? ""
          : "Le nombre de participants doit être entre 1 et 50";

      case "heures":
        return value >= 1 && value <= 2000
          ? ""
          : "Le nombre d'heures doit être entre 1 et 2000";

      case "dateDevis":
      case "echeance":
        return devisService.validateDate(value)
          ? ""
          : "Date au format YYYY-MM-DD requise";

      default:
        return "";
    }
  }, []);

  return { validateField };
};
