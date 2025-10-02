// src/data/formations.js
export const formations = [
  // 1) TP Conseiller en Insertion Professionnelle (CIP)
  {
    slug: "tp-conseiller-insertion-professionnelle",
    titre: "Titre professionnel Conseiller en Insertion Professionnelle (CIP)",
    certifiante: true,
    rncp: "RNCP37274 (à vérifier)",
    certificateur: "Ministère du Travail (à vérifier)",
    date_enregistrement: "2024-01-01 (à préciser)",
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
    // tarifs corrigés : base 8 €/h individuel, 7 €/h groupe
    // 840h × 8€/h = 6 720€ -> prix final ajusté pour demandeur d'emploi : 5550€
    // 840h × 7€/h = 5 880€ -> prix groupe ajusté : 4750€
    tarifs:
      "Individuel : 5 550 € TTC (tarif demandeur d'emploi) — Groupe : 4 750 € TTC (par participant)",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees:
      "Apports théoriques, études de cas, jeux de rôle, plateformes numériques",
    modalites_evaluation:
      "Positionnement, évaluations formatives, ECF, épreuves finales",
    accessibilite_psh:
      "Locaux accessibles ; aménagements possibles. Référent handicap : referent.handicap@cipfaro-formations.com",
    debouches:
      "CIP en structure d'insertion, conseiller emploi, chargé d'accompagnement",
    passerelles: "Vers FPA / REMN (à documenter)",
    blocs_competences: ["BC01", "BC02", "BC03"],
    tarif_horaire_individuel: 8,
    tarif_horaire_groupe: 7,
    duree_heures: 840,
  },

  // 2) TP Formateur Professionnel d'Adultes (FPA)
  {
    slug: "tp-formateur-professionnel-adultes",
    titre: "Titre professionnel Formateur Professionnel d'Adultes (FPA)",
    certifiante: true,
    rncp: "RNCP37275 (à vérifier)",
    certificateur: "Ministère du Travail (à vérifier)",
    date_enregistrement: "2024-01-01 (à préciser)",
    objectifs: [
      "Concevoir, préparer et animer des actions de formation",
      "Individualiser les parcours et accompagner les apprenants",
      "Évaluer les acquis et certifier les compétences",
    ],
    prerequis: "Niveau 4 conseillé, expérience ou projet pédagogique souhaité",
    duree: "910 heures",
    modalites: "Présentiel / FOAD, ateliers, co-animation, classe virtuelle",
    delais_acces: "Sous 30 jours après validation des prérequis et financement",
    // 910h × 15€/h = 13 650€ | 910h × 9€/h = 8 190€
    tarifs:
      "Individuel : 13 650 € TTC — Groupe : 8 190 € TTC (par participant) — base 15 €/h / 9 €/h",
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
    tarif_horaire_individuel: 15,
    tarif_horaire_groupe: 9,
    duree_heures: 910,
  },

  // 3) TP Responsable d'Espace de Médiation Numérique (REMN)
  {
    slug: "tp-responsable-espace-mediation-numerique",
    titre:
      "Titre professionnel Responsable d'Espace de Médiation Numérique (REMN)",
    certifiante: true,
    rncp: "RNCP37893 (à vérifier)",
    certificateur: "Ministère du Travail (à vérifier)",
    date_enregistrement: "2024-01-01 (à préciser)",
    objectifs: [
      "Accueillir et accompagner les publics sur les usages numériques",
      "Concevoir et animer des ateliers d'inclusion numérique",
      "Piloter un espace de médiation et des partenariats",
    ],
    prerequis: "Appétence pour l'accompagnement, bases en outils numériques",
    duree: "700 heures",
    modalites: "Présentiel / FOAD, ateliers pratiques, projets territoriaux",
    delais_acces: "Sous 30 jours après validation des prérequis et financement",
    // 700h × 15€/h = 10 500€ | 700h × 9€/h = 6 300€
    tarifs:
      "Individuel : 10 500 € TTC — Groupe : 6 300 € TTC (par participant) — base 15 €/h / 9 €/h",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees:
      "Ateliers, tutoriels, plateaux techniques, projets collectifs",
    modalites_evaluation:
      "Projets, épreuves en situation, livrables, soutenance",
    accessibilite_psh: "Étude de faisabilité et aménagements si nécessaire",
    debouches: "Responsable EPN, médiateur numérique",
    passerelles: "Vers FPA / certifications spécifiques (PIX, etc.)",
    blocs_competences: ["BC01", "BC02", "BC03"],
    tarif_horaire_individuel: 15,
    tarif_horaire_groupe: 9,
    duree_heures: 700,
  },

  // 4) Excel — Perfectionnement pour créateurs d'entreprise
  {
    slug: "excel-perfectionnement-gestion-entreprise",
    titre: "Excel — Perfectionnement pour créateurs d'entreprise",
    certifiante: false,
    rncp: null,
    certificateur: null,
    date_enregistrement: null,
    objectifs: [
      "Construire un budget prévisionnel et un tableau de bord",
      "Maîtriser les fonctions (SI, RECHERCHEX, SOMME.SI.ENS, TCD)",
      "Automatiser (MFC, bases de macros)",
    ],
    prerequis: "Bases d'Excel (saisie, formules simples, formats)",
    duree: "21 heures (3 jours)",
    modalites: "Présentiel / classe virtuelle, exercices guidés, cas concrets",
    delais_acces: "Sous 15 jours selon planning",
    // 21h × 15€/h = 315€ | 21h × 9€/h = 189€
    tarifs:
      "Individuel : 315 € TTC — Groupe : 189 € TTC (par participant) — base 15 €/h / 9 €/h",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees: "Ateliers, fichiers modèles, études de cas",
    modalites_evaluation: "Quiz, exercices notés, remise d'un fichier final",
    accessibilite_psh: "Supports adaptés possibles, aménagements sur demande",
    debouches: "Montée en compétences en gestion et pilotage",
    passerelles: "Vers Word, PowerPoint, Power BI",
    blocs_competences: [],
    tarif_horaire_individuel: 15,
    tarif_horaire_groupe: 9,
    duree_heures: 21,
  },

  // 5) Word — Bureautique administrative
  {
    slug: "word-bureautique-administrative",
    titre: "Word — Bureautique administrative",
    certifiante: false,
    rncp: null,
    certificateur: null,
    date_enregistrement: null,
    objectifs: [
      "Mettre en forme des documents (styles, sommaires)",
      "Créer des modèles & publipostages",
      "Gérer tableaux, images, sections, en-têtes/pieds",
    ],
    prerequis: "Connaissances de base en environnement Windows",
    duree: "21 heures (3 jours)",
    modalites: "Présentiel / classe virtuelle, travaux guidés",
    delais_acces: "Sous 15 jours selon planning",
    // 21h × 15€/h = 315€ | 21h × 9€/h = 189€
    tarifs:
      "Individuel : 315 € TTC — Groupe : 189 € TTC (par participant) — base 15 €/h / 9 €/h",
    contacts: "secretariat@cipfaro-formations.com",
    methodes_mobilisees:
      "Exemples concrets, fiches pas-à-pas, gabarits fournis",
    modalites_evaluation: "Exercices pratiques et QCM final",
    accessibilite_psh: "Polices adaptées, temps majoré possible",
    debouches: "Compétences secrétariat / gestion documentaire",
    passerelles: "Vers Excel, Outlook, PowerPoint",
    blocs_competences: [],
    tarif_horaire_individuel: 15,
    tarif_horaire_groupe: 9,
    duree_heures: 21,
  },
];
