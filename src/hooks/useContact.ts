import { useState, useCallback } from "react";
import {
  contactService,
  ContactForm,
  ContactResponse,
  ContactInfo,
  ContactOptions,
} from "../services/contactService";

/**
 * Hook pour soumettre une demande de contact
 */
export const useContactSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ContactResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (formData: ContactForm) => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const result = await contactService.submitContact(formData);

      if (result) {
        setResponse(result);
        return { success: true, data: result };
      } else {
        setError("Erreur lors de l'envoi de la demande");
        return { success: false, error: "Erreur lors de l'envoi" };
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
    setResponse(null);
    setError(null);
  }, []);

  return {
    submit,
    loading,
    response,
    error,
    reset,
  };
};

/**
 * Hook pour récupérer les informations de contact
 */
export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContactInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactService.getContactInfo();
      setContactInfo(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des informations"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contactInfo,
    loading,
    error,
    fetchContactInfo,
  };
};

/**
 * Hook pour récupérer les options de contact
 */
export const useContactOptions = () => {
  const [options, setOptions] = useState<ContactOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactService.getContactOptions();
      setOptions(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des options"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    options,
    loading,
    error,
    fetchOptions,
  };
};

/**
 * Hook pour la gestion d'un formulaire de contact
 */
export const useContactForm = (initialData?: Partial<ContactForm>) => {
  const [formData, setFormData] = useState<ContactForm>(() => {
    const emptyForm = contactService.createEmptyForm();
    return { ...emptyForm, ...initialData };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(
    (field: keyof ContactForm, value: any) => {
      setFormData((current) => ({ ...current, [field]: value }));
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
    [errors]
  );

  const validate = useCallback(() => {
    const validation = contactService.validateForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const reset = useCallback(() => {
    const emptyForm = contactService.createEmptyForm();
    setFormData({ ...emptyForm, ...initialData });
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  const clone = useCallback(() => {
    return contactService.cloneForm(formData);
  }, [formData]);

  return {
    formData,
    errors,
    isDirty,
    updateField,
    validate,
    reset,
    clone,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Hook pour la validation en temps réel
 */
export const useContactValidation = (formData: Partial<ContactForm>) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((field: keyof ContactForm, value: any) => {
    let error = "";

    switch (field) {
      case "nom":
        if (!value || value.trim().length < 2) {
          error = "Le nom doit contenir au moins 2 caractères";
        }
        break;

      case "email":
        if (!value) {
          error = "L'adresse email est requise";
        } else if (!contactService.validateEmail(value)) {
          error = "Adresse email invalide";
        }
        break;

      case "telephone":
        if (value && !contactService.validatePhone(value)) {
          error = "Numéro de téléphone français invalide";
        }
        break;

      case "message":
        if (!value || value.trim().length < 10) {
          error = "Le message doit contenir au moins 10 caractères";
        }
        break;
    }

    setFieldErrors((current) => {
      const newErrors = { ...current };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });

    return error === "";
  }, []);

  const validateAll = useCallback(() => {
    const validation = contactService.validateForm(formData);
    setFieldErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const clearErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  return {
    fieldErrors,
    validateField,
    validateAll,
    clearErrors,
    hasErrors: Object.keys(fieldErrors).length > 0,
  };
};
