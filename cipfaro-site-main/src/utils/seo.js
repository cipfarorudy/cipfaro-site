import { useEffect } from "react";

// Hook pour gérer le SEO dynamique de chaque page
export function useSEO({
  title,
  description,
  keywords = "",
  ogImage = "/assets/logo-cipfaro.png",
  structuredData = null,
}) {
  useEffect(() => {
    // Mettre à jour le titre
    const fullTitle = title
      ? `${title} | CIP FARO`
      : "CIP FARO | Formation Professionnelle Guadeloupe";
    document.title = fullTitle;

    // Mettre à jour la meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Mettre à jour les keywords si fournis
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // Mettre à jour les Open Graph tags
    const updateOGTag = (property, content) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute("content", content);
      }
    };

    updateOGTag("og:title", fullTitle);
    updateOGTag("og:description", description);
    updateOGTag("og:image", `https://cipfaro-formations.com${ogImage}`);
    updateOGTag("og:url", window.location.href);

    // Mettre à jour Twitter Card
    const updateTwitterTag = (name, content) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (twitterTag) {
        twitterTag.setAttribute("content", content);
      }
    };

    updateTwitterTag("twitter:title", fullTitle);
    updateTwitterTag("twitter:description", description);
    updateTwitterTag(
      "twitter:image",
      `https://cipfaro-formations.com${ogImage}`
    );

    // Ajouter structured data si fournie
    if (structuredData) {
      // Supprimer l'ancien script structured data s'il existe
      const existingScript = document.querySelector(
        'script[type="application/ld+json"].page-structured-data'
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Ajouter le nouveau script
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.className = "page-structured-data";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Nettoyage au démontage du composant
    return () => {
      // Nettoyer les structured data de la page
      const pageStructuredData = document.querySelector(
        'script[type="application/ld+json"].page-structured-data'
      );
      if (pageStructuredData) {
        pageStructuredData.remove();
      }
    };
  }, [title, description, keywords, ogImage, structuredData]);
}

// Générateurs de structured data prédéfinis pour CIP FARO

export function generateCourseStructuredData(formation) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: formation.titre,
    description: formation.objectifs?.join(". ") || formation.description || "",
    provider: {
      "@type": "EducationalOrganization",
      name: "CIP FARO",
      url: "https://cipfaro-formations.com",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: formation.modalites || "Présentiel / Distanciel",
      duration: formation.duree || "",
      inLanguage: "fr",
      location: {
        "@type": "Place",
        name: "CIP FARO",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Chemin Coulée Zebsi",
          addressLocality: "Les Abymes",
          postalCode: "97139",
          addressCountry: "GP",
        },
      },
    },
    offers: {
      "@type": "Offer",
      category: "Formation professionnelle",
      priceCurrency: "EUR",
      price: formation.tarifs || "",
      availability: "https://schema.org/InStock",
    },
  };
}

export function generateJobPostingStructuredData(jobData) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: jobData.title,
    description: jobData.description,
    hiringOrganization: {
      "@type": "Organization",
      name: jobData.company,
      sameAs: jobData.companyUrl || "",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: jobData.location || "Guadeloupe",
        addressCountry: "GP",
      },
    },
    employmentType: jobData.contractType || "FULL_TIME",
    datePosted: new Date().toISOString(),
    validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 jours
    baseSalary: jobData.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "EUR",
          value: jobData.salary,
        }
      : undefined,
  };
}

export function generateBreadcrumbStructuredData(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: `https://cipfaro-formations.com${breadcrumb.url}`,
    })),
  };
}

// Configurations SEO prédéfinies pour les pages courantes

export const seoConfig = {
  home: {
    title: "Formation Professionnelle Guadeloupe | Insertion Emploi",
    description:
      "🎓 CIP FARO : Centre de formation insertion professionnelle Guadeloupe. 20 formations certifiantes CPF. Taux emploi 85%. Mise en relation entreprises-candidats.",
    keywords:
      "formation professionnelle Guadeloupe, CIP, insertion professionnelle, CPF, emploi Guadeloupe, reconversion",
  },
  formations: {
    title: "Formations Certifiantes CPF | 20 Cursus Disponibles",
    description:
      "🎯 Découvrez nos 20 formations certifiantes : CIP, FPA, médiation numérique, entrepreneuriat, IA. Financement CPF. Taux de réussite 95%.",
    keywords:
      "formations certifiantes, CPF, CIP, FPA, médiation numérique, entrepreneuriat, IA, Guadeloupe",
  },
  recrutement: {
    title: "Mise en Relation Emploi | Entreprises & Candidats CIP FARO",
    description:
      "🤝 Plateforme de mise en relation : entreprises trouvez vos talents, candidats CIP FARO accédez aux offres. Matching intelligent. Taux placement 85%.",
    keywords:
      "emploi Guadeloupe, recrutement, mise en relation, offres emploi, candidats formés, insertion professionnelle",
  },
  financements: {
    title: "Financement Formation | CPF, France Travail, Pôle Emploi",
    description:
      "💰 Tous les financements pour vos formations CIP FARO : CPF, France Travail, Pôle Emploi. Aide à la constitution de dossier. Prise en charge complète.",
    keywords:
      "financement formation, CPF, Mon Compte Formation, France Travail, Pôle Emploi, aide formation Guadeloupe",
  },
  contact: {
    title: "Contact CIP FARO | 0690570846 | Les Abymes, Guadeloupe",
    description:
      "📞 Contactez CIP FARO Guadeloupe : formations, inscriptions, devis. Tel: 0690570846. Chemin Coulée Zebsi, Les Abymes. Référent handicap disponible.",
    keywords:
      "contact CIP FARO, téléphone formation Guadeloupe, Les Abymes, adresse centre formation",
  },
};
