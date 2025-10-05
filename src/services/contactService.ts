import { apiClient, getApiData } from "./apiClient";

// Types pour le contact (synchronisés avec l'API)
export interface ContactForm {
  nom: string;
  email: string;
  telephone?: string;
  objet:
    | "information-formation"
    | "inscription"
    | "financement"
    | "accessibilite"
    | "partenariat"
    | "autre";
  message: string;
  wantsCallback?: boolean;
  prefhoraire?: string;
}

export interface ContactResponse {
  reference: string;
  message: string;
  estimatedResponse: string;
  contact: {
    nom: string;
    email: string;
    objet: string;
  };
}

export interface ContactInfo {
  entreprise: string;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  telephone: {
    principal: string;
    mobile: string;
  };
  email: {
    principal: string;
    formation: string;
    commercial: string;
  };
  horaires: Record<string, string>;
  certifications: string[];
  reseauxSociaux: {
    linkedin?: string;
    facebook?: string;
  };
}

export interface ContactOption {
  value: string;
  label: string;
  description: string;
}

export interface ContactOptions {
  objets: ContactOption[];
}

/**
 * Service pour la gestion du contact via l'API
 */
class ContactService {
  /**
   * Soumet une demande de contact
   */
  async submitContact(formData: ContactForm): Promise<ContactResponse | null> {
    const response = await apiClient.post<ContactResponse>(
      "/contact",
      formData
    );
    return getApiData(response);
  }

  /**
   * Récupère les informations de contact de CIP FARO
   */
  async getContactInfo(): Promise<ContactInfo | null> {
    const response = await apiClient.get<ContactInfo>("/contact/info");
    return getApiData(response);
  }

  /**
   * Récupère les options disponibles pour les objets de contact
   */
  async getContactOptions(): Promise<ContactOptions | null> {
    const response = await apiClient.get<ContactOptions>("/contact/options");
    return getApiData(response);
  }

  /**
   * Valide un email côté client
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide un numéro de téléphone français
   */
  validatePhone(phone: string): boolean {
    if (!phone) return true; // Optionnel
    const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  /**
   * Formate un numéro de téléphone
   */
  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("33")) {
      return `+33 ${cleaned.substring(2, 3)} ${cleaned.substring(
        3,
        5
      )} ${cleaned.substring(5, 7)} ${cleaned.substring(
        7,
        9
      )} ${cleaned.substring(9)}`;
    } else if (cleaned.startsWith("0") && cleaned.length === 10) {
      return `${cleaned.substring(0, 2)} ${cleaned.substring(
        2,
        4
      )} ${cleaned.substring(4, 6)} ${cleaned.substring(
        6,
        8
      )} ${cleaned.substring(8)}`;
    }
    return phone;
  }

  /**
   * Validation complète du formulaire côté client
   */
  validateForm(formData: Partial<ContactForm>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!formData.nom || formData.nom.trim().length < 2) {
      errors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    if (!formData.email) {
      errors.email = "L'adresse email est requise";
    } else if (!this.validateEmail(formData.email)) {
      errors.email = "Adresse email invalide";
    }

    if (formData.telephone && !this.validatePhone(formData.telephone)) {
      errors.telephone = "Numéro de téléphone français invalide";
    }

    if (!formData.objet) {
      errors.objet = "Veuillez sélectionner un objet";
    }

    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = "Le message doit contenir au moins 10 caractères";
    }

    if (
      formData.wantsCallback &&
      formData.prefhoraire &&
      formData.prefhoraire.length > 200
    ) {
      errors.prefhoraire =
        "La préférence horaire ne peut pas dépasser 200 caractères";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Crée un objet ContactForm avec des valeurs par défaut
   */
  createEmptyForm(): ContactForm {
    return {
      nom: "",
      email: "",
      telephone: "",
      objet: "information-formation",
      message: "",
      wantsCallback: false,
      prefhoraire: "",
    };
  }

  /**
   * Clone un formulaire de contact
   */
  cloneForm(form: ContactForm): ContactForm {
    return { ...form };
  }
}

// Instance singleton du service de contact
export const contactService = new ContactService();

export default contactService;
