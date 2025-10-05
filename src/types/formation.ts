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

export type { Formation as default };
