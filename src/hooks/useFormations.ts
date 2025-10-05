import { useState, useEffect, useCallback } from "react";
import {
  formationsService,
  Formation,
  FormationsStats,
  FormationSearchParams,
} from "../services/formationsService";

/**
 * Hook pour récupérer toutes les formations
 */
export const useFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFormations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formationsService.getFormations();
      setFormations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des formations"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  return {
    formations,
    loading,
    error,
    refetch: fetchFormations,
  };
};

/**
 * Hook pour rechercher des formations
 */
export const useFormationsSearch = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: FormationSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await formationsService.searchFormations(params);
      setFormations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la recherche"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFormations([]);
    setError(null);
  }, []);

  return {
    formations,
    loading,
    error,
    search,
    reset,
  };
};

/**
 * Hook pour récupérer une formation par slug
 */
export const useFormation = (slug?: string) => {
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormation = useCallback(async (formationSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await formationsService.getFormationBySlug(formationSlug);
      setFormation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de la formation"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      fetchFormation(slug);
    }
  }, [slug, fetchFormation]);

  return {
    formation,
    loading,
    error,
    refetch: slug ? () => fetchFormation(slug) : undefined,
  };
};

/**
 * Hook pour les statistiques des formations
 */
export const useFormationsStats = () => {
  const [stats, setStats] = useState<FormationsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formationsService.getFormationsStats();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des statistiques"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

/**
 * Hook pour filtrer et trier les formations localement
 */
export const useFormationsFilter = (formations: Formation[]) => {
  const [filteredFormations, setFilteredFormations] =
    useState<Formation[]>(formations);

  const filterByCertification = useCallback(
    (certifiante: boolean | null) => {
      if (certifiante === null) {
        setFilteredFormations(formations);
      } else {
        setFilteredFormations(
          formationsService.filterByCertification(formations, certifiante)
        );
      }
    },
    [formations]
  );

  const filterByEtat = useCallback(
    (etat: string | null) => {
      if (etat === null) {
        setFilteredFormations(formations);
      } else {
        setFilteredFormations(formationsService.filterByEtat(formations, etat));
      }
    },
    [formations]
  );

  const searchLocal = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFilteredFormations(formations);
      } else {
        setFilteredFormations(formationsService.searchLocal(formations, query));
      }
    },
    [formations]
  );

  const sortByTitle = useCallback((ascending: boolean = true) => {
    setFilteredFormations((current) =>
      formationsService.sortByTitle(current, ascending)
    );
  }, []);

  const reset = useCallback(() => {
    setFilteredFormations(formations);
  }, [formations]);

  useEffect(() => {
    setFilteredFormations(formations);
  }, [formations]);

  return {
    filteredFormations,
    filterByCertification,
    filterByEtat,
    searchLocal,
    sortByTitle,
    reset,
  };
};
