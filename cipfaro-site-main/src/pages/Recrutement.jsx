import { useState, useEffect } from 'react'
import { useSEO, seoConfig } from '../utils/seo'
import { trackRecrutementSubmit } from '../utils/analytics'
import { envoyerEmailCandidature, envoyerEmailOffre, initEmailService } from '../utils/emailService'

export default function Recrutement() {
  // SEO optimisé pour la page recrutement
  useSEO(seoConfig.recrutement)
  
  // Initialiser le service email au chargement du composant
  useEffect(() => {
    initEmailService()
  }, [])
  const [profileType, setProfileType] = useState('') // 'entreprise' ou 'candidat'
  const [formData, setFormData] = useState({
    // Champs communs
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    
    // Champs candidat
    posteRecherche: '',
    experience: '',
    disponibilite: '',
    cv: null,
    niveauEtudes: '',
    competencesInformatiques: '',
    motivations: '',
    projetsAnterieurs: '',
    objectifsProfessionnels: '',
    contraintes: '',
    formationSouhaitee: '',
    
    // Champs entreprise
    nomEntreprise: '',
    secteurActivite: '',
    tailleEntreprise: '',
    postePropose: '',
    competencesRecherchees: '',
    typeContrat: '',
    localisationPoste: '',
    salairePropose: '',
    descriptionPoste: '',
    profilRecherche: '',
    formationsCiblees: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setMessage('Veuillez sélectionner un fichier PDF ou Word (.doc, .docx)')
        return
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Le fichier ne doit pas dépasser 5 MB')
        return
      }
      setFormData(prev => ({
        ...prev,
        cv: file
      }))
      setMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    // Validation selon le type de profil
    if (!formData.prenom || !formData.nom || !formData.email || !formData.telephone) {
      setMessage('Veuillez remplir tous les champs obligatoires')
      setIsSubmitting(false)
      return
    }

    if (profileType === 'entreprise') {
      if (!formData.nomEntreprise || !formData.secteurActivite || !formData.tailleEntreprise || 
          !formData.postePropose || !formData.typeContrat || !formData.localisationPoste ||
          !formData.competencesRecherchees || !formData.descriptionPoste || 
          formData.formationsCiblees.length === 0) {
        setMessage('Veuillez remplir tous les champs obligatoires pour l\'entreprise')
        setIsSubmitting(false)
        return
      }
    }

    if (profileType === 'candidat') {
      if (!formData.formationSouhaitee || !formData.posteRecherche || 
          !formData.disponibilite || !formData.motivations || !formData.cv) {
        setMessage('Veuillez remplir tous les champs obligatoires et joindre votre CV')
        setIsSubmitting(false)
        return
      }
    }

    try {
      // Simulation d'envoi (à remplacer par une vraie API)
      // const formDataToSend = new FormData()
      // Object.keys(formData).forEach(key => {
      //   formDataToSend.append(key, formData[key])
      // })
      
      // Simulation d'attente
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Envoi de l'email de confirmation selon le type
      let emailResult
      if (profileType === 'entreprise') {
        emailResult = await envoyerEmailOffre(formData)
      } else {
        emailResult = await envoyerEmailCandidature(formData)
      }
      
      const successMessage = profileType === 'entreprise' 
        ? `Votre offre d'emploi a été publiée avec succès ! ${emailResult.success ? 'Un email de confirmation vous a été envoyé.' : ''} Nous mettrons en relation les candidats correspondants sous 48h.`
        : `Votre candidature a été envoyée avec succès ! ${emailResult.success ? 'Un email de confirmation vous a été envoyé.' : ''} Nous vous mettrons en relation avec les entreprises correspondantes sous 48h.`
      
      setMessage(successMessage)
      
      // Tracker l'événement de soumission
      trackRecrutementSubmit(profileType)
      
      // Reset du formulaire
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        posteRecherche: '',
        experience: '',
        disponibilite: '',
        cv: null,
        niveauEtudes: '',
        competencesInformatiques: '',
        motivations: '',
        projetsAnterieurs: '',
        objectifsProfessionnels: '',
        contraintes: '',
        formationSouhaitee: '',
        nomEntreprise: '',
        secteurActivite: '',
        tailleEntreprise: '',
        postePropose: '',
        competencesRecherchees: '',
        typeContrat: '',
        localisationPoste: '',
        salairePropose: '',
        descriptionPoste: '',
        profilRecherche: '',
        formationsCiblees: []
      })
      
      // Reset du champ fichier si présent
      const fileInput = document.getElementById('cv-upload')
      if (fileInput) fileInput.value = ''
      
    } catch {
      setMessage('Une erreur est survenue. Veuillez réessayer plus tard.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="h1">Espace Mise en Relation Professionnelle</h1>
        <p className="lead">
          🤝 Connectez talents et opportunités ! Entreprises et candidats formés par CIP FARO, trouvez votre match parfait.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {!profileType ? (
          <div className="card">
            <h2>Qui êtes-vous ?</h2>
            <p>Choisissez votre profil pour accéder au formulaire adapté :</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '2rem 0' }}>
              <div 
                onClick={() => setProfileType('entreprise')}
                style={{
                  padding: '2rem',
                  border: '2px solid #007bff',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f8f9ff',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e6f0ff'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9ff'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
                <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>Je suis une Entreprise</h3>
                <p style={{ color: '#666' }}>
                  Je recherche des candidats formés par CIP FARO pour mes postes à pourvoir
                </p>
              </div>
              
              <div 
                onClick={() => setProfileType('candidat')}
                style={{
                  padding: '2rem',
                  border: '2px solid #28a745',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f8fff8',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e6ffe6'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f8fff8'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                <h3 style={{ color: '#28a745', marginBottom: '1rem' }}>Je suis un Candidat</h3>
                <p style={{ color: '#666' }}>
                  J'ai suivi une formation CIP FARO et je recherche un emploi ou un stage
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2>
                  {profileType === 'entreprise' ? '🏢 Formulaire Entreprise' : '🎓 Formulaire Candidat'}
                </h2>
                <button 
                  onClick={() => setProfileType('')}
                  style={{
                    background: 'none',
                    border: '1px solid #ddd',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ← Changer de profil
                </button>
              </div>
          
          {message && (
            <div className={`message ${message.includes('succès') ? 'success' : 'error'}`} style={{
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              backgroundColor: message.includes('succès') ? '#d4edda' : '#f8d7da',
              color: message.includes('succès') ? '#155724' : '#721c24',
              border: `1px solid ${message.includes('succès') ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            {profileType === 'entreprise' ? (
              <>
                {/* Formulaire Entreprise */}
                <div>
                  <label htmlFor="nomEntreprise" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    id="nomEntreprise"
                    name="nomEntreprise"
                    value={formData.nomEntreprise}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="prenom" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Prénom du responsable *
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Nom du responsable *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="secteurActivite" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Secteur d'activité *
                    </label>
                    <select
                      id="secteurActivite"
                      name="secteurActivite"
                      value={formData.secteurActivite}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Sélectionner</option>
                      <option value="informatique">Informatique / Digital</option>
                      <option value="formation">Formation / Éducation</option>
                      <option value="insertion">Insertion professionnelle</option>
                      <option value="conseil">Conseil / Coaching</option>
                      <option value="entrepreneuriat">Entrepreneuriat</option>
                      <option value="commerce">Commerce / Vente</option>
                      <option value="industrie">Industrie</option>
                      <option value="sante">Santé / Social</option>
                      <option value="audiovisuel">Audiovisuel / Créatif</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tailleEntreprise" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Taille de l'entreprise *
                    </label>
                    <select
                      id="tailleEntreprise"
                      name="tailleEntreprise"
                      value={formData.tailleEntreprise}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Sélectionner</option>
                      <option value="1-10">1-10 salariés</option>
                      <option value="11-50">11-50 salariés</option>
                      <option value="51-250">51-250 salariés</option>
                      <option value="250+">Plus de 250 salariés</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="postePropose" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Poste proposé *
                  </label>
                  <input
                    type="text"
                    id="postePropose"
                    name="postePropose"
                    value={formData.postePropose}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Conseiller en insertion professionnelle, Formateur digital..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="typeContrat" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Type de contrat *
                  </label>
                  <select
                    id="typeContrat"
                    name="typeContrat"
                    value={formData.typeContrat}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="cdi">CDI</option>
                    <option value="cdd">CDD</option>
                    <option value="stage">Stage</option>
                    <option value="alternance">Alternance</option>
                    <option value="freelance">Freelance/Mission</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="localisationPoste" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Localisation du poste *
                    </label>
                    <input
                      type="text"
                      id="localisationPoste"
                      name="localisationPoste"
                      value={formData.localisationPoste}
                      onChange={handleInputChange}
                      required
                      placeholder="Ville, télétravail possible..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="salairePropose" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Salaire proposé
                    </label>
                    <input
                      type="text"
                      id="salairePropose"
                      name="salairePropose"
                      value={formData.salairePropose}
                      onChange={handleInputChange}
                      placeholder="Ex: 25-30k€, À négocier..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="formationsCiblees" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Formations CIP FARO ciblées *
                  </label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '0.5rem',
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {[
                      'Conseil en insertion professionnelle (CIP)',
                      'Formateur professionnel d\'adultes (FPA)', 
                      'Responsable d\'Espace de Médiation Numérique',
                      'Conseiller en médiation digitale et de l\'IA',
                      'Concevoir et développer un projet entrepreneurial',
                      'Je deviens chef d\'entreprise',
                      'Excel pour Créateurs d\'Entreprise',
                      'Microsoft Teams',
                      'Découverte de l\'IA',
                      'Marketing Digital',
                      'Digitalisation d\'entreprise',
                      'Techniques de l\'Image et du Son'
                    ].map((formation) => (
                      <label key={formation} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                        <input
                          type="checkbox"
                          value={formation}
                          checked={formData.formationsCiblees.includes(formation)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              formationsCiblees: e.target.checked 
                                ? [...prev.formationsCiblees, value]
                                : prev.formationsCiblees.filter(f => f !== value)
                            }));
                          }}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {formation}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="competencesRecherchees" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Compétences recherchées *
                  </label>
                  <textarea
                    id="competencesRecherchees"
                    name="competencesRecherchees"
                    value={formData.competencesRecherchees}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Décrivez les compétences techniques et humaines recherchées..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="descriptionPoste" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Description du poste *
                  </label>
                  <textarea
                    id="descriptionPoste"
                    name="descriptionPoste"
                    value={formData.descriptionPoste}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Missions, responsabilités, environnement de travail..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="profilRecherche" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Profil recherché
                  </label>
                  <textarea
                    id="profilRecherche"
                    name="profilRecherche"
                    value={formData.profilRecherche}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Expérience souhaitée, qualités personnelles, conditions particulières..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Formulaire Candidat */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="prenom" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Champs communs */}
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label htmlFor="telephone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Téléphone *
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Suite du formulaire candidat */}
            {profileType === 'candidat' && (
              <>
                <div>
                  <label htmlFor="formationSouhaitee" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Formation suivie chez CIP FARO *
                  </label>
                  <select
                    id="formationSouhaitee"
                    name="formationSouhaitee"
                    value={formData.formationSouhaitee}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Choisir la formation suivie</option>
                    <optgroup label="🎓 Titres Professionnels">
                      <option value="tp-cip">Conseil en insertion professionnelle (CIP)</option>
                      <option value="tp-fpa">Formateur professionnel d'adultes (FPA)</option>
                      <option value="tp-remn">Responsable d'Espace de Médiation Numérique</option>
                      <option value="mediation-ia">Conseiller en médiation digitale et de l'IA</option>
                    </optgroup>
                    <optgroup label="💼 Entrepreneuriat & Gestion">
                      <option value="projet-entrepreneurial">Concevoir et développer un projet entrepreneurial</option>
                      <option value="chef-entreprise">Je deviens chef d'entreprise</option>
                      <option value="excel-createurs">Excel pour Créateurs d'Entreprise</option>
                    </optgroup>
                    <optgroup label="💻 Bureautique & Informatique">
                      <option value="initiation-bureautique">Initiation à la bureautique</option>
                      <option value="microsoft-teams">Maîtrisez Microsoft Teams</option>
                      <option value="certification-office">Préparation certification Microsoft Office</option>
                    </optgroup>
                    <optgroup label="🤖 Intelligence Artificielle & Digital">
                      <option value="decouverte-ia">Découverte de l'IA : informatique et algorithmes</option>
                      <option value="marketing-digital">Marketing Digital</option>
                      <option value="digitalisation-entreprise">Digitalisation d'entreprise</option>
                    </optgroup>
                    <optgroup label="🎬 Audiovisuel & Créatif">
                      <option value="image-son">Techniques de l'Image et du Son</option>
                    </optgroup>
                    <option value="autre">Autre formation CIP FARO</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="posteRecherche" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Type d'emploi recherché *
                    </label>
                    <select
                      id="posteRecherche"
                      name="posteRecherche"
                      value={formData.posteRecherche}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Sélectionner</option>
                      <option value="cdi">CDI</option>
                      <option value="cdd">CDD</option>
                      <option value="stage">Stage</option>
                      <option value="alternance">Alternance</option>
                      <option value="freelance">Freelance/Mission</option>
                      <option value="temps-partiel">Temps partiel</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="disponibilite" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Disponibilité *
                    </label>
                    <select
                      id="disponibilite"
                      name="disponibilite"
                      value={formData.disponibilite}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Sélectionner</option>
                      <option value="immédiate">Immédiate</option>
                      <option value="1-mois">Sous 1 mois</option>
                      <option value="2-mois">Sous 2 mois</option>
                      <option value="3-mois">Sous 3 mois</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Expérience professionnelle
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="débutant">Débutant / Reconversion</option>
                    <option value="0-2">0-2 ans</option>
                    <option value="2-5">2-5 ans</option>
                    <option value="5-10">5-10 ans</option>
                    <option value="10+">10+ ans</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="motivations" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Motivations et objectifs professionnels *
                  </label>
                  <textarea
                    id="motivations"
                    name="motivations"
                    value={formData.motivations}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Décrivez vos motivations, vos objectifs de carrière et ce que vous recherchez chez un employeur..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="competencesInformatiques" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Compétences principales acquises
                  </label>
                  <textarea
                    id="competencesInformatiques"
                    name="competencesInformatiques"
                    value={formData.competencesInformatiques}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Listez vos compétences techniques, logiciels maîtrisés, certifications obtenues..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="cv-upload" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    CV * (PDF, DOC, DOCX - Max 5 MB)
                  </label>
                  <input
                    type="file"
                    id="cv-upload"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                  {formData.cv && (
                    <div style={{ marginTop: '0.5rem', color: '#28a745' }}>
                      ✓ Fichier sélectionné : {formData.cv.name}
                    </div>
                  )}
                </div>
              </>
            )}



            <button
              type="submit"
              disabled={isSubmitting}
              className="btn primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Envoi en cours...' : 
                profileType === 'entreprise' ? 'Déposer mon offre d\'emploi' : 'Envoyer ma candidature'
              }
            </button>
          </form>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
              <h3>Informations importantes</h3>
              <ul style={{ lineHeight: '1.6' }}>
                <li>Tous les champs marqués d'un astérisque (*) sont obligatoires</li>
                {profileType === 'candidat' && <li>Formats acceptés pour le CV : PDF, DOC, DOCX</li>}
                {profileType === 'candidat' && <li>Taille maximum du fichier : 5 MB</li>}
                <li>Nous nous engageons à vous recontacter sous 48h</li>
                <li>Vos données sont traitées de manière confidentielle</li>
                <li>CIP FARO facilite la mise en relation mais ne garantit pas l'embauche</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}