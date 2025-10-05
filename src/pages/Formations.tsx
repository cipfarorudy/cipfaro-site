import React from 'react';
import { Link } from 'react-router-dom';
// Note: Suppression des imports Card non utilisés suite à la refonte moderne
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useFormations, useFormationsFilter } from '../hooks/useFormations';
import type { Formation } from '../services/formationsService';

// Note: Désactiver temporairement l'import SEO qui pose des problèmes TypeScript
// import { useSEO, seoConfig } from '../utils/seo';

const FormationCard: React.FC<{ formation: Formation }> = ({ formation }) => {
  const getPriorityBadgeColor = (certifiante: boolean) => {
    return certifiante 
      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
  };

  const extractHours = (duree: string): number => {
    const match = duree.match(/(\d+)\s*heures?/i);
    return match ? parseInt(match[1], 10) : 0;
  };

  const formatPrice = (tarif?: string): string => {
    if (!tarif) return 'Sur devis';
    const match = tarif.match(/Individuel\s*:\s*([^\s—]+)/);
    return match ? match[1] : 'Sur devis';
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Badge de priorité flottant */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getPriorityBadgeColor(formation.certifiante)} transform rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
          {formation.certifiante ? '🏆 Certifiante' : '📚 Qualifiante'}
        </div>
      </div>

      {/* Badge RNCP si applicable */}
      {formation.rncp && (
        <div className="absolute top-4 left-4 z-10">
          <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200 shadow-sm">
            {formation.rncp}
          </div>
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* En-tête avec icône */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <span className="text-white text-xl">
              {formation.certifiante ? '🎓' : '📖'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-700 transition-colors duration-300">
              {formation.titre}
            </h3>
            {formation.code_officiel && (
              <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md">
                <span className="text-xs font-mono text-gray-600">Code: {formation.code_officiel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Informations clés avec icônes */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">⏱️</span>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Durée</div>
                <div className="text-sm font-semibold text-gray-800">{formation.duree}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 text-sm">💰</span>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">À partir de</div>
                <div className="text-sm font-semibold text-gray-800">{formatPrice(formation.tarifs)}</div>
              </div>
            </div>
          </div>

          {/* Barre de progression de durée */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Intensité de formation</span>
              <span>{extractHours(formation.duree)}h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 group-hover:from-emerald-500 group-hover:to-teal-600 ${
                  extractHours(formation.duree) <= 200 ? 'w-1/5' :
                  extractHours(formation.duree) <= 400 ? 'w-2/5' :
                  extractHours(formation.duree) <= 600 ? 'w-3/5' :
                  extractHours(formation.duree) <= 800 ? 'w-4/5' : 'w-full'
                }`}
              ></div>
            </div>
          </div>

          {/* Modalités avec design amélioré */}
          <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors duration-300">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">🎯</span>
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Modalités</div>
                <div className="text-sm text-gray-600 leading-relaxed">{formation.modalites}</div>
              </div>
            </div>
          </div>

          {/* Objectifs clés avec design moderne */}
          {formation.objectifs && formation.objectifs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-purple-500">🎯</span>
                <span className="text-sm font-semibold text-gray-700">Objectifs principaux</span>
              </div>
              <div className="space-y-2">
                {formation.objectifs.slice(0, 2).map((objectif, index) => (
                  <div key={index} className="flex items-start space-x-3 text-sm">
                    <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{objectif}</span>
                  </div>
                ))}
                {formation.objectifs.length > 2 && (
                  <div className="text-xs text-gray-500 italic pl-8">
                    +{formation.objectifs.length - 2} autres objectifs détaillés...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions avec design premium */}
        <div className="flex flex-col space-y-3">
          <Link
            to={`/formations/${formation.slug}`}
            className="group/btn relative w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold text-center hover:from-blue-700 hover:to-indigo-800 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 rounded-xl transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span>Découvrir la formation</span>
              <span className="text-lg group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </Link>
          
          <div className="flex space-x-2">
            <Link
              to={`/devis?slug=${formation.slug}`}
              className="flex-1 bg-emerald-50 text-emerald-700 border-2 border-emerald-200 py-2 px-4 rounded-lg text-sm font-medium text-center hover:bg-emerald-100 transition-colors duration-200"
            >
              📊 Devis
            </Link>
            <Link
              to="/contact"
              className="flex-1 bg-orange-50 text-orange-700 border-2 border-orange-200 py-2 px-4 rounded-lg text-sm font-medium text-center hover:bg-orange-100 transition-colors duration-200"
            >
              💬 Info
            </Link>
          </div>
        </div>

        {/* Tags de débouchés */}
        {formation.debouches && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-indigo-500 text-sm">🚀</span>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Débouchés</span>
            </div>
            <div className="text-xs text-gray-600 leading-relaxed line-clamp-2">
              {formation.debouches}
            </div>
          </div>
        )}
      </div>
    </div>
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
    <div className={`group relative ${bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden`}>
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></div>
      
      {/* Motifs décoratifs */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full transform -translate-x-4 translate-y-4"></div>
      
      <div className="relative z-10 p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-5xl">{icon}</span>
        </div>
        
        <h3 className={`text-2xl font-bold mb-4 ${textColor} group-hover:scale-105 transition-transform duration-300`}>
          {title}
        </h3>
        
        <p className={`mb-6 ${textColor} opacity-90 leading-relaxed text-lg`}>
          {description}
        </p>
        
        <a
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center px-8 py-4 ${buttonColor} rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/btn relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
          <span className="relative flex items-center space-x-2">
            <span>{buttonText}</span>
            <span className="text-xl group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </a>
        
        {/* Indicateur de confiance */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="flex space-x-1">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="text-yellow-300 text-sm">⭐</span>
            ))}
          </div>
          <span className={`text-sm ${textColor} opacity-80`}>
            Service recommandé
          </span>
        </div>
      </div>
    </div>
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
      {/* Hero Section - Design Premium */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 overflow-hidden">
        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-blue-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-300/15 rounded-full blur-xl animate-bounce"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge d'introduction */}
            <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-8 shadow-lg">
              <span className="text-yellow-400 mr-2">🏆</span>
              <span className="text-sm font-semibold">Organisme certifié Qualiopi</span>
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Nos Formations
            </h1>
            <p className="text-2xl text-blue-100 leading-relaxed mb-8 max-w-4xl mx-auto">
              Développez vos compétences avec nos <span className="font-semibold text-white">formations certifiantes et qualifiantes</span>, 
              adaptées aux besoins du marché du travail en Guadeloupe et finançables.
            </p>

            {/* Statistiques visuelles */}
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{formationsCertifiantes.length}</div>
                <div className="text-emerald-100 font-semibold mb-1">Formations Certifiantes</div>
                <div className="text-blue-200 text-sm">Reconnues par l'État</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-400 mb-2">{formationsQualifiantes.length}</div>
                <div className="text-blue-100 font-semibold mb-1">Formations Qualifiantes</div>
                <div className="text-blue-200 text-sm">Compétences spécialisées</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-yellow-100 font-semibold mb-1">Financement Possible</div>
                <div className="text-blue-200 text-sm">CPF, Pôle Emploi, OPCO</div>
              </div>
            </div>

            {/* Features badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-green-400">🎯</span>
                <span className="text-white font-medium">Accompagnement personnalisé</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-blue-400">💻</span>
                <span className="text-white font-medium">Présentiel & Distanciel</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-purple-400">📊</span>
                <span className="text-white font-medium">Suivi post-formation</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-yellow-400">🏅</span>
                <span className="text-white font-medium">Taux de réussite élevé</span>
              </div>
            </div>
            
            <p className="text-blue-200 italic mt-6 text-lg">
              Plus de 500 stagiaires formés • Organisme de formation agréé depuis 2020
            </p>
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
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-sm mb-6 shadow-sm">
                  <span className="mr-2">🏆</span>
                  Formations Certifiantes RNCP
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Certifications Reconnues par l'État
                </h2>
                <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                  Obtenez une <span className="font-semibold text-emerald-600">certification officielle</span> reconnue 
                  par l'État et les professionnels pour booster votre carrière
                </p>
                
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {formationsCertifiantes.map((formation: Formation) => (
                  <FormationCard key={formation.slug} formation={formation} />
                ))}
              </div>

              {/* Section avantages certifications */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-white text-xl">🎯</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Reconnaissance Officielle</h4>
                    <p className="text-gray-600 text-sm">Titres enregistrés au RNCP, validés par France Compétences</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-white text-xl">🚀</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Employabilité Renforcée</h4>
                    <p className="text-gray-600 text-sm">Compétences recherchées par les employeurs</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-white text-xl">💰</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Financement CPF</h4>
                    <p className="text-gray-600 text-sm">Éligible au Compte Personnel de Formation</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formations Qualifiantes */}
          {formationsQualifiantes.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm mb-6 shadow-sm">
                  <span className="mr-2">📚</span>
                  Formations Qualifiantes Spécialisées
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Compétences Spécialisées
                </h2>
                <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                  Développez des <span className="font-semibold text-blue-600">compétences pointues</span> pour 
                  votre évolution professionnelle et expertise sectorielle
                </p>
                
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {formationsQualifiantes.map((formation: Formation) => (
                  <FormationCard key={formation.slug} formation={formation} />
                ))}
              </div>

              {/* Section avantages formations qualifiantes */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-white text-xl">⚡</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Formation Rapide</h4>
                    <p className="text-gray-600 text-sm">Acquisition rapide de compétences opérationnelles</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-white text-xl">🎯</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Ciblé Métier</h4>
                    <p className="text-gray-600 text-sm">Formations adaptées aux besoins spécifiques</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-white text-xl">📈</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Montée en Compétences</h4>
                    <p className="text-gray-600 text-sm">Perfectionnement et spécialisation</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Premium */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-20 overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Badge d'introduction */}
            <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-8">
              <span className="text-yellow-400 mr-2">💡</span>
              <span className="text-white font-semibold text-sm">Accompagnement Personnalisé</span>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              Besoin de conseils pour choisir votre formation ?
            </h2>
            
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Notre équipe d'experts vous accompagne dans votre projet de formation. 
              <span className="font-semibold text-white"> Entretien personnalisé et gratuit</span> pour définir 
              ensemble le parcours le plus adapté à vos objectifs professionnels.
            </p>

            {/* Avantages en grille */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="text-white font-bold mb-2">Conseil Expert</h4>
                <p className="text-blue-200 text-sm">Analyse de votre profil et objectifs</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">💰</div>
                <h4 className="text-white font-bold mb-2">Financement</h4>
                <p className="text-blue-200 text-sm">Solutions de prise en charge adaptées</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">📅</div>
                <h4 className="text-white font-bold mb-2">Planning Flexible</h4>
                <p className="text-blue-200 text-sm">Dates et modalités sur mesure</p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-10 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transform transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/25"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-2xl">📞</span>
                  <span>Nous contacter</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </Link>
              
              <Link
                to="/devis"
                className="group relative bg-white/10 text-white border-2 border-white/30 py-4 px-10 rounded-2xl font-bold text-lg hover:bg-white/20 transform transition-all duration-300 hover:scale-105 shadow-xl backdrop-blur-sm"
              >
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <span>Demander un devis</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </Link>
            </div>
            
            {/* Témoignage ou garantie */}
            <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <span className="text-white font-semibold">4.9/5 - Satisfaction stagiaires</span>
              </div>
              <p className="text-blue-100 italic">
                "Un accompagnement de qualité du premier contact jusqu'à l'insertion professionnelle"
              </p>
              <div className="text-blue-200 text-sm mt-2">Plus de 500 stagiaires accompagnés</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}