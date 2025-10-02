import { useState } from 'react'

export default function Recrutement() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    posteRecherche: '',
    experience: '',
    disponibilite: '',
    cv: null
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

    // Validation
    if (!formData.prenom || !formData.nom || !formData.email || !formData.cv) {
      setMessage('Veuillez remplir tous les champs obligatoires et joindre votre CV')
      setIsSubmitting(false)
      return
    }

    try {
      // Simulation d'envoi (à remplacer par une vraie API)
      // const formDataToSend = new FormData()
      // Object.keys(formData).forEach(key => {
      //   formDataToSend.append(key, formData[key])
      // })
      
      // Simulation d'attente
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMessage('Votre candidature a été envoyée avec succès ! Nous vous recontacterons sous 48h.')
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        posteRecherche: '',
        experience: '',
        disponibilite: '',
        cv: null
      })
      
      // Reset du champ fichier
      const fileInput = document.getElementById('cv-upload')
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer plus tard.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="h1">Espace Recrutement</h1>
        <p className="lead">
          Rejoignez notre équipe ! Déposez votre candidature en remplissant le formulaire ci-dessous.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2>Formulaire de candidature</h2>
          
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
                Téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
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
              <label htmlFor="posteRecherche" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Poste recherché
              </label>
              <select
                id="posteRecherche"
                name="posteRecherche"
                value={formData.posteRecherche}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Sélectionner un poste</option>
                <option value="formateur">Formateur</option>
                <option value="assistant-formation">Assistant de formation</option>
                <option value="coordinateur">Coordinateur pédagogique</option>
                <option value="secretariat">Secrétariat</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="experience" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Expérience (années)
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
                <option value="0-1">0-1 an</option>
                <option value="2-5">2-5 ans</option>
                <option value="5-10">5-10 ans</option>
                <option value="10+">10+ ans</option>
              </select>
            </div>

            <div>
              <label htmlFor="disponibilite" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Disponibilité
              </label>
              <select
                id="disponibilite"
                name="disponibilite"
                value={formData.disponibilite}
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
                <option value="immédiate">Immédiate</option>
                <option value="1-mois">Sous 1 mois</option>
                <option value="2-mois">Sous 2 mois</option>
                <option value="3-mois">Sous 3 mois</option>
              </select>
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
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </button>
          </form>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Informations importantes</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li>Tous les champs marqués d'un astérisque (*) sont obligatoires</li>
            <li>Formats acceptés pour le CV : PDF, DOC, DOCX</li>
            <li>Taille maximum du fichier : 5 MB</li>
            <li>Nous nous engageons à vous recontacter sous 48h</li>
            <li>Vos données sont traitées de manière confidentielle</li>
          </ul>
        </div>
      </div>
    </div>
  )
}