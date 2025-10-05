import { apiClient, getApiData } from "./apiClient";

// Types pour les devis (synchronisés avec l'API)
export interface DevisForm {
  // Informations client
  clientNom: string;
  clientEmail: string;
  clientTelephone?: string;
  clientAdresse?: string;
  clientSiret?: string;

  // Formation
  formationSlug: string;
  mode: "individuel" | "groupe";
  participants: number;
  heures: number;
  lieu: string;
  periode: string;

  // Financier
  tva: number;
  coutCertification: number;

  // Admin
  refDevis: string;
  dateDevis: string;
  echeance: string;
}

export interface DevisResponse {
  reference: string;
  dateDevis: string;
  echeance: string;
  client: {
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    siret?: string;
  };
  formation: {
    titre: string;
    code: string;
    slug: string;
    certifiante: boolean;
  };
  prestation: {
    mode: string;
    participants: number;
    heures: number;
    lieu: string;
    periode: string;
    tarifHoraire: number;
  };
  financier: {
    sousTotal: number;
    coutCertification: number;
    totalHT: number;
    tauxTVA: number;
    montantTVA: number;
    totalTTC: number;
  };
  conditions: {
    validite: string;
    acompte: string;
    solde: string;
    annulation: string;
  };
}

export interface DevisTemplate {
  refDevis: string;
  dateDevis: string;
  echeance: string;
  tva: number;
  coutCertification: number;
  mode: string;
  participants: number;
  heures: number;
}

export interface TarifsInfo {
  individuel: {
    tarifHoraire: number;
    description: string;
    minimumHeures: number;
    maximumHeures: number;
  };
  groupe: {
    tarifHoraire: number;
    description: string;
    minimumParticipants: number;
    maximumParticipants: number;
    minimumHeures: number;
    maximumHeures: number;
  };
  certification: {
    description: string;
    exemples: Array<{
      formation: string;
      cout: number;
    }>;
  };
  tva: {
    taux: number;
    description: string;
    exoneration: string;
  };
  conditions: {
    validiteDevis: string;
    acompte: string;
    soldeFinalisation: string;
    delaiAnnulation: string;
    fraisDeplacementHorsDepartement: string;
  };
}

export interface DevisCalculation {
  parametres: {
    mode: string;
    participants: number;
    heures: number;
    tarifHoraire: number;
    tva: number;
    coutCertification: number;
  };
  resultats: {
    sousTotal: number;
    totalHT: number;
    montantTVA: number;
    totalTTC: number;
  };
}

/**
 * Service pour la gestion des devis via l'API
 */
class DevisService {
  /**
   * Génère un devis complet
   */
  async generateDevis(formData: DevisForm): Promise<DevisResponse | null> {
    const response = await apiClient.post<DevisResponse>("/devis", formData);
    return getApiData(response);
  }

  /**
   * Récupère un template de devis avec valeurs par défaut
   */
  async getDevisTemplate(): Promise<DevisTemplate | null> {
    const response = await apiClient.get<DevisTemplate>("/devis/template");
    return getApiData(response);
  }

  /**
   * Récupère la grille tarifaire
   */
  async getTarifs(): Promise<TarifsInfo | null> {
    const response = await apiClient.get<TarifsInfo>("/devis/tarifs");
    return getApiData(response);
  }

  /**
   * Calcule le montant d'un devis sans le sauvegarder
   */
  async calculateDevis(params: {
    mode: string;
    participants: number;
    heures: number;
    tva?: number;
    coutCertification?: number;
  }): Promise<DevisCalculation | null> {
    const response = await apiClient.post<DevisCalculation>(
      "/devis/calculate",
      params
    );
    return getApiData(response);
  }

  /**
   * Validation du SIRET
   */
  validateSiret(siret: string): boolean {
    if (!siret) return true; // Optionnel
    return /^[0-9]{14}$/.test(siret);
  }

  /**
   * Validation d'une date au format YYYY-MM-DD
   */
  validateDate(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  /**
   * Génère une référence de devis unique
   */
  generateReference(): string {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `DEV-${dateStr}-${randomStr}`;
  }

  /**
   * Calcule la date d'échéance (30 jours par défaut)
   */
  calculateEcheance(dateDevis: string, jours: number = 30): string {
    const date = new Date(dateDevis);
    date.setDate(date.getDate() + jours);
    return date.toISOString().split("T")[0];
  }

  /**
   * Calcul côté client du montant TTC
   */
  calculateTTC(
    heures: number,
    participants: number,
    mode: "individuel" | "groupe",
    tva: number = 20,
    coutCertification: number = 0
  ): DevisCalculation {
    const tarifHoraire = mode === "individuel" ? 80 : 60;
    const sousTotal = heures * participants * tarifHoraire;
    const totalHT = sousTotal + coutCertification;
    const montantTVA = totalHT * (tva / 100);
    const totalTTC = totalHT + montantTVA;

    return {
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
  }

  /**
   * Validation complète du formulaire de devis
   */
  validateForm(formData: Partial<DevisForm>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    // Validation client
    if (!formData.clientNom || formData.clientNom.trim().length < 2) {
      errors.clientNom = "Le nom du client doit contenir au moins 2 caractères";
    }

    if (!formData.clientEmail) {
      errors.clientEmail = "L'adresse email est requise";
    }

    if (formData.clientSiret && !this.validateSiret(formData.clientSiret)) {
      errors.clientSiret = "Le SIRET doit contenir 14 chiffres";
    }

    // Validation formation
    if (!formData.formationSlug) {
      errors.formationSlug = "Veuillez sélectionner une formation";
    }

    if (!formData.mode || !["individuel", "groupe"].includes(formData.mode)) {
      errors.mode = 'Le mode doit être "individuel" ou "groupe"';
    }

    if (
      !formData.participants ||
      formData.participants < 1 ||
      formData.participants > 50
    ) {
      errors.participants = "Le nombre de participants doit être entre 1 et 50";
    }

    if (!formData.heures || formData.heures < 1 || formData.heures > 2000) {
      errors.heures = "Le nombre d'heures doit être entre 1 et 2000";
    }

    if (!formData.lieu || formData.lieu.trim().length === 0) {
      errors.lieu = "Le lieu ne peut pas être vide";
    }

    if (!formData.periode || formData.periode.trim().length === 0) {
      errors.periode = "La période ne peut pas être vide";
    }

    // Validation dates
    if (!formData.dateDevis || !this.validateDate(formData.dateDevis)) {
      errors.dateDevis = "La date du devis doit être au format YYYY-MM-DD";
    }

    if (!formData.echeance || !this.validateDate(formData.echeance)) {
      errors.echeance = "L'échéance doit être au format YYYY-MM-DD";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Crée un formulaire de devis vide avec valeurs par défaut
   */
  async createEmptyForm(): Promise<DevisForm> {
    const template = await this.getDevisTemplate();

    return {
      clientNom: "",
      clientEmail: "",
      clientTelephone: "",
      clientAdresse: "",
      clientSiret: "",
      formationSlug: "",
      mode: "individuel",
      participants: template?.participants || 1,
      heures: template?.heures || 35,
      lieu: "",
      periode: "",
      tva: template?.tva || 20,
      coutCertification: template?.coutCertification || 0,
      refDevis: template?.refDevis || this.generateReference(),
      dateDevis: template?.dateDevis || new Date().toISOString().split("T")[0],
      echeance:
        template?.echeance ||
        this.calculateEcheance(new Date().toISOString().split("T")[0]),
    };
  }
}

// Instance singleton du service de devis
export const devisService = new DevisService();

export default devisService;
