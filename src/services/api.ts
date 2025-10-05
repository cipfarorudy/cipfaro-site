// Service API pour CIP FARO
// Version: 2.0 - API complète avec authentification et uploads

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000");
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true";

// Interface pour la gestion des erreurs
interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Utilitaire pour les requêtes HTTP
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout: number) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message:
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          details: errorData,
        } as ApiError;
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw {
          message: "Timeout de la requête API",
          status: 408,
          details: error,
        } as ApiError;
      }

      if (error.status) {
        throw error; // Erreur API déjà formatée
      }

      throw {
        message: "Erreur de connexion à l'API",
        status: 0,
        details: error,
      } as ApiError;
    }
  }

  async get(endpoint: string, headers?: Record<string, string>) {
    return this.makeRequest(endpoint, {
      method: "GET",
      headers,
    });
  }

  async post(endpoint: string, data?: any, headers?: Record<string, string>) {
    return this.makeRequest(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  }

  async postFormData(
    endpoint: string,
    formData: FormData,
    headers?: Record<string, string>
  ) {
    return this.makeRequest(endpoint, {
      method: "POST",
      headers: {
        // Ne pas définir Content-Type pour FormData (le navigateur le fait automatiquement)
        ...headers,
      },
      body: formData,
    });
  }
}

// Instance du client API
const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);

// Services d'authentification
export const authService = {
  async login(email: string, password: string) {
    if (!USE_REAL_API) {
      // Simulation pour développement
      return {
        success: true,
        user: { id: 1, email, nom: "Test", prenom: "User", role: "stagiaire" },
        token: "fake-token",
      };
    }

    const result = await apiClient.post("/auth/login", { email, password });

    // Stocker le token
    if (result.token) {
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user_data", JSON.stringify(result.user));
    }

    return result;
  },

  async register(userData: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone?: string;
    role?: string;
  }) {
    if (!USE_REAL_API) {
      return {
        success: true,
        user: { ...userData, id: Date.now() },
        token: "fake-token",
      };
    }

    const result = await apiClient.post("/auth/register", userData);

    if (result.token) {
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user_data", JSON.stringify(result.user));
    }

    return result;
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  },

  getCurrentUser() {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },

  getToken() {
    return localStorage.getItem("auth_token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

// Service pour les formations
export const formationsService = {
  async getAll(filters?: {
    categorie?: string;
    niveau?: string;
    recherche?: string;
  }) {
    const params = new URLSearchParams();

    if (filters?.categorie) params.append("categorie", filters.categorie);
    if (filters?.niveau) params.append("niveau", filters.niveau);
    if (filters?.recherche) params.append("recherche", filters.recherche);

    const queryString = params.toString();
    const endpoint = `/formations${queryString ? `?${queryString}` : ""}`;

    return apiClient.get(endpoint);
  },

  async getById(id: number) {
    return apiClient.get(`/formations/${id}`);
  },
};

// Service pour les formulaires de contact
export const contactService = {
  async sendMessage(contactData: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    sujet: string;
    message: string;
  }) {
    if (!USE_REAL_API) {
      // Simulation pour développement
      console.log("📧 Message de contact simulé:", contactData);
      return {
        success: true,
        message: "Message envoyé avec succès (simulation)",
        id: `sim-${Date.now()}`,
      };
    }

    return apiClient.post("/contact", contactData);
  },
};

// Service pour les pré-inscriptions
export const preinscriptionService = {
  async submit(
    preinscriptionData: {
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      adresse?: string;
      ville?: string;
      codePostal?: string;
      formationSouhaitee: string;
      situationActuelle?: string;
      motivations?: string;
      disponibilite?: string;
    },
    cvFile?: File
  ) {
    if (!USE_REAL_API) {
      console.log("📝 Pré-inscription simulée:", preinscriptionData);
      return {
        success: true,
        message: "Pré-inscription enregistrée avec succès (simulation)",
        reference: `SIM-${Date.now()}`,
      };
    }

    const formData = new FormData();

    // Ajouter tous les champs
    Object.entries(preinscriptionData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Ajouter le fichier CV si présent
    if (cvFile) {
      formData.append("cv", cvFile);
    }

    return apiClient.postFormData("/preinscription", formData);
  },
};

// Service pour les devis
export const devisService = {
  async submit(devisData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    entreprise?: string;
    secteur?: string;
    typeFormation: string;
    nombreParticipants?: number;
    dureePreferee?: string;
    objectifs?: string;
    contraintes?: string;
    budget?: number;
  }) {
    if (!USE_REAL_API) {
      console.log("💰 Demande de devis simulée:", devisData);
      return {
        success: true,
        message: "Demande de devis enregistrée avec succès (simulation)",
        reference: `DEV-${Date.now()}`,
      };
    }

    return apiClient.post("/devis", devisData);
  },

  async calculate(calculationData: {
    mode: string;
    participants: number;
    heures: number;
    tva: number;
  }) {
    return apiClient.post("/devis/calculate", calculationData);
  },
};

// Service pour l'administration
export const adminService = {
  async getStats() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Token d'authentification requis");
    }

    return apiClient.get("/admin/stats", {
      Authorization: `Bearer ${token}`,
    });
  },

  async getContacts() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Token d'authentification requis");
    }

    return apiClient.get("/admin/contacts", {
      Authorization: `Bearer ${token}`,
    });
  },
};

// Service pour vérifier la santé de l'API
export const healthService = {
  async check() {
    return apiClient.get("/health");
  },
};

// Utilitaires pour la gestion des erreurs
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message;
  }

  if (error.status === 0) {
    return "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
  }

  if (error.status >= 500) {
    return "Erreur serveur. Veuillez réessayer plus tard.";
  }

  if (error.status === 429) {
    return "Trop de requêtes. Veuillez attendre quelques instants avant de réessayer.";
  }

  return "Une erreur inattendue s'est produite. Veuillez réessayer.";
};

// Export de configuration
export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
  useRealApi: USE_REAL_API,
};

// Export par défaut
export default {
  auth: authService,
  formations: formationsService,
  contact: contactService,
  preinscription: preinscriptionService,
  devis: devisService,
  admin: adminService,
  health: healthService,
  handleError: handleApiError,
  config: apiConfig,
};
