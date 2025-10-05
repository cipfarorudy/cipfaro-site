// Configuration de l'API
const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:4000/api";

// Types pour les réponses API
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: any;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Configuration par défaut pour fetch
const defaultFetchOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Classe utilitaire pour les appels API
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Méthode générique pour les requêtes fetch
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...defaultFetchOptions,
        ...options,
        headers: {
          ...defaultFetchOptions.headers,
          ...options.headers,
        },
      });

      // Parse la réponse JSON
      const data = await response.json();

      // Retourne directement les données (elles contiennent déjà success, data, etc.)
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        success: false,
        error: "NETWORK_ERROR",
        message: "Erreur de connexion au serveur",
        details: error,
      };
    }
  }

  /**
   * Requête GET
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * Requête POST
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête PUT
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête DELETE
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Vérification de la santé de l'API
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.get("/health");
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient();

// Fonctions utilitaires pour gérer les réponses
export const isApiSuccess = <T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

export const isApiError = (
  response: ApiResponse<any>
): response is ApiErrorResponse => {
  return response.success === false;
};

export const getApiData = <T>(response: ApiResponse<T>): T | null => {
  if (isApiSuccess(response)) {
    return response.data;
  }
  return null;
};

export const getApiError = (response: ApiResponse<any>): string => {
  if (isApiError(response)) {
    return response.message || response.error || "Erreur inconnue";
  }
  return "";
};

export default apiClient;
