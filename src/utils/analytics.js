// Composant Google Analytics 4
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// À remplacer par votre vrai ID Google Analytics
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Charger Google Analytics seulement si l'ID est configuré
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
      // Charger le script GA4
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialiser GA4
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });

      // Assigner gtag à window pour usage global
      window.gtag = gtag;
    }
  }, []);

  useEffect(() => {
    // Tracker les changements de page
    if (window.gtag && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

// Fonctions de tracking d'événements
export const trackEvent = (eventName, parameters = {}) => {
  if (window.gtag && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    window.gtag("event", eventName, {
      event_category: parameters.category || "engagement",
      event_label: parameters.label,
      value: parameters.value,
      ...parameters,
    });
  }
};

// Événements prédéfinis pour CIP FARO
export const trackFormationView = (formationSlug, formationTitre) => {
  trackEvent("view_formation", {
    category: "formation",
    label: formationSlug,
    formation_titre: formationTitre,
  });
};

export const trackInscription = (formationType, formationSlug) => {
  trackEvent("inscription_submitted", {
    category: "conversion",
    label: formationType,
    formation_slug: formationSlug,
  });
};

export const trackRecrutementSubmit = (profileType) => {
  trackEvent("recrutement_submitted", {
    category: "conversion",
    label: profileType, // 'entreprise' ou 'candidat'
    value: profileType === "entreprise" ? 100 : 50,
  });
};

export const trackDevisRequest = () => {
  trackEvent("devis_requested", {
    category: "lead",
    value: 75,
  });
};

export const trackMoodleAccess = () => {
  trackEvent("moodle_access", {
    category: "engagement",
    label: "cours_acces",
  });
};

export const trackAuthLogin = (userType) => {
  trackEvent("login", {
    category: "user",
    label: userType, // 'admin', 'formateur', 'stagiaire'
  });
};
