import { Formation } from "../schemas/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FormationsService {
  private formations: Formation[] = [];
  private loaded = false;

  /**
   * Charge les données des formations depuis le fichier JSON
   */
  private async loadFormations(): Promise<void> {
    if (this.loaded) return;

    try {
      // Chemin vers le fichier de données des formations dans le frontend
      const dataPath = path.join(
        __dirname,
        "../../../src/data/formations.json"
      );
      const rawData = await fs.readFile(dataPath, "utf-8");
      const data = JSON.parse(rawData);

      if (Array.isArray(data)) {
        this.formations = data;
      } else {
        throw new Error("Format de données invalide");
      }

      this.loaded = true;
      console.log(`✓ ${this.formations.length} formations chargées`);
    } catch (error) {
      console.error("Erreur lors du chargement des formations:", error);
      throw new Error("Impossible de charger les données des formations");
    }
  }

  /**
   * Récupère toutes les formations
   */
  async getAllFormations(): Promise<Formation[]> {
    await this.loadFormations();
    return this.formations;
  }

  /**
   * Récupère une formation par son slug
   */
  async getFormationBySlug(slug: string): Promise<Formation | null> {
    await this.loadFormations();
    return this.formations.find((formation) => formation.slug === slug) || null;
  }

  /**
   * Recherche des formations par critères
   */
  async searchFormations(criteria: {
    query?: string;
    certifiante?: boolean;
    etat?: string;
  }): Promise<Formation[]> {
    await this.loadFormations();

    let results = [...this.formations];

    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      results = results.filter(
        (formation) =>
          formation.titre.toLowerCase().includes(query) ||
          formation.code_officiel.toLowerCase().includes(query) ||
          formation.objectifs.some((obj) => obj.toLowerCase().includes(query))
      );
    }

    if (criteria.certifiante !== undefined) {
      results = results.filter(
        (formation) => formation.certifiante === criteria.certifiante
      );
    }

    if (criteria.etat) {
      results = results.filter((formation) => formation.etat === criteria.etat);
    }

    return results;
  }

  /**
   * Récupère les formations par état
   */
  async getFormationsByEtat(etat: string): Promise<Formation[]> {
    await this.loadFormations();
    return this.formations.filter((formation) => formation.etat === etat);
  }

  /**
   * Récupère les statistiques des formations
   */
  async getFormationsStats(): Promise<{
    total: number;
    certifiantes: number;
    nonCertifiantes: number;
    parEtat: Record<string, number>;
  }> {
    await this.loadFormations();

    const stats = {
      total: this.formations.length,
      certifiantes: this.formations.filter((f) => f.certifiante).length,
      nonCertifiantes: this.formations.filter((f) => !f.certifiante).length,
      parEtat: {} as Record<string, number>,
    };

    // Compter par état
    this.formations.forEach((formation) => {
      const etat = formation.etat || "inconnu";
      stats.parEtat[etat] = (stats.parEtat[etat] || 0) + 1;
    });

    return stats;
  }

  /**
   * Recharge les données depuis le fichier
   */
  async reloadFormations(): Promise<void> {
    this.loaded = false;
    this.formations = [];
    await this.loadFormations();
  }
}

// Instance singleton du service
export const formationsService = new FormationsService();
