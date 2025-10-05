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

  // Calcul du pourcentage de completion
  const calculateProgress = () => {
    const requiredFields = [civilite, nom, prenom, dateNaissance, adresse, codePostal, ville, telephone, email, situationProfessionnelle, raisons, experience, niveau]
    const filledFields = requiredFields.filter(field => field && field.trim() !== '').length
    return (filledFields / requiredFields.length) * 100
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <span>›</span>
            <Link to="/formations" className="hover:text-blue-600 transition-colors">Formations</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Préinscription</span>
          </nav>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Questionnaire de préinscription
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complétez ce formulaire pour candidater à votre formation. 
              Toutes les informations renseignées resteront confidentielles.
            </p>
          </div>
        </div>
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

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progression du formulaire</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(calculateProgress())}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Identité */}
          <fieldset className="bg-white rounded-lg shadow-sm border">
            <legend className="sr-only">Informations personnelles</legend>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Vos informations personnelles</h3>
                  <p className="text-sm text-gray-600">Renseignez votre identité et vos coordonnées</p>
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
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Date de naissance */}
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
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
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Section 2: Situation professionnelle */}
          <fieldset className="bg-white rounded-lg shadow-sm border">
            <legend className="sr-only">Situation professionnelle</legend>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💼</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Votre situation professionnelle</h3>
                  <p className="text-sm text-gray-600">Indiquez votre situation actuelle</p>
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
          <fieldset className="bg-white rounded-lg shadow-sm border">
            <legend className="sr-only">Motivation et expérience</legend>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💡</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Motivation et expérience</h3>
                  <p className="text-sm text-gray-600">Parlez-nous de votre projet et de votre parcours</p>
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
          <fieldset className="bg-white rounded-lg shadow-sm border">
            <legend className="sr-only">Besoins spécifiques</legend>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">♿</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Besoins spécifiques</h3>
                  <p className="text-sm text-gray-600">Informations pour l'accessibilité et l'accompagnement</p>
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
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md disabled:opacity-50"
              >
                <span className="mr-2">📨</span>
                {isSending ? 'Envoi en cours...' : 'Envoyer ma candidature'}
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