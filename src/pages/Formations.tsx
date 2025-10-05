import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useFormations, useFormationsFilter } from '../hooks/useFormations';
import type { Formation } from '../services/formationsService';

// Note: Désactiver temporairement l'import SEO qui pose des problèmes TypeScript
// import { useSEO, seoConfig } from '../utils/seo';

const FormationCard: React.FC<{ formation: Formation }> = ({ formation }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-2 mb-2">
          <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
            {formation.titre}
          </CardTitle>
          <div className="flex flex-col gap-1">
            {formation.certifiante && (
              <Badge variant="success" className="text-xs">
                Certifiante
              </Badge>
            )}
            {formation.rncp && (
              <Badge variant="outline" className="text-xs">
                RNCP
              </Badge>
            )}
          </div>
        </div>
        
        {formation.code_officiel && (
          <CardDescription className="text-sm text-gray-500 font-mono">
            Code: {formation.code_officiel}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Durée</h4>
            <p className="text-sm text-gray-600">{formation.duree}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Modalités</h4>
            <p className="text-sm text-gray-600">{formation.modalites}</p>
          </div>

          {formation.objectifs && formation.objectifs.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Objectifs clés</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {formation.objectifs.slice(0, 2).map((objectif, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>{objectif}</span>
                  </li>
                ))}
                {formation.objectifs.length > 2 && (
                  <li className="text-gray-400 text-xs italic">
                    +{formation.objectifs.length - 2} objectifs supplémentaires...
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/formations/${formation.slug}`}>
            Consulter la formation
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const QuickAccessCard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  icon: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
}> = ({ title, description, buttonText, buttonUrl, icon, bgColor, textColor, buttonColor }) => {
  return (
    <Card className={`${bgColor} border-0 shadow-md`}>
      <CardContent className="p-6 text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{title}</h3>
        <p className={`mb-4 ${textColor} opacity-90`}>{description}</p>
        <Button 
          asChild 
          className={`${buttonColor} hover:opacity-90 transition-opacity`}
        >
          <a href={buttonUrl} target="_blank" rel="noopener noreferrer">
            {buttonText}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default function Formations() {
  // TODO: Réactiver SEO une fois le module créé
  // useSEO(seoConfig.formations);

  // Utilisation des hooks API
  const { formations, loading, error } = useFormations();
  const { filteredFormations, filterByEtat } = useFormationsFilter(formations);

  // Filtre initial pour les formations actives
  React.useEffect(() => {
    filterByEtat('active');
  }, [formations, filterByEtat]);

  const formationsActives = filteredFormations;
  const formationsCertifiantes = formationsActives.filter((f: Formation) => f.certifiante);
  const formationsQualifiantes = formationsActives.filter((f: Formation) => !f.certifiante);

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Chargement des formations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des formations</p>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Nos Formations</h1>
            <p className="text-xl opacity-90 mb-6">
              Développez vos compétences avec nos formations certifiantes et qualifiantes, 
              adaptées aux besoins du marché du travail en Guadeloupe.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
                <span>{formationsCertifiantes.length} formations certifiantes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-200 rounded-full"></span>
                <span>{formationsQualifiantes.length} formations qualifiantes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-100 rounded-full"></span>
                <span>Financement possible</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-8 -mt-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <QuickAccessCard
              title="Déjà inscrit ?"
              description="Accédez directement à votre plateforme e-learning Moodle pour suivre vos cours"
              buttonText="Accéder à vos cours"
              buttonUrl="https://cipfaro.org"
              icon="🎓"
              bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
              textColor="text-white"
              buttonColor="bg-white text-orange-600 hover:bg-gray-50"
            />
            
            <QuickAccessCard
              title="Formations financées"
              description="Découvrez nos formations disponibles sur France Travail avec financement possible"
              buttonText="Voir sur France Travail"
              buttonUrl="https://candidat.francetravail.fr/formations/recherche?filtreEstFormationEnCoursOuAVenir=formEnCours&filtreEstFormationTerminee=formEnCours&ou=COMMUNE-97101&quoi=cip+faro&range=0-9&tri=0"
              icon="🔍"
              bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
              textColor="text-white"
              buttonColor="bg-white text-blue-600 hover:bg-gray-50"
            />
          </div>
        </div>
      </section>

      {/* Formations Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Formations Certifiantes */}
          {formationsCertifiantes.length > 0 && (
            <div className="mb-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Formations Certifiantes
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  Obtenez une certification reconnue par l'État et les professionnels
                </p>
                <div className="w-24 h-1 bg-primary-600 rounded"></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {formationsCertifiantes.map((formation: Formation) => (
                  <FormationCard key={formation.slug} formation={formation} />
                ))}
              </div>
            </div>
          )}

          {/* Formations Qualifiantes */}
          {formationsQualifiantes.length > 0 && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Formations Qualifiantes
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  Développez des compétences spécifiques pour votre évolution professionnelle
                </p>
                <div className="w-24 h-1 bg-accent-500 rounded"></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formationsQualifiantes.map((formation: Formation) => (
                  <FormationCard key={formation.slug} formation={formation} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Besoin de conseils pour choisir votre formation ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous accompagner dans votre projet de formation. 
            Contactez-nous pour un entretien personnalisé et gratuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">Nous contacter</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/devis">Demander un devis</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}