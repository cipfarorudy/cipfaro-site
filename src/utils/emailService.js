// Système de notifications email pour CIP FARO
// Utilise EmailJS pour l'envoi d'emails côté client

import emailjs from "@emailjs/browser";

// Configuration EmailJS (À personnaliser avec vos vraies clés)
const EMAIL_CONFIG = {
  serviceId: "service_cipfaro", // Remplacer par votre Service ID
  templateId: {
    candidatureRecue: "template_candidature",
    offreRecue: "template_offre",
    matching: "template_matching",
    inscription: "template_inscription",
    devis: "template_devis",
  },
  publicKey: "your_public_key_here", // Remplacer par votre Public Key
};

// Initialiser EmailJS
export function initEmailService() {
  if (EMAIL_CONFIG.publicKey !== "your_public_key_here") {
    emailjs.init(EMAIL_CONFIG.publicKey);
    console.log("📧 Service email initialisé");
  } else {
    console.warn("⚠️ Service email non configuré - clés manquantes");
  }
}

// Templates d'emails prédéfinis

export const emailTemplates = {
  candidatureRecue: {
    subject: "✅ Votre candidature CIP FARO a été reçue",
    template: (data) => `
Bonjour ${data.prenom} ${data.nom},

Nous avons bien reçu votre candidature pour ${data.formation || "un poste"} !

📋 **Récapitulatif :**
- Formation : ${data.formation}
- Email : ${data.email}
- Téléphone : ${data.telephone}
- Disponibilité : ${data.disponibilite}

🎯 **Prochaines étapes :**
1. Analyse de votre profil (24-48h)
2. Mise en relation avec les entreprises correspondantes
3. Contact direct des entreprises intéressées

📞 **Contact :** Si vous avez des questions, n'hésitez pas à nous contacter au 0690570846.

Cordialement,
L'équipe CIP FARO
secretariat@cipfaro-formations.com
    `,
  },

  offreRecue: {
    subject: "🏢 Votre offre d'emploi CIP FARO a été publiée",
    template: (data) => `
Bonjour ${data.prenom} ${data.nom},

Votre offre d'emploi a été publiée avec succès sur notre plateforme !

💼 **Détails de l'offre :**
- Entreprise : ${data.nomEntreprise}
- Poste : ${data.postePropose}
- Type de contrat : ${data.typeContrat}
- Localisation : ${data.localisationPoste}
- Formations ciblées : ${data.formationsCiblees?.join(", ") || "Non spécifiées"}

🎯 **Matching automatique :**
Nous analysons déjà notre base de candidats pour vous proposer les profils les plus pertinents.

📊 **Statistiques moyennes CIP FARO :**
- Délai moyen de proposition : 48h
- Taux de matching : 85%
- Satisfaction entreprises : 4.8/5

Vous recevrez un email dès qu'un candidat correspondant sera identifié.

Cordialement,
L'équipe CIP FARO
secretariat@cipfaro-formations.com
    `,
  },

  matchingDetecte: {
    subject: "🎯 Nouveau candidat correspondant à votre offre !",
    template: (data) => `
Bonjour ${data.entrepriseContact},

Excellente nouvelle ! Un candidat formé par CIP FARO correspond à votre recherche.

👤 **Profil candidat :**
- Formation suivie : ${data.candidatFormation}
- Expérience : ${data.candidatExperience}
- Disponibilité : ${data.candidatDisponibilite}
- Score de correspondance : ${data.matchScore}%

💼 **Votre recherche :**
- Poste : ${data.posteRecherche}
- Entreprise : ${data.entreprise}

🤝 **Pour prendre contact :**
Email du candidat : ${data.candidatEmail}
Téléphone : ${data.candidatTelephone}

📎 **CV disponible** : Le CV sera transmis après accord mutuel.

✨ **Pourquoi ce matching ?**
${data.raisonMatching || "Formation parfaitement alignée avec vos besoins"}

Cordialement,
L'équipe CIP FARO
secretariat@cipfaro-formations.com
    `,
  },

  inscriptionConfirmee: {
    subject: "📚 Inscription confirmée - Formation CIP FARO",
    template: (data) => `
Bonjour ${data.prenom} ${data.nom},

Votre préinscription à la formation "${data.formation}" est confirmée !

📅 **Informations formation :**
- Formation : ${data.formation}
- Durée : ${data.duree}
- Modalités : ${data.modalites}
- Début prévu : ${data.dateDebut || "À définir selon planning"}

💰 **Financement :**
${
  data.financement ||
  "Nous vous accompagnons dans les démarches de financement (CPF, Pôle Emploi, etc.)"
}

📋 **Prochaines étapes :**
1. Validation des prérequis et du financement
2. Convocation pour entretien de motivation (si nécessaire)
3. Confirmation des dates de formation
4. Envoi du dossier d'inscription complet

🎓 **Accès Moodle :** Vos identifiants de connexion vous seront communiqués 48h avant le début de la formation.

Nous vous recontacterons sous 48h pour finaliser votre dossier.

Cordialement,
L'équipe CIP FARO
secretariat@cipfaro-formations.com
    `,
  },
};

// Fonctions d'envoi d'emails

export async function envoyerEmailCandidature(candidatData) {
  if (EMAIL_CONFIG.publicKey === "your_public_key_here") {
    console.log("📧 Simulation envoi email candidature:", candidatData);
    return { success: true, message: "Email simulé (configuration manquante)" };
  }

  try {
    const templateParams = {
      to_email: candidatData.email,
      to_name: `${candidatData.prenom} ${candidatData.nom}`,
      from_name: "CIP FARO",
      message: emailTemplates.candidatureRecue.template(candidatData),
      subject: emailTemplates.candidatureRecue.subject,
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId.candidatureRecue,
      templateParams
    );

    console.log("📧 Email candidature envoyé:", response);
    return { success: true, messageId: response.text };
  } catch (error) {
    console.error("❌ Erreur envoi email candidature:", error);
    return { success: false, error: error.message };
  }
}

export async function envoyerEmailOffre(entrepriseData) {
  if (EMAIL_CONFIG.publicKey === "your_public_key_here") {
    console.log("📧 Simulation envoi email offre:", entrepriseData);
    return { success: true, message: "Email simulé (configuration manquante)" };
  }

  try {
    const templateParams = {
      to_email: entrepriseData.email,
      to_name: `${entrepriseData.prenom} ${entrepriseData.nom}`,
      from_name: "CIP FARO",
      message: emailTemplates.offreRecue.template(entrepriseData),
      subject: emailTemplates.offreRecue.subject,
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId.offreRecue,
      templateParams
    );

    console.log("📧 Email offre envoyé:", response);
    return { success: true, messageId: response.text };
  } catch (error) {
    console.error("❌ Erreur envoi email offre:", error);
    return { success: false, error: error.message };
  }
}

export async function envoyerEmailMatching(matchingData) {
  if (EMAIL_CONFIG.publicKey === "your_public_key_here") {
    console.log("📧 Simulation envoi email matching:", matchingData);
    return { success: true, message: "Email simulé (configuration manquante)" };
  }

  try {
    const templateParams = {
      to_email: matchingData.entrepriseEmail,
      to_name: matchingData.entrepriseContact,
      from_name: "CIP FARO",
      message: emailTemplates.matchingDetecte.template(matchingData),
      subject: emailTemplates.matchingDetecte.subject,
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId.matching,
      templateParams
    );

    console.log("📧 Email matching envoyé:", response);
    return { success: true, messageId: response.text };
  } catch (error) {
    console.error("❌ Erreur envoi email matching:", error);
    return { success: false, error: error.message };
  }
}

export async function envoyerEmailInscription(inscriptionData) {
  if (EMAIL_CONFIG.publicKey === "your_public_key_here") {
    console.log("📧 Simulation envoi email inscription:", inscriptionData);
    return { success: true, message: "Email simulé (configuration manquante)" };
  }

  try {
    const templateParams = {
      to_email: inscriptionData.email,
      to_name: `${inscriptionData.prenom} ${inscriptionData.nom}`,
      from_name: "CIP FARO",
      message: emailTemplates.inscriptionConfirmee.template(inscriptionData),
      subject: emailTemplates.inscriptionConfirmee.subject,
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId.inscription,
      templateParams
    );

    console.log("📧 Email inscription envoyé:", response);
    return { success: true, messageId: response.text };
  } catch (error) {
    console.error("❌ Erreur envoi email inscription:", error);
    return { success: false, error: error.message };
  }
}

// Fonction de test pour vérifier la configuration
export function testerConfigurationEmail() {
  const isConfigured = EMAIL_CONFIG.publicKey !== "your_public_key_here";

  if (isConfigured) {
    console.log("✅ Configuration email OK");
  } else {
    console.log(`
⚠️ Configuration email manquante !

Pour activer les notifications email :

1. Créer un compte sur https://emailjs.com
2. Configurer un service (Gmail, Outlook, etc.)
3. Créer des templates d'email
4. Remplacer les valeurs dans EMAIL_CONFIG :
   - serviceId: votre Service ID
   - templateId: vos Template IDs  
   - publicKey: votre Public Key

📧 En attendant, les emails seront simulés dans la console.
    `);
  }

  return isConfigured;
}

// Auto-test au chargement
testerConfigurationEmail();
