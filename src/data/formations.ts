// src/data/formations.ts - Données des formations avec types TypeScript
import type { Formation } from "../types/formation";

export const formations: Formation[] = [
  // 1) TP Conseiller en Insertion Professionnelle (CIP) - Code: 11O2202749
  {
    slug: "tp-conseiller-insertion-professionnelle",
    code_officiel: "11O2202749",
    titre: "Conseil en insertion professionnelle",
    certifiante: true,
    rncp: "RNCP37274",
    certificateur: "Ministère du Travail",
    date_enregistrement: "2024-01-01",
    objectifs: [
      "Informer un public sur les ressources d'insertion et services dématérialisés",
      "Conduire un entretien d'accueil et formaliser un diagnostic",
      "Co-construire et suivre un parcours d'insertion",
    ],
    prerequis:
      "Niveau 4 conseillé, aisance numérique de base, motivation validée",
    duree: "840 heures",
    modalites: "Présentiel / distanciel (FOAD), ateliers, mises en situation",
    delais_acces: "Sous 30 jours après validation des prérequis et financement",
    tarifs: "Individuel : 5 550 € TTC — Groupe : 4 750 € TTC (par participant)",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees:
      "Apports théoriques, études de cas, jeux de rôle, plateformes numériques",
    modalites_evaluation:
      "Positionnement, évaluations formatives, ECF, épreuves finales",
    accessibilite_psh: "Locaux accessibles ; aménagements possibles",
    debouches:
      "CIP en structure d'insertion, conseiller emploi, chargé d'accompagnement",
    passerelles: "Vers FPA / REMN",
    blocs_competences: ["BC01", "BC02", "BC03"],
    etat: "valide",
  },

  // 2) TP Formateur Professionnel d'Adultes (FPA) - Code: 11O2202752
  {
    slug: "tp-formateur-professionnel-adultes",
    code_officiel: "11O2202752",
    titre: "TP - Formateur professionnel d'adultes",
    certifiante: true,
    rncp: "RNCP37275",
    certificateur: "Ministère du Travail",
    date_enregistrement: "2024-01-01",
    objectifs: [
      "Concevoir, préparer et animer des actions de formation",
      "Individualiser les parcours et accompagner les apprenants",
      "Évaluer les acquis et certifier les compétences",
    ],
    prerequis: "Niveau 4 conseillé, expérience ou projet pédagogique souhaité",
    duree: "910 heures",
    modalites: "Présentiel / FOAD, ateliers, co-animation, classe virtuelle",
    delais_acces: "Sous 30 jours après validation des prérequis et financement",
    tarifs:
      "Individuel : 13 650 € TTC — Groupe : 8 190 € TTC (par participant)",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees:
      "Pédagogie active, scénarisation, outils numériques (LMS, H5P, SCORM)",
    modalites_evaluation:
      "Dossiers, mises en situation, évaluations formatives/sommatives",
    accessibilite_psh:
      "Aménagements possibles (rythme, supports, modalités d'évaluation)",
    debouches: "Formateur·trice, concepteur pédagogique, référent FOAD",
    passerelles: "Vers titres de coordination, ingénierie de formation",
    blocs_competences: ["BC01", "BC02"],
    etat: "valide",
  },

  // 3) Conseiller en médiation digitale et de l'IA - Code: 11O2500128
  {
    slug: "conseiller-mediation-digitale-ia",
    code_officiel: "11O2500128",
    titre: "Conseiller en médiation digitale et de l'IA",
    certifiante: true,
    rncp: "RNCP37893",
    certificateur: "Ministère du Travail",
    date_enregistrement: "2025-01-01",
    objectifs: [
      "Accompagner les publics dans l'appropriation des outils numériques et de l'IA",
      "Concevoir et animer des ateliers de médiation digitale",
      "Développer des projets d'inclusion numérique avec l'IA",
    ],
    prerequis: "Appétence pour le numérique et l'innovation technologique",
    duree: "700 heures",
    modalites: "Présentiel / FOAD, ateliers pratiques, projets IA",
    delais_acces: "Sous 30 jours après validation des prérequis et financement",
    tarifs:
      "Individuel : 10 500 € TTC — Groupe : 6 300 € TTC (par participant)",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees:
      "Ateliers IA, plateformes numériques, projets collaboratifs",
    modalites_evaluation: "Projets, épreuves en situation, portfolio numérique",
    accessibilite_psh: "Étude de faisabilité et aménagements adaptés",
    debouches:
      "Conseiller en médiation digitale, spécialiste IA, facilitateur numérique",
    passerelles: "Vers REMN, formations spécialisées IA",
    blocs_competences: ["BC01", "BC02", "BC03"],
    etat: "valide",
  },

  // 4) Découverte de l'IA - Code: 11O2500127
  {
    slug: "decouverte-ia-informatique-algorithmes",
    code_officiel: "11O2500127",
    titre:
      "Découverte de l'IA : initiez-vous à l'informatique et aux algorithmes",
    certifiante: false,
    rncp: null,
    certificateur: null,
    date_enregistrement: null,
    objectifs: [
      "Comprendre les bases de l'intelligence artificielle",
      "S'initier aux algorithmes et à la logique informatique",
      "Découvrir les applications pratiques de l'IA",
    ],
    prerequis: "Aucun prérequis technique, curiosité pour l'innovation",
    duree: "35 heures (5 jours)",
    modalites: "Présentiel / classe virtuelle, démonstrations pratiques",
    delais_acces: "Sous 15 jours selon planning",
    tarifs: "Individuel : 525 € TTC — Groupe : 315 € TTC (par participant)",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees: "Ateliers découverte, outils IA, exercices guidés",
    modalites_evaluation: "Quiz, exercices pratiques, projet final",
    accessibilite_psh: "Supports adaptés, aménagements sur demande",
    debouches: "Montée en compétences numériques, orientation IA",
    passerelles: "Vers formations spécialisées IA, développement",
    blocs_competences: [],
    etat: "valide",
  },

  // 5) SAUVETEUR SECOURISTE DU TRAVAIL - Code: 11O2400128
  {
    slug: "sauveteur-secouriste-travail",
    code_officiel: "11O2400128",
    titre: "SAUVETEUR SECOURISTE DU TRAVAIL",
    certifiante: true,
    rncp: null,
    certificateur: "INRS",
    date_enregistrement: "2024-01-01",
    objectifs: [
      "Maîtriser la conduite à tenir et les gestes de premiers secours",
      "Savoir qui et comment alerter dans l'entreprise ou à l'extérieur",
      "Repérer les situations dangereuses et participer à la prévention",
    ],
    prerequis: "Aucun prérequis",
    duree: "14 heures (2 jours)",
    modalites: "Présentiel, mises en situation, mannequins de formation",
    delais_acces: "Sous 15 jours selon planning",
    tarifs: "Individuel : 210 € TTC — Groupe : 126 € TTC (par participant)",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees: "Pratique, simulations, études de cas d'accidents",
    modalites_evaluation: "Épreuve certificative pratique et théorique",
    accessibilite_psh: "Aménagements possibles selon handicap",
    debouches: "Certification SST obligatoire en entreprise",
    passerelles: "Vers Formateur SST, PSC1",
    blocs_competences: [],
    etat: "valide",
  },

  // 6) Responsable d'Espace de Médiation Numérique - Code: 11O2203114
  {
    slug: "tp-responsable-espace-mediation-numerique",
    code_officiel: "11O2203114",
    titre: "Responsable d'Espace de Médiation Numérique",
    certifiante: true,
    rncp: "RNCP37893",
    certificateur: "Ministère du Travail",
    date_enregistrement: "2024-01-01",
    objectifs: [
      "Accueillir et accompagner les publics sur les usages numériques",
      "Concevoir et animer des ateliers d'inclusion numérique",
      "Piloter un espace de médiation et des partenariats",
    ],
    prerequis: "Appétence pour l'accompagnement, bases en outils numériques",
    duree: "700 heures",
    modalites: "Présentiel / FOAD, ateliers pratiques, projets territoriaux",
    delais_acces: "Sous 30 jours après validation des prérequis et financement",
    tarifs:
      "Individuel : 10 500 € TTC — Groupe : 6 300 € TTC (par participant)",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees:
      "Ateliers, tutoriels, plateaux techniques, projets collectifs",
    modalites_evaluation:
      "Projets, épreuves en situation, livrables, soutenance",
    accessibilite_psh: "Étude de faisabilité et aménagements si nécessaire",
    debouches: "Responsable EPN, médiateur numérique",
    passerelles: "Vers FPA / certifications spécifiques (PIX, etc.)",
    blocs_competences: ["BC01", "BC02", "BC03"],
    etat: "valide",
  },
];
