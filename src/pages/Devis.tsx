import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formations } from '../data/formations';
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

export default function Devis() {
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
              aria-label={`Progression du devis: ${Math.round(progress)} pourcent complété`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse" />
              
              <div 
                className={`bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-700 ease-out relative shadow-sm progress-bar`}
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
                {progress < 33 && "💼 Renseignez vos coordonnées pour commencer"}
                {progress >= 33 && progress < 66 && "📚 Sélectionnez votre formation"}
                {progress >= 66 && progress < 100 && "⚙️ Ajustez les paramètres du devis"}
                {progress >= 100 && "🎉 Votre devis est prêt à être généré !"}
              </p>
            </div>
          </div>
        </div>

        {/* Formation sélectionnée - Version améliorée */}
        {selectedFormation && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gradient-to-r from-blue-200 to-indigo-300 p-8 mb-8 relative overflow-hidden">
            {/* Motif de fond décoratif */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full transform translate-x-8 -translate-y-8 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full transform -translate-x-6 translate-y-6 opacity-40"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
                        Formation Sélectionnée
                      </span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedFormation.titre}</h2>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200 shadow-sm">
                        <span className="mr-2">⏰</span>
                        {selectedFormation.duree}
                      </span>
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 shadow-sm">
                        <span className="mr-2">🏆</span>
                        {selectedFormation.certifiante ? 'Formation Certifiante' : 'Formation Qualifiante'}
                      </span>
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200 shadow-sm">
                        <span className="mr-2">📋</span>
                        Éligible CPF
                      </span>
                    </div>
                    
                    {selectedFormation.description && (
                      <p className="text-gray-600 mt-3 text-sm leading-relaxed max-w-2xl">
                        {selectedFormation.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Actions rapides */}
                <div className="flex flex-col space-y-2">
                  <Link 
                    to={`/formations/${selectedFormation.slug}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                  >
                    <span className="mr-2">👁️</span>
                    Voir détails
                  </Link>
                  <button
                    onClick={() => handleFieldChange('formationSlug', '')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                  >
                    <span className="mr-2">🔄</span>
                    Changer
                  </button>
                </div>
              </div>
              
              {/* Barre de progression de la formation */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-blue-800">🎯 Objectifs pédagogiques</span>
                  </div>
                  <span className="text-blue-600 font-medium">Détails dans le programme</span>
                </div>
                
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Théorie et pratique</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>Support de cours inclus</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>Suivi personnalisé</span>
                  </div>
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
              </div>
            </fieldset>

            {/* Actions de génération - Version premium */}
            <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl border-2 border-gradient-to-r from-blue-200 to-indigo-300 p-8 relative overflow-hidden">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full transform translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full transform -translate-x-8 translate-y-8"></div>
              
              <div className="relative z-10">
                {/* En-tête de validation */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                    <span className="text-3xl">{progress >= 100 ? '🎉' : '📋'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {progress >= 100 ? 'Devis Prêt à Générer !' : 'Finalisation du Devis'}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {progress >= 100 
                      ? 'Toutes les informations sont complètes. Votre devis professionnel sera généré instantanément.'
                      : 'Complétez les informations manquantes pour générer votre devis personnalisé.'
                    }
                  </p>
                </div>

                {/* Statut du formulaire */}
                <div className="mb-8 p-6 bg-white rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${progress >= 100 ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                      <span className="font-semibold text-gray-800">
                        {progress >= 100 ? 'Validation Complète' : 'En cours de validation'}
                      </span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold ${
                      progress >= 100 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {Math.round(progress)}% complété
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Informations client</span>
                      <span className={`font-medium ${devisData.clientNom && devisData.clientEmail ? 'text-green-600' : 'text-orange-600'}`}>
                        {devisData.clientNom && devisData.clientEmail ? '✅ Complètes' : '⏳ En attente'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Formation sélectionnée</span>
                      <span className={`font-medium ${selectedFormation ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedFormation ? '✅ Sélectionnée' : '⏳ À choisir'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Calculs tarifaires</span>
                      <span className="font-medium text-green-600">✅ Automatiques</span>
                    </div>
                  </div>
                  
                  {progress < 100 && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start space-x-2">
                        <span className="text-orange-500 mt-0.5">⚠️</span>
                        <div className="text-sm text-orange-800">
                          <div className="font-medium">Action requise</div>
                          <div>Veuillez compléter les informations manquantes pour continuer</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Récapitulatif rapide */}
                {selectedFormation && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">📋</span>
                      Récapitulatif de votre devis
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Formation:</div>
                        <div className="font-semibold truncate">{selectedFormation.titre}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Durée:</div>
                        <div className="font-semibold">{devisData.heures}h ({devisData.mode})</div>
                      </div>
                      {devisData.mode === 'groupe' && (
                        <div>
                          <div className="text-gray-600">Participants:</div>
                          <div className="font-semibold">{devisData.participants} personnes</div>
                        </div>
                      )}
                      <div>
                        <div className="text-gray-600">Total estimé:</div>
                        <div className="font-bold text-lg text-blue-700">{formatEUR(calculations.totalTTC)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleGenerateDevis}
                    disabled={isGenerating || progress < 100}
                    className={`group relative flex items-center justify-center px-12 py-4 font-bold text-lg rounded-2xl transition-all duration-300 shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 ${
                      progress >= 100 
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 focus:ring-emerald-300 shadow-emerald-500/25' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-gray-300/25'
                    } ${isGenerating ? 'animate-pulse' : ''}`}
                  >
                    {/* Effet de brillance */}
                    {progress >= 100 && !isGenerating && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 rounded-2xl transform -skew-x-12 transition-opacity duration-500"></div>
                    )}
                    
                    <div className="relative flex items-center">
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          <span>Génération en cours...</span>
                          <div className="ml-3 flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-200"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-400"></div>
                          </div>
                        </>
                      ) : progress >= 100 ? (
                        <>
                          <span className="text-2xl mr-3">�</span>
                          <span>Générer Mon Devis</span>
                          <span className="ml-3 text-lg opacity-90 group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl mr-3">📋</span>
                          <span>Compléter le Formulaire</span>
                          <span className="ml-3 text-sm opacity-70">({100 - Math.round(progress)}% restant)</span>
                        </>
                      )}
                    </div>
                  </button>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/formations"
                      className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      <span className="mr-2">←</span>
                      Formations
                    </Link>
                    
                    <Link
                      to="/contact"
                      className="flex items-center justify-center px-6 py-3 border-2 border-blue-300 rounded-xl text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      <span className="mr-2">💬</span>
                      Nous contacter
                    </Link>
                  </div>
                </div>
                
                {/* Note importante */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    🔒 <strong>Sécurisé et confidentiel</strong> • Vos données sont protégées et ne seront utilisées que pour l'établissement du devis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau de calculs - Version améliorée */}
          <div className="space-y-6">
            {selectedFormation && (
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-200 overflow-hidden">
                {/* En-tête du panneau de calculs */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">💰</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Estimation Tarifaire</h3>
                        <p className="text-blue-100 text-sm">Calcul automatique en temps réel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-100">Mode:</div>
                      <div className="font-semibold text-lg capitalize">{devisData.mode}</div>
                    </div>
                  </div>
                </div>

                {/* Corps du panneau */}
                <div className="p-6 space-y-4">
                  {/* Configuration du mode */}
                  <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🎯 Mode de formation
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleFieldChange('mode', 'individuel')}
                        className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                          devisData.mode === 'individuel'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-2xl mb-2">👤</div>
                        <div className="font-semibold text-sm">Individuel</div>
                        <div className="text-xs text-gray-500">{formatEUR(TARIF_HORAIRE_INDIVIDUEL)}/h</div>
                      </button>
                      <button
                        onClick={() => handleFieldChange('mode', 'groupe')}
                        className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                          devisData.mode === 'groupe'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-2xl mb-2">👥</div>
                        <div className="font-semibold text-sm">Groupe</div>
                        <div className="text-xs text-gray-500">{formatEUR(TARIF_HORAIRE_GROUPE)}/h/pers</div>
                      </button>
                    </div>
                  </div>

                  {/* Nombre de participants si mode groupe */}
                  {devisData.mode === 'groupe' && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        👥 Nombre de participants
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleFieldChange('participants', Math.max(1, devisData.participants - 1))}
                          className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold hover:bg-blue-200 transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={devisData.participants}
                          onChange={(e) => handleFieldChange('participants', parseInt(e.target.value) || 1)}
                          className="w-16 text-center border border-gray-300 rounded-lg py-1 font-semibold"
                          title="Nombre de participants à la formation"
                          aria-label="Nombre de participants à la formation"
                        />
                        <button
                          onClick={() => handleFieldChange('participants', Math.min(20, devisData.participants + 1))}
                          className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold hover:bg-blue-200 transition-colors"
                        >
                          +
                        </button>
                        <span className="text-sm text-gray-600">participants</span>
                      </div>
                    </div>
                  )}

                  {/* Détail des calculs */}
                  <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span>Tarif horaire {devisData.mode}:</span>
                      </div>
                      <span className="font-semibold text-blue-600">{formatEUR(calculations.tarifHoraire)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>Durée totale:</span>
                      </div>
                      <span className="font-semibold">{devisData.heures}h</span>
                    </div>

                    {devisData.mode === 'groupe' && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          <span>Participants:</span>
                        </div>
                        <span className="font-semibold">{devisData.participants} personnes</span>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">💼 Sous-total Formation:</span>
                        <span className="font-bold text-lg text-blue-700">{formatEUR(calculations.totalFormation)}</span>
                      </div>
                    </div>

                    {/* Coût certification */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🏆 Coût certification (optionnel)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={devisData.coutCertification}
                        onChange={(e) => handleFieldChange('coutCertification', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="0"
                      />
                    </div>

                    {/* TVA */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📊 TVA (%)
                      </label>
                      <select
                        value={devisData.tva}
                        onChange={(e) => handleFieldChange('tva', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        title="Sélectionner le taux de TVA"
                        aria-label="Taux de TVA applicable"
                      >
                        <option value={0}>0% (Formation professionnelle)</option>
                        <option value={20}>20% (TVA standard)</option>
                      </select>
                    </div>

                    {/* Totaux finaux */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 space-y-2 border border-blue-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Total HT:</span>
                        <span className="font-semibold">{formatEUR(calculations.totalHT)}</span>
                      </div>
                      {calculations.totalTVA > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">TVA ({devisData.tva}%):</span>
                          <span className="font-semibold">{formatEUR(calculations.totalTVA)}</span>
                        </div>
                      )}
                      <div className="border-t border-blue-200 pt-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg text-gray-900">💎 Total TTC:</span>
                          <span className="font-bold text-2xl text-blue-700">{formatEUR(calculations.totalTTC)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panneau d'aide amélioré */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💡</span>
                  </div>
                  <h3 className="text-lg font-bold">Informations Utiles</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Conformité Qualiopi</div>
                      <div className="text-gray-600">Devis conformes aux exigences qualité</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">📋</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Programme inclus</div>
                      <div className="text-gray-600">Documentation pédagogique jointe</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-xs font-bold">€</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Tarifs préférentiels</div>
                      <div className="text-gray-600">Remises possibles selon volume</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 text-xs font-bold">🏆</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Certification</div>
                      <div className="text-gray-600">Passage d'examen si applicable</div>
                    </div>
                  </div>
                </div>
                
                {/* Contact rapide */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-200 shadow-sm">
                  <div className="text-sm font-semibold text-gray-800 mb-2">💬 Besoin d'aide ?</div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>📧 <a href="mailto:contact@cip-faro.fr" className="text-emerald-600 hover:text-emerald-700 font-medium">contact@cip-faro.fr</a></div>
                    <div>📱 <a href="tel:+33123456789" className="text-emerald-600 hover:text-emerald-700 font-medium">01 23 45 67 89</a></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panneau de suivi */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Suivi du devis</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Référence:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{devisData.refDevis}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date création:</span>
                  <span className="font-medium">{new Date(devisData.dateDevis).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Validité:</span>
                  <span className="font-medium text-orange-600">{new Date(devisData.echeance).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}