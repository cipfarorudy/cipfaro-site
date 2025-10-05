import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { formations } from '../data/formations'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs'
import { envoyerEmailInscription } from '../utils/emailService'

export default function Preinscription() {
  const [searchParams] = useSearchParams()
  const formationId = searchParams.get('formation')
  const formation = formations.find(f => f.id === formationId)

  // États pour les données du formulaire
  const [civilite, setCivilite] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [adresse, setAdresse] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [ville, setVille] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [situationProfessionnelle, setSituationProfessionnelle] = useState('')
  const [autresSituations, setAutresSituations] = useState('')
  const [raisons, setRaisons] = useState('')
  const [experience, setExperience] = useState('')
  const [niveau, setNiveau] = useState('')
  const [dernierDiplome, setDernierDiplome] = useState('')
  const [psh, setPsh] = useState(false)
  const [pshDetails, setPshDetails] = useState('')
  const [commentaires, setCommentaires] = useState('')
  const [prerequis, setPrerequis] = useState('')
  const [modalitesValidation, setModalitesValidation] = useState('')
  const [isSending, setIsSending] = useState(false)

  // États pour la validation et les micro-interactions
  const [fieldValidation, setFieldValidation] = useState({})
  const [focusedField, setFocusedField] = useState('')
  const [recentlyCompleted, setRecentlyCompleted] = useState([])

  // Calcul du pourcentage de completion et temps estimé
  const calculateProgress = () => {
    const requiredFields = [civilite, nom, prenom, dateNaissance, adresse, codePostal, ville, telephone, email, situationProfessionnelle, raisons, experience, niveau]
    const filledFields = requiredFields.filter(field => field && field.trim() !== '').length
    const progress = (filledFields / requiredFields.length) * 100
    
    // Calcul du temps estimé restant (basé sur 5 minutes total)
    const timeRemaining = Math.max(0, Math.ceil((5 * (100 - progress)) / 100))
    
    return { progress, timeRemaining, completedFields: filledFields, totalFields: requiredFields.length }
  }

  const { progress, timeRemaining, completedFields, totalFields } = calculateProgress()

  // Fonctions de validation temps réel
  const validateField = (fieldName, value) => {
    let isValid = true
    let message = ''

    switch (fieldName) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === ''
        message = isValid ? '' : 'Format email invalide'
        break
      case 'telephone':
        isValid = /^[0-9\s+()-]{10,}$/.test(value) || value === ''
        message = isValid ? '' : 'Numéro de téléphone invalide'
        break
      case 'codePostal':
        isValid = /^[0-9]{5}$/.test(value) || value === ''
        message = isValid ? '' : 'Code postal doit contenir 5 chiffres'
        break
      case 'nom':
      case 'prenom':
        isValid = value.length >= 2 || value === ''
        message = isValid ? '' : 'Minimum 2 caractères requis'
        break
      default:
        isValid = true
    }

    setFieldValidation(prev => ({
      ...prev,
      [fieldName]: { isValid, message, hasBeenTouched: value !== '' }
    }))

    return isValid
  }

  // Gestionnaire pour les changements de champs avec validation
  const handleFieldChange = (fieldName, value, setter) => {
    setter(value)
    validateField(fieldName, value)
    
    // Ajouter aux champs récemment complétés si le champ devient valide
    if (value && value.trim() !== '' && validateField(fieldName, value)) {
      if (!recentlyCompleted.includes(fieldName)) {
        setRecentlyCompleted(prev => [...prev, fieldName])
        setTimeout(() => {
          setRecentlyCompleted(prev => prev.filter(field => field !== fieldName))
        }, 3000)
      }
    }
  }

  // Gestionnaire focus/blur pour les effets visuels
  const handleFieldFocus = (fieldName) => {
    setFocusedField(fieldName)
  }

  const handleFieldBlur = () => {
    setFocusedField('')
  }

  // Composant pour l'indicateur de validation
  const ValidationIndicator = ({ fieldName, showSuccess = true }) => {
    const validation = fieldValidation[fieldName]
    if (!validation || !validation.hasBeenTouched) return null

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
    )
  }



  // Génération du PDF
  const generatePDF = () => {
    const doc = new jsPDF()
    const currentDate = dayjs().format('DD/MM/YYYY')
    
    // En-tête
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    doc.text('DOSSIER DE CANDIDATURE', 105, 25, { align: 'center' })
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text(`Formation : ${formation?.titre || 'Non spécifiée'}`, 20, 40)
    doc.text(`Date : ${currentDate}`, 20, 48)

    // Informations personnelles
    autoTable(doc, {
      startY: 60,
      head: [['INFORMATIONS PERSONNELLES']],
      body: [
        ['Civilité', civilite],
        ['Nom', nom],
        ['Prénom', prenom],
        ['Date de naissance', dateNaissance],
        ['Adresse complète', `${adresse}, ${codePostal} ${ville}`],
        ['Téléphone', telephone],
        ['Email', email],
        ['Situation professionnelle', situationProfessionnelle],
        ['Autres situations', autresSituations],
      ],
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: { 0: { cellWidth: 240 }, 1: { cellWidth: 255 } },
      headStyles: { fillColor: [226,232,240], textColor: 15 },
      theme: 'grid'
    })

    // Motivations et expérience
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [['MOTIVATIONS ET EXPÉRIENCE']],
      body: [
        ['Raisons d\'entrer en formation', raisons],
        ['Expérience professionnelle', experience],
        ['Niveau de qualification', niveau],
        ['Dernier diplôme obtenu', dernierDiplome],
        ['Besoins spécifiques (handicap)', psh ? 'Oui' : 'Non'],
        ['Détails besoins spécifiques', pshDetails],
        ['Commentaires', commentaires],
      ],
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: { 0: { cellWidth: 240 }, 1: { cellWidth: 255 } },
      headStyles: { fillColor: [226,232,240], textColor: 15 },
      theme: 'grid'
    })

    return doc
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)

    try {
      // Générer et télécharger le PDF
      const doc = generatePDF()
      doc.save(`candidature-${nom}-${prenom}-${dayjs().format('YYYY-MM-DD')}.pdf`)

      await envoyerEmailInscription({
        formation: formation?.titre || 'Formation non spécifiée',
        civilite,
        nom,
        prenom,
        email,
        telephone,
        duree: formation?.duree,
        modalites: formation?.modalite,
        dateDebut: formation?.dateDebut,
        financement: 'Nous vous accompagnons dans vos démarches de financement'
      })

      alert('Candidature envoyée avec succès ! Nous vous contacterons bientôt.')
    } catch (error) {
      console.error('Erreur envoi:', error)
      alert('Erreur lors de l\'envoi. Veuillez réessayer.')
    } finally {
      setIsSending(false)
    }
  }

  if (!formation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Formation non trouvée</h2>
          <Link to="/formations" className="text-blue-600 hover:text-blue-800">
            ← Retour aux formations
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <span>›</span>
            <Link to="/formations" className="hover:text-blue-600 transition-colors">Formations</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Préinscription</span>
          </nav>
          
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/logo-cipfaro.png" 
                alt="CIP FARO - Centre de formation" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Hero Content */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
              <span className="text-3xl text-white">📋</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Préinscription à une formation
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-6">
              Remplissez ce formulaire en <strong>5 minutes</strong>. 
              Votre avenir professionnel commence ici.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-green-200">
                <span className="text-green-600">🔒</span>
                <span className="text-sm font-medium text-gray-700">Données sécurisées</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-200">
                <span className="text-blue-600">📧</span>
                <span className="text-sm font-medium text-gray-700">Confirmation immédiate</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-200">
                <span className="text-purple-600">🖨️</span>
                <span className="text-sm font-medium text-gray-700">Résumé téléchargeable</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">
              Certifié Qualiopi • Plus de 1000 stagiaires formés
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Announcements */}
      <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only">
        {/* Les annonces dynamiques seront ajoutées ici */}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formation sélectionnée */}
        {formation && (
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{formation.titre}</h2>
                <p className="text-gray-600">Durée : {formation.duree} • Lieu : {formation.lieu}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Progress Bar with Accessibility */}
        <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 mb-8 relative overflow-hidden" role="region" aria-labelledby="progress-title">
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" />
          
          <div className="relative">
            {/* Header with stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center" role="img" aria-label={`Progression: ${Math.round(progress)} pourcent`}>
                  <span className="text-blue-600 text-sm font-bold">{Math.round(progress)}%</span>
                </div>
                <div>
                  <span id="progress-title" className="text-sm font-semibold text-gray-800">Progression du formulaire</span>
                  <div className="text-xs text-gray-500" aria-live="polite">
                    {completedFields} sur {totalFields} sections complétées
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600" aria-live="polite">
                  {progress >= 100 ? '✅ Terminé !' : `${Math.round(progress)}% complété`}
                </div>
                <div className="text-xs text-gray-500" aria-live="polite">
                  {timeRemaining > 0 ? `~${timeRemaining} min restantes` : 'Prêt à envoyer !'}
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div 
              className="w-full bg-gray-200 rounded-full h-4 shadow-inner relative overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression du formulaire: ${Math.round(progress)} pourcent complété`}
            >
              {/* Background shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse" />
              
              {/* Progress fill */}
              <div 
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-700 ease-out relative shadow-sm"
                style={{ width: `${progress}%` }}
              >
                {/* Shine effect on progress bar */}
                {progress > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 animate-pulse" />
                )}
              </div>
              
              {/* Progress steps indicators */}
              <div className="absolute inset-0 flex justify-between items-center px-1">
                {[20, 40, 60, 80].map(step => (
                  <div 
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      progress >= step 
                        ? 'bg-white shadow-sm' 
                        : 'bg-gray-400'
                    }`}
                    role="img"
                    aria-label={`Étape ${step}% ${progress >= step ? 'complétée' : 'en attente'}`}
                  />
                ))}
              </div>
            </div>

            {/* Motivational message */}
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                {progress < 25 && "🚀 Excellent début ! Continuez comme ça."}
                {progress >= 25 && progress < 50 && "💪 Très bien, vous êtes sur la bonne voie !"}
                {progress >= 50 && progress < 75 && "⭐ Fantastique ! Plus que quelques informations."}
                {progress >= 75 && progress < 100 && "🎯 Presque fini ! Vous y êtes presque."}
                {progress >= 100 && "🎉 Parfait ! Votre dossier est complet."}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Identité */}
          <fieldset className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 group" role="group" aria-labelledby="section-identite">
            <legend id="section-identite" className="text-lg font-semibold text-gray-900 px-6 py-2">Informations personnelles</legend>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b rounded-t-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110" aria-hidden="true">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Renseignez votre identité et vos coordonnées</p>
                    </div>
                    <div className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true">
                      🆔
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Civilité et noms */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Civilité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={civilite}
                    onChange={(e) => setCivilite(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Choisir</option>
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                    <option value="Mlle">Mlle</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => handleFieldChange('nom', e.target.value, setNom)}
                      onFocus={() => handleFieldFocus('nom')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'nom' 
                          ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                          : fieldValidation.nom?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.nom?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } ${recentlyCompleted.includes('nom') ? 'bg-green-50' : ''}`}
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
                      value={prenom}
                      onChange={(e) => handleFieldChange('prenom', e.target.value, setPrenom)}
                      onFocus={() => handleFieldFocus('prenom')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'prenom' 
                          ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                          : fieldValidation.prenom?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.prenom?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } ${recentlyCompleted.includes('prenom') ? 'bg-green-50' : ''}`}
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

              {/* Date de naissance */}
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateNaissance}
                    onChange={(e) => handleFieldChange('dateNaissance', e.target.value, setDateNaissance)}
                    onFocus={() => handleFieldFocus('dateNaissance')}
                    onBlur={handleFieldBlur}
                    className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                      focusedField === 'dateNaissance' 
                        ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                        : dateNaissance
                          ? 'border-green-400 focus:ring-green-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } ${recentlyCompleted.includes('dateNaissance') ? 'bg-green-50' : ''}`}
                    required
                  />
                  {recentlyCompleted.includes('dateNaissance') && (
                    <div className="absolute right-2 top-2 text-green-500 animate-bounce">
                      ✨
                    </div>
                  )}
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Numéro, rue, bâtiment..."
                  required
                />
              </div>

              {/* Code postal et ville */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={codePostal}
                    onChange={(e) => setCodePostal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => handleFieldChange('telephone', e.target.value, setTelephone)}
                      onFocus={() => handleFieldFocus('telephone')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'telephone' 
                          ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                          : fieldValidation.telephone?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.telephone?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                      onFocus={() => handleFieldFocus('email')}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                        focusedField === 'email' 
                          ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                          : fieldValidation.email?.isValid === false 
                            ? 'border-red-400 focus:ring-red-500'
                            : fieldValidation.email?.isValid === true
                              ? 'border-green-400 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
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
              </div>
            </div>
          </fieldset>

          {/* Section 2: Situation professionnelle */}
          <fieldset className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 group" role="group" aria-labelledby="section-profession">
            <legend id="section-profession" className="text-lg font-semibold text-gray-900 px-6 py-2">Situation professionnelle</legend>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b rounded-t-lg group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110" aria-hidden="true">
                  <span className="text-2xl">💼</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Indiquez votre situation actuelle</p>
                    </div>
                    <div className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true">
                      📊
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation professionnelle <span className="text-red-500">*</span>
                </label>
                <select
                  value={situationProfessionnelle}
                  onChange={(e) => setSituationProfessionnelle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choisir votre situation</option>
                  <option value="Demandeur d'emploi">Demandeur d'emploi</option>
                  <option value="Salarié CDI">Salarié CDI</option>
                  <option value="Salarié CDD">Salarié CDD</option>
                  <option value="Intérimaire">Intérimaire</option>
                  <option value="Indépendant/Freelance">Indépendant/Freelance</option>
                  <option value="Étudiant">Étudiant</option>
                  <option value="Retraité">Retraité</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {situationProfessionnelle === 'Autre' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Précisez votre situation
                  </label>
                  <input
                    type="text"
                    value={autresSituations}
                    onChange={(e) => setAutresSituations(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez votre situation..."
                  />
                </div>
              )}
            </div>
          </fieldset>

          {/* Section 3: Motivation et expérience */}
          <fieldset className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 group">
            <legend className="sr-only">Motivation et expérience</legend>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b rounded-t-lg group-hover:from-purple-100 group-hover:to-pink-100 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-all duration-300 group-hover:scale-110">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-800 transition-colors duration-300">Motivation et expérience</h3>
                      <p className="text-sm text-gray-600">Parlez-nous de votre projet et de votre parcours</p>
                    </div>
                    <div className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                      🎯
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pour quelles raisons souhaitez-vous entrer en formation ? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={raisons}
                  onChange={(e) => setRaisons(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Décrivez vos motivations, vos objectifs professionnels..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quelle est votre expérience professionnelle dans ce domaine ? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Décrivez votre expérience, vos compétences acquises..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quel est votre niveau de qualification ? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Choisir</option>
                    <option value="Niveau 3 (CAP/BEP)">Niveau 3 (CAP/BEP)</option>
                    <option value="Niveau 4 (Baccalauréat)">Niveau 4 (Baccalauréat)</option>
                    <option value="Niveau 5 (Bac+2)">Niveau 5 (Bac+2)</option>
                    <option value="Niveau 6 (Bac+3/4)">Niveau 6 (Bac+3/4)</option>
                    <option value="Niveau 7 (Bac+5)">Niveau 7 (Bac+5)</option>
                    <option value="Niveau 8 (Bac+8)">Niveau 8 (Bac+8)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quel est votre dernier diplôme obtenu ?
                  </label>
                  <input
                    type="text"
                    value={dernierDiplome}
                    onChange={(e) => setDernierDiplome(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Master en informatique, CAP cuisine..."
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Section 4: Besoins spécifiques */}
          <fieldset className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 group">
            <legend className="sr-only">Besoins spécifiques</legend>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b rounded-t-lg group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-all duration-300 group-hover:scale-110">
                  <span className="text-2xl">♿</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-800 transition-colors duration-300">Besoins spécifiques</h3>
                      <p className="text-sm text-gray-600">Informations pour l'accessibilité et l'accompagnement</p>
                    </div>
                    <div className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                      🤝
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Avez-vous des besoins spécifiques liés à une situation de handicap ?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="psh"
                      checked={psh === false}
                      onChange={() => setPsh(false)}
                      className="mr-2"
                    />
                    Non
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="psh"
                      checked={psh === true}
                      onChange={() => setPsh(true)}
                      className="mr-2"
                    />
                    Oui
                  </label>
                </div>
              </div>

              {psh && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment pouvons-nous adapter notre formation à vos besoins ?
                  </label>
                  <textarea
                    value={pshDetails}
                    onChange={(e) => setPshDetails(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez les adaptations nécessaires..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaires ou informations complémentaires
                </label>
                <textarea
                  value={commentaires}
                  onChange={(e) => setCommentaires(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Toute information que vous souhaitez partager..."
                />
              </div>
            </div>
          </fieldset>

          {/* Section 5: Validation organisme (optionnelle) */}
          <fieldset className="bg-white rounded-lg shadow-sm border">
            <legend className="sr-only">Validation par l'organisme</legend>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📋</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Évaluation par l'organisme</h3>
                  <p className="text-sm text-gray-600">Section à remplir par CIP FARO (optionnel pour le candidat)</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prérequis pour cette formation
                </label>
                <textarea
                  value={prerequis}
                  onChange={(e) => setPrerequis(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="À remplir par l'organisme..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalités de validation des acquis
                </label>
                <textarea
                  value={modalitesValidation}
                  onChange={(e) => setModalitesValidation(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="À remplir par l'organisme..."
                />
              </div>
            </div>
          </fieldset>

          {/* Actions de soumission */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg border p-8">
            {/* Statistiques de validation du formulaire */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-800 font-medium">Validation du dossier</span>
                </div>
                <div className="text-blue-700">
                  {progress >= 100 ? '✅ Dossier complet' : `${Math.round(progress)}% complété`}
                </div>
              </div>
              
              {progress < 100 && (
                <div className="mt-2 text-xs text-blue-600">
                  ⚠️ Veuillez compléter toutes les sections obligatoires avant l'envoi
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                type="submit"
                disabled={isSending || progress < 100}
                className={`group relative flex items-center justify-center px-10 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 ${
                  progress >= 100 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-300' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${isSending ? 'animate-pulse' : ''}`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Transmission en cours...</span>
                  </>
                ) : progress >= 100 ? (
                  <>
                    <span className="text-xl mr-3">�</span>
                    <span>Finaliser ma candidature</span>
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
                <span className="mr-2">←</span>
                Retour aux formations
              </Link>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>📞 Besoin d'aide ? Contactez-nous au 05 65 24 23 10</p>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}