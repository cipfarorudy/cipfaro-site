import { apiClient, getApiData, isApiSuccess } from "./apiClient";

// Types pour les formations (synchronisés avec l'API)
export interface Formation {
  slug: string;
  code_officiel: string;
  titre: string;
  certifiante: boolean;
  rncp: string | null;
  certificateur: string | null;
  date_enregistrement: string | null;
  objectifs: string[];
  prerequis: string;
  duree: string;
  modalites: string;
  delais_acces: string;
  tarifs: string;
  contacts: string;
  methodes_mobilisees: string;
  modalites_evaluation: string;
  accessibilite_psh: string;
  debouches: string;
  passerelles: string;
  blocs_competences: string[];
  etat: string;
}

export interface FormationsStats {
  total: number;
  certifiantes: number;
  nonCertifiantes: number;
  parEtat: Record<string, number>;
}

export interface FormationSearchParams {
  q?: string;
  certifiante?: boolean;
  etat?: string;
}

/**
 * Service pour la gestion des formations via l'API
 */
class FormationsService {
  /**
   * Récupère toutes les formations
   */
  async getFormations(): Promise<Formation[]> {
    const response = await apiClient.get<Formation[]>("/formations");
    return getApiData(response) || [];
  }

  /**
   * Recherche des formations avec des critères
   */
  async searchFormations(params: FormationSearchParams): Promise<Formation[]> {
    const queryParams = new URLSearchParams();

    if (params.q) {
      queryParams.append("q", params.q);
    }

    if (params.certifiante !== undefined) {
      queryParams.append("certifiante", params.certifiante.toString());
    }

    if (params.etat) {
      queryParams.append("etat", params.etat);
    }

    const endpoint = queryParams.toString()
      ? `/formations?${queryParams.toString()}`
      : "/formations";

    const response = await apiClient.get<Formation[]>(endpoint);
    return getApiData(response) || [];
  }

  /**
   * Récupère une formation par son slug
   */
  async getFormationBySlug(slug: string): Promise<Formation | null> {
    const response = await apiClient.get<Formation>(`/formations/${slug}`);
    return getApiData(response);
  }

  /**
   * Récupère les statistiques des formations
   */
  async getFormationsStats(): Promise<FormationsStats | null> {
    const response = await apiClient.get<FormationsStats>("/formations/stats");
    return getApiData(response);
  }

  /**
   * Recharge les données des formations
   */
  async reloadFormations(): Promise<boolean> {
    const response = await apiClient.post("/formations/reload");
    return isApiSuccess(response);
  }

  /**
   * Filtre les formations par certification
   */
  filterByCertification(
    formations: Formation[],
    certifiante: boolean
  ): Formation[] {
    return formations.filter(
      (formation) => formation.certifiante === certifiante
    );
  }

  /**
   * Filtre les formations par état
   */
  filterByEtat(formations: Formation[], etat: string): Formation[] {
    return formations.filter((formation) => formation.etat === etat);
  }

  /**
   * Recherche locale dans les formations (côté client)
   */
  searchLocal(formations: Formation[], query: string): Formation[] {
    const lowerQuery = query.toLowerCase();
    return formations.filter(
      (formation) =>
        formation.titre.toLowerCase().includes(lowerQuery) ||
        formation.code_officiel.toLowerCase().includes(lowerQuery) ||
        formation.objectifs.some((obj) =>
          obj.toLowerCase().includes(lowerQuery)
        )
    );
  }

  /**
   * Trie les formations par titre
   */
  sortByTitle(formations: Formation[], ascending: boolean = true): Formation[] {
    return [...formations].sort((a, b) => {
      const comparison = a.titre.localeCompare(b.titre);
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Groupe les formations par état
   */
  groupByEtat(formations: Formation[]): Record<string, Formation[]> {
    return formations.reduce((groups, formation) => {
      const etat = formation.etat || "inconnu";
      if (!groups[etat]) {
        groups[etat] = [];
      }
      groups[etat].push(formation);
      return groups;
    }, {} as Record<string, Formation[]>);
  }
}

// Instance singleton du service des formations
export const formationsService = new FormationsService();

export default formationsService;
