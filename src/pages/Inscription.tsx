import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formations } from '../data/formations';
import cipFaroLogo from '../assets/logo-cipfaro.webp';

interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  poste: string;
  formationSlug: string;
  source: string;
  message: string;
}

export default function Inscription() {
  const [searchParams] = useSearchParams();
  const slugParam = searchParams.get('slug') || '';

  const [formData, setFormData] = useState<InscriptionData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    poste: '',
    formationSlug: slugParam,
    source: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // États pour la nouvelle UX moderne
  const [fieldValidation, setFieldValidation] = useState<Record<string, { isValid: boolean; message: string; hasBeenTouched: boolean }>>({});
  const [focusedField, setFocusedField] = useState('');
  const [recentlyCompleted, setRecentlyCompleted] = useState<string[]>([]);

  const selectedFormation = formations.find((f) => f.slug === formData.formationSlug) || null;

  // Calcul de progression du formulaire
  const calculateProgress = () => {
    const requiredFields = [
      formData.nom,
      formData.prenom, 
      formData.email, 
      formData.telephone,
      formData.formationSlug
    ];
    
    const completedFields = requiredFields.filter(field => 
      field && field.toString().trim() !== ''
    ).length;
    
    const totalFields = requiredFields.length;
    const progress = (completedFields / totalFields) * 100;
    const timeRemaining = Math.max(0, Math.ceil((totalFields - completedFields) * 0.5));
    
    return { progress, timeRemaining, completedFields, totalFields };
  };

  const { progress, timeRemaining, completedFields, totalFields } = calculateProgress();

  // Fonctions de validation temps réel
  const validateField = (fieldName: string, value: string) => {
    let isValid = true;
    let message = '';

    switch (fieldName) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === '';
        message = isValid ? '' : 'Format email invalide';
        break;
      case 'telephone':
        isValid = /^[0-9\s+()-]{10,}$/.test(value) || value === '';
        message = isValid ? '' : 'Numéro de téléphone invalide';
        break;
      case 'nom':
      case 'prenom':
        isValid = value.length >= 2 || value === '';
        message = isValid ? '' : 'Minimum 2 caractères requis';
        break;
      default:
        isValid = true;
    }

    setFieldValidation(prev => ({
      ...prev,
      [fieldName]: { isValid, message, hasBeenTouched: value !== '' }
    }));

    return isValid;
  };

  // Gestionnaire pour les changements de champs avec validation
  const handleFieldChange = (fieldName: keyof InscriptionData, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    validateField(fieldName, value);
    
    if (value && value.trim() !== '' && validateField(fieldName, value)) {
      if (!recentlyCompleted.includes(fieldName)) {
        setRecentlyCompleted(prev => [...prev, fieldName]);
        setTimeout(() => {
          setRecentlyCompleted(prev => prev.filter(field => field !== fieldName));
        }, 3000);
      }
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleFieldBlur = () => {
    setFocusedField('');
  };

  // Composant pour l'indicateur de validation
  const ValidationIndicator: React.FC<{ fieldName: string; showSuccess?: boolean }> = ({ fieldName, showSuccess = true }) => {
    const validation = fieldValidation[fieldName];
    if (!validation || !validation.hasBeenTouched) return null;

    return (
      <div className="flex items-center space-x-1 mt-1" role="status" aria-live="polite">
        {validation.isValid && showSuccess ? (
          <div className="flex items-center space-x-1 text-green-600">
            <span className="text-sm" aria-hidden="true">✅</span>
            <span className="text-xs font-medium">Validé</span>
          </div>
        ) : !validation.isValid && validation.message ? (
          <div className="flex items-center space-x-1 text-red-600">
            <span className="text-sm" aria-hidden="true">⚠️</span>
            <span className="text-xs" role="alert">{validation.message}</span>
          </div>
        ) : null}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFormation) {
      alert('Veuillez sélectionner une formation');
      return;
    }

    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler l'envoi de l'inscription (à remplacer par l'API réelle)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Inscription enregistrée avec succès ! Nous vous contacterons bientôt.');
      // Réinitialiser le formulaire après succès
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        entreprise: '',
        poste: '',
        formationSlug: slugParam,
        source: '',
        message: '',
      });
      setFieldValidation({});
      setRecentlyCompleted([]);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Accessibility Announcements */}
      <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>

      {/* Hero Section Moderne */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-300/20 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
                <img src={cipFaroLogo} alt="CIP Faro" className="w-16 h-16 object-contain" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Inscription Formation
              </h1>
              <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl">
                Inscrivez-vous à nos formations certifiantes et développez vos compétences professionnelles. 
                <span className="font-semibold text-white"> Processus d'inscription simple</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-green-400">🏆</span>
                <span className="text-sm font-medium text-white">Certifié Qualiopi</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-emerald-400">📚</span>
                <span className="text-sm font-medium text-white">Formations certifiantes</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-teal-400">👥</span>
                <span className="text-sm font-medium text-white">Accompagnement personnalisé</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-cyan-400">⚡</span>
                <span className="text-sm font-medium text-white">Inscription rapide</span>
              </div>
            </div>
            
            <p className="text-sm text-emerald-200 italic">
              Plus de 1000 apprenants formés • Taux de satisfaction 98%
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg border border-emerald-100 p-6 mb-8 relative overflow-hidden" role="region" aria-labelledby="progress-title">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-50" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center" role="img" aria-label={`Progression: ${Math.round(progress)} pourcent`}>
                  <span className="text-emerald-600 text-sm font-bold">{Math.round(progress)}%</span>
                </div>
                <div>
                  <span id="progress-title" className="text-sm font-semibold text-gray-800">Progression de l'inscription</span>
                  <div className="text-xs text-gray-500" aria-live="polite">
                    {completedFields} sur {totalFields} informations complétées
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-emerald-600" aria-live="polite">
                  {progress >= 100 ? '✅ Prêt à valider !' : `${Math.round(progress)}% complété`}
                </div>
                <div className="text-xs text-gray-500" aria-live="polite">
                  {timeRemaining > 0 ? `~${timeRemaining} min restantes` : 'Inscription prête !'}
                </div>
              </div>
            </div>

            <div 
              className="w-full bg-gray-200 rounded-full h-4 shadow-inner relative overflow-hidden"
              role="progressbar"
              aria-label={`Progression de l'inscription: ${Math.round(progress)} pourcent complété`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse" />
              
              <div 
                className={`bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 h-4 rounded-full transition-all duration-700 ease-out relative shadow-sm progress-bar`}
                data-width={Math.round(Math.max(0, Math.min(100, progress)) / 10) * 10}
              >
                {progress > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 animate-pulse" />
                )}
              </div>
              
              <div className="absolute inset-0 flex justify-between items-center px-1">
                {[25, 50, 75].map(step => (
                  <div 
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      progress >= step ? 'bg-white shadow-sm' : 'bg-gray-400'
                    }`}
                    role="img"
                    aria-label={`Étape ${step}% ${progress >= step ? 'complétée' : 'en attente'}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                {progress < 33 && "👤 Renseignez vos informations personnelles"}
                {progress >= 33 && progress < 66 && "📚 Sélectionnez votre formation"}
                {progress >= 66 && progress < 100 && "📝 Complétez les détails de votre profil"}
                {progress >= 100 && "🎉 Votre inscription est prête à être validée !"}
              </p>
            </div>
          </div>
        </div>

        {/* Formation sélectionnée */}
        {selectedFormation && (
          <div className="bg-white rounded-lg shadow-sm border border-emerald-200 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedFormation.titre}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {selectedFormation.duree}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {selectedFormation.certifiante ? 'Certifiante' : 'Qualifiante'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Informations personnelles */}
          <fieldset className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 group" role="group" aria-labelledby="section-personal">
            <legend id="section-personal" className="text-lg font-semibold text-gray-900 px-6 py-2">Informations personnelles</legend>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b rounded-t-lg group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110" aria-hidden="true">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Renseignez vos coordonnées</p>
                    </div>
                    <div className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true">
                      📝
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Nom et Prénom */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleFieldChange('nom', e.target.value)}
                      onFocus={() => handleFieldFocus('nom')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'nom' 
                          ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-lg' 
                          : fieldValidation.nom?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.nom?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                      } ${recentlyCompleted.includes('nom') ? 'bg-green-50' : ''}`}
                      placeholder="Votre nom de famille"
                      required
                    />
                    {recentlyCompleted.includes('nom') && (
                      <div className="absolute right-2 top-2 text-green-500 animate-bounce">
                        ✨
                      </div>
                    )}
                  </div>
                  <ValidationIndicator fieldName="nom" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => handleFieldChange('prenom', e.target.value)}
                      onFocus={() => handleFieldFocus('prenom')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'prenom' 
                          ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-lg' 
                          : fieldValidation.prenom?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.prenom?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                      } ${recentlyCompleted.includes('prenom') ? 'bg-green-50' : ''}`}
                      placeholder="Votre prénom"
                      required
                    />
                    {recentlyCompleted.includes('prenom') && (
                      <div className="absolute right-2 top-2 text-green-500 animate-bounce">
                        ✨
                      </div>
                    )}
                  </div>
                  <ValidationIndicator fieldName="prenom" />
                </div>
              </div>

              {/* Email et Téléphone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onFocus={() => handleFieldFocus('email')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'email' 
                          ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-lg' 
                          : fieldValidation.email?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.email?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                      } ${recentlyCompleted.includes('email') ? 'bg-green-50' : ''}`}
                      placeholder="votre.email@exemple.com"
                      required
                    />
                    {recentlyCompleted.includes('email') && (
                      <div className="absolute right-2 top-2 text-green-500 animate-bounce">
                        ✨
                      </div>
                    )}
                  </div>
                  <ValidationIndicator fieldName="email" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => handleFieldChange('telephone', e.target.value)}
                      onFocus={() => handleFieldFocus('telephone')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'telephone' 
                          ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-lg' 
                          : fieldValidation.telephone?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.telephone?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                      } ${recentlyCompleted.includes('telephone') ? 'bg-green-50' : ''}`}
                      placeholder="06 12 34 56 78"
                      required
                    />
                    {recentlyCompleted.includes('telephone') && (
                      <div className="absolute right-2 top-2 text-green-500 animate-bounce">
                        ✨
                      </div>
                    )}
                  </div>
                  <ValidationIndicator fieldName="telephone" />
                </div>
              </div>

              {/* Formation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formation souhaitée <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.formationSlug}
                  onChange={(e) => handleFieldChange('formationSlug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  title="Sélectionner une formation"
                  required
                >
                  <option value="">— Choisir une formation —</option>
                  {formations.map((formation) => (
                    <option key={formation.slug} value={formation.slug}>
                      {formation.titre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entreprise et Poste (optionnel) */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.entreprise}
                    onChange={(e) => handleFieldChange('entreprise', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste actuel
                  </label>
                  <input
                    type="text"
                    value={formData.poste}
                    onChange={(e) => handleFieldChange('poste', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Votre fonction"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message ou questions
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Dites-nous en plus sur vos objectifs ou posez vos questions..."
                />
              </div>
            </div>
          </fieldset>

          {/* Actions de soumission */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg border p-8">
            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-800 font-medium">Validation de l'inscription</span>
                </div>
                <div className="text-emerald-700">
                  {progress >= 100 ? '✅ Inscription complète' : `${Math.round(progress)}% complété`}
                </div>
              </div>
              
              {progress < 100 && (
                <div className="mt-2 text-xs text-emerald-600">
                  ⚠️ Veuillez compléter toutes les informations obligatoires avant validation
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                type="submit"
                disabled={isSubmitting || progress < 100}
                className={`group relative flex items-center justify-center px-10 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 ${
                  progress >= 100 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-300' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${isSubmitting ? 'animate-pulse' : ''}`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : progress >= 100 ? (
                  <>
                    <span className="text-xl mr-3">✅</span>
                    <span>Valider mon inscription</span>
                    <span className="ml-2 text-sm opacity-80">→</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl mr-3">📋</span>
                    <span>Compléter le formulaire</span>
                  </>
                )}
              </button>
              
              <Link
                to="/formations"
                className="flex items-center justify-center px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                ← Retour aux formations
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}