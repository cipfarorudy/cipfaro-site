import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formations } from '../data/formations';
import type { Formation } from '../types/formation';
import cipFaroLogo from '../assets/logo-cipfaro.webp';

interface DevisData {
  // Client info
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  clientAdresse: string;
  clientSiret: string;
  
  // Formation info
  formationSlug: string;
  mode: 'individuel' | 'groupe';
  participants: number;
  heures: number;
  lieu: string;
  periode: string;
  
  // Financial
  tva: number;
  coutCertification: number;
  
  // Admin
  refDevis: string;
  dateDevis: string;
  echeance: string;
}

const TARIF_HORAIRE_INDIVIDUEL = 15;
const TARIF_HORAIRE_GROUPE = 9;

const formatEUR = (amount: number): string => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

const generateRefDevis = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `DEVIS-${year}${month}${day}-${hours}${minutes}`;
};

export default function DevisModerne() {
  const [searchParams] = useSearchParams();
  const slugParam = searchParams.get('slug') || '';

  const [devisData, setDevisData] = useState<DevisData>({
    clientNom: '',
    clientEmail: '',
    clientTelephone: '',
    clientAdresse: '',
    clientSiret: '',
    formationSlug: slugParam,
    mode: 'individuel',
    participants: 1,
    heures: 0,
    lieu: 'CIP FARO Rudy (ou distanciel)',
    periode: 'Dates à définir',
    tva: 0,
    coutCertification: 0,
    refDevis: generateRefDevis(),
    dateDevis: new Date().toISOString().split('T')[0],
    echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // États pour la nouvelle UX moderne
  const [fieldValidation, setFieldValidation] = useState<Record<string, { isValid: boolean; message: string; hasBeenTouched: boolean }>>({});
  const [focusedField, setFocusedField] = useState('');
  const [recentlyCompleted, setRecentlyCompleted] = useState<string[]>([]);

  const selectedFormation = useMemo(() => 
    formations.find((f) => f.slug === devisData.formationSlug) || null,
    [devisData.formationSlug]
  );

  // Mise à jour automatique des heures quand on change de formation
  useEffect(() => {
    if (selectedFormation && selectedFormation.duree) {
      const match = selectedFormation.duree.match(/(\d+)\s*heures?/);
      if (match) {
        setDevisData(prev => ({ ...prev, heures: parseInt(match[1], 10) }));
      }
    }
  }, [selectedFormation]);

  // Calcul de progression du formulaire
  const calculateProgress = () => {
    const requiredFields = [
      devisData.clientNom, 
      devisData.clientEmail, 
      devisData.clientTelephone,
      devisData.formationSlug,
      devisData.lieu,
      devisData.periode
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
  const validateField = (fieldName: string, value: string | number) => {
    let isValid = true;
    let message = '';

    switch (fieldName) {
      case 'clientEmail':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString()) || value === '';
        message = isValid ? '' : 'Format email invalide';
        break;
      case 'clientTelephone':
        isValid = /^[0-9\s+()-]{10,}$/.test(value.toString()) || value === '';
        message = isValid ? '' : 'Numéro de téléphone invalide';
        break;
      case 'clientNom':
        isValid = value.toString().length >= 2 || value === '';
        message = isValid ? '' : 'Minimum 2 caractères requis';
        break;
      case 'clientSiret':
        isValid = /^[0-9]{14}$/.test(value.toString()) || value === '';
        message = isValid ? '' : 'SIRET doit contenir 14 chiffres';
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
  const handleFieldChange = (fieldName: keyof DevisData, value: string | number) => {
    setDevisData(prev => ({ ...prev, [fieldName]: value }));
    validateField(fieldName, value);
    
    if (value && value.toString().trim() !== '' && validateField(fieldName, value)) {
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

  const calculations = useMemo(() => {
    const tarifHoraire = devisData.mode === 'individuel' 
      ? TARIF_HORAIRE_INDIVIDUEL 
      : TARIF_HORAIRE_GROUPE;
    
    const sousTotal = devisData.heures * tarifHoraire;
    const totalFormation = devisData.mode === 'groupe' 
      ? sousTotal * devisData.participants 
      : sousTotal;
    
    const totalHT = totalFormation + devisData.coutCertification;
    const totalTVA = totalHT * (devisData.tva / 100);
    const totalTTC = totalHT + totalTVA;

    return { tarifHoraire, totalFormation, totalHT, totalTVA, totalTTC };
  }, [devisData]);

  const handleGenerateDevis = async () => {
    if (!selectedFormation) {
      alert('Veuillez sélectionner une formation');
      return;
    }

    if (!devisData.clientNom || !devisData.clientEmail) {
      alert('Veuillez remplir au minimum le nom et l\'email du client');
      return;
    }

    setIsGenerating(true);

    try {
      // Simuler la génération de devis (à remplacer par l'API réelle)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Devis généré avec succès ! Vous devriez le recevoir par email.');
    } catch (error) {
      console.error('Erreur lors de la génération du devis:', error);
      alert('Erreur lors de la génération du devis');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Accessibility Announcements */}
      <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>

      {/* Hero Section Moderne */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
                <img src={cipFaroLogo} alt="CIP Faro" className="w-16 h-16 object-contain" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Générateur de Devis
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl">
                Obtenez rapidement un devis personnalisé pour nos formations certifiantes. 
                <span className="font-semibold text-white"> Processus simple et rapide</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-green-400">🏆</span>
                <span className="text-sm font-medium text-white">Certifié Qualiopi</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-blue-400">⚡</span>
                <span className="text-sm font-medium text-white">Devis instantané</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-purple-400">📊</span>
                <span className="text-sm font-medium text-white">Calcul automatique</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-yellow-400">📄</span>
                <span className="text-sm font-medium text-white">Format professionnel</span>
              </div>
            </div>
            
            <p className="text-sm text-blue-200 italic">
              Plus de 1000 entreprises nous font confiance • Organisme de formation agréé
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 mb-8 relative overflow-hidden" role="region" aria-labelledby="progress-title">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center" role="img" aria-label={`Progression: ${Math.round(progress)} pourcent`}>
                  <span className="text-blue-600 text-sm font-bold">{Math.round(progress)}%</span>
                </div>
                <div>
                  <span id="progress-title" className="text-sm font-semibold text-gray-800">Progression du devis</span>
                  <div className="text-xs text-gray-500" aria-live="polite">
                    {completedFields} sur {totalFields} informations complétées
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600" aria-live="polite">
                  {progress >= 100 ? '✅ Prêt à générer !' : `${Math.round(progress)}% complété`}
                </div>
                <div className="text-xs text-gray-500" aria-live="polite">
                  {timeRemaining > 0 ? `~${timeRemaining} min restantes` : 'Devis prêt !'}
                </div>
              </div>
            </div>

            <div 
              className="w-full bg-gray-200 rounded-full h-4 shadow-inner relative overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression du devis: ${Math.round(progress)} pourcent complété`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse" />
              
              <div 
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-700 ease-out relative shadow-sm"
                style={{ width: `${progress}%` }}
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
                {progress < 33 && "💼 Renseignez vos coordonnées pour commencer"}
                {progress >= 33 && progress < 66 && "📚 Sélectionnez votre formation"}
                {progress >= 66 && progress < 100 && "⚙️ Ajustez les paramètres du devis"}
                {progress >= 100 && "🎉 Votre devis est prêt à être généré !"}
              </p>
            </div>
          </div>
        </div>

        {/* Formation sélectionnée */}
        {selectedFormation && (
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedFormation.titre}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Informations client */}
            <fieldset className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 group" role="group" aria-labelledby="section-client">
              <legend id="section-client" className="text-lg font-semibold text-gray-900 px-6 py-2">Informations client</legend>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b rounded-t-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110" aria-hidden="true">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Renseignez vos coordonnées professionnelles</p>
                      </div>
                      <div className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true">
                        📇
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Nom de l'entreprise/contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise ou du contact <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={devisData.clientNom}
                      onChange={(e) => handleFieldChange('clientNom', e.target.value)}
                      onFocus={() => handleFieldFocus('clientNom')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'clientNom' 
                          ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                          : fieldValidation.clientNom?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.clientNom?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } ${recentlyCompleted.includes('clientNom') ? 'bg-green-50' : ''}`}
                      placeholder="Nom de votre entreprise"
                      required
                    />
                    {recentlyCompleted.includes('clientNom') && (
                      <div className="absolute right-2 top-2 text-green-500 animate-bounce">
                        ✨
                      </div>
                    )}
                  </div>
                  <ValidationIndicator fieldName="clientNom" />
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
                        value={devisData.clientEmail}
                        onChange={(e) => handleFieldChange('clientEmail', e.target.value)}
                        onFocus={() => handleFieldFocus('clientEmail')}
                        onBlur={handleFieldBlur}
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          focusedField === 'clientEmail' 
                            ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                            : fieldValidation.clientEmail?.isValid === false 
                              ? 'border-red-400 focus:ring-red-500'
                              : fieldValidation.clientEmail?.isValid === true
                                ? 'border-green-400 focus:ring-green-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } ${recentlyCompleted.includes('clientEmail') ? 'bg-green-50' : ''}`}
                        placeholder="votre.email@entreprise.com"
                        required
                      />
                      {recentlyCompleted.includes('clientEmail') && (
                        <div className="absolute right-2 top-2 text-green-500 animate-bounce">
                          ✨
                        </div>
                      )}
                    </div>
                    <ValidationIndicator fieldName="clientEmail" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={devisData.clientTelephone}
                        onChange={(e) => handleFieldChange('clientTelephone', e.target.value)}
                        onFocus={() => handleFieldFocus('clientTelephone')}
                        onBlur={handleFieldBlur}
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          focusedField === 'clientTelephone' 
                            ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                            : fieldValidation.clientTelephone?.isValid === false 
                              ? 'border-red-400 focus:ring-red-500'
                              : fieldValidation.clientTelephone?.isValid === true
                                ? 'border-green-400 focus:ring-green-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } ${recentlyCompleted.includes('clientTelephone') ? 'bg-green-50' : ''}`}
                        placeholder="06 12 34 56 78"
                        required
                      />
                      {recentlyCompleted.includes('clientTelephone') && (
                        <div className="absolute right-2 top-2 text-green-500 animate-bounce">
                          ✨
                        </div>
                      )}
                    </div>
                    <ValidationIndicator fieldName="clientTelephone" />
                  </div>
                </div>

                {/* Formation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formation souhaitée <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={devisData.formationSlug}
                    onChange={(e) => handleFieldChange('formationSlug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              </div>
            </fieldset>

            {/* Actions de génération */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg border p-8">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-blue-800 font-medium">Validation du devis</span>
                  </div>
                  <div className="text-blue-700">
                    {progress >= 100 ? '✅ Devis complet' : `${Math.round(progress)}% complété`}
                  </div>
                </div>
                
                {progress < 100 && (
                  <div className="mt-2 text-xs text-blue-600">
                    ⚠️ Veuillez compléter toutes les informations obligatoires avant génération
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={handleGenerateDevis}
                  disabled={isGenerating || progress < 100}
                  className={`group relative flex items-center justify-center px-10 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 ${
                    progress >= 100 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-300' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } ${isGenerating ? 'animate-pulse' : ''}`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                  
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      <span>Génération en cours...</span>
                    </>
                  ) : progress >= 100 ? (
                    <>
                      <span className="text-xl mr-3">📊</span>
                      <span>Générer le devis</span>
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
          </div>

          {/* Panneau de calculs */}
          <div className="space-y-6">
            {selectedFormation && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Estimation tarifaire</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Tarif horaire:</span>
                    <span className="font-medium">{formatEUR(calculations.tarifHoraire)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nombre d'heures:</span>
                    <span className="font-medium">{devisData.heures}h</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total HT:</span>
                    <span className="font-bold text-blue-600">{formatEUR(calculations.totalHT)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Aide</h3>
              <div className="text-sm space-y-2">
                <p>• Les devis sont conformes aux exigences Qualiopi</p>
                <p>• Le programme de formation sera joint automatiquement</p>
                <p>• Les tarifs affichés sont nos tarifs standard</p>
                <p>• La TVA est généralement à 0% en formation professionnelle</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}