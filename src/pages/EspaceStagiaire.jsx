import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EspaceStagiaire() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [formations, setFormations] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Vérification de l'authentification
  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    const userEmail = localStorage.getItem('userEmail')
    
    if (!userRole || !userEmail || userRole !== 'stagiaire') {
      navigate('/connexion')
      return
    }
    
    setIsAuthenticated(true)
  }, [navigate])

  useEffect(() => {
    // Simulation de chargement des données utilisateur
    const mockUserData = {
      nom: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      promotion: '2024-Web-Dev',
      dateInscription: '2024-01-10',
      statut: 'en_formation'
    }

    const mockFormations = [
      {
        id: 1,
        titre: 'Développeur Web et Web Mobile',
        progression: 65,
        duree: '6 mois',
        dateDebut: '2024-01-15',
        dateFin: '2024-07-15',
        formateur: 'Jean Martin',
        statut: 'en_cours',
        prochaineCours: {
          date: '2024-01-20',
          heure: '09:00',
          sujet: 'React - Composants avancés'
        }
      },
      {
        id: 2,
        titre: 'JavaScript Avancé',
        progression: 100,
        duree: '2 mois',
        dateDebut: '2023-11-01',
        dateFin: '2023-12-31',
        formateur: 'Sophie Laurent',
        statut: 'termine',
        note: 'A - 18/20'
      }
    ]

    const mockDocuments = [
      {
        id: 1,
        nom: 'Convention de stage',
        type: 'PDF',
        taille: '245 KB',
        dateAjout: '2024-01-10',
        categorie: 'administratif'
      },
      {
        id: 2,
        nom: 'Planning formation Web Dev',
        type: 'PDF',
        taille: '156 KB',
        dateAjout: '2024-01-12',
        categorie: 'formation'
      },
      {
        id: 3,
        nom: 'Supports de cours React',
        type: 'ZIP',
        taille: '2.1 MB',
        dateAjout: '2024-01-15',
        categorie: 'cours'
      },
      {
        id: 4,
        nom: 'Évaluation JS - Correction',
        type: 'PDF',
        taille: '89 KB',
        dateAjout: '2024-01-18',
        categorie: 'evaluation'
      }
    ]

    setTimeout(() => {
      setUserData(mockUserData)
      setFormations(mockFormations)
      setDocuments(mockDocuments)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.location.href = '/'
  }

  const getProgressColor = (progression) => {
    if (progression >= 80) return '#28a745'
    if (progression >= 60) return '#ffc107'
    return '#dc3545'
  }

  const getStatusBadge = (status) => {
    const styles = {
      en_cours: { backgroundColor: '#007bff', color: 'white' },
      termine: { backgroundColor: '#28a745', color: 'white' },
      en_attente: { backgroundColor: '#6c757d', color: 'white' }
    }

    const labels = {
      en_cours: 'En cours',
      termine: 'Terminé',
      en_attente: 'En attente'
    }

    return (
      <span style={{
        ...styles[status],
        padding: '0.25rem 0.5rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
      }}>
        {labels[status]}
      </span>
    )
  }

  const getCategoryIcon = (categorie) => {
    const icons = {
      administratif: '📋',
      formation: '📚',
      cours: '💻',
      evaluation: '📝'
    }
    return icons[categorie] || '📄'
  }

  // Vérification de l'authentification avant affichage
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Redirection vers la connexion...</h2>
        <p>Vérification de vos droits d'accès...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Chargement...</h2>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="hero-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="h1">Espace Stagiaire</h1>
            <p className="lead">Bonjour {userData.nom} !</p>
          </div>
          <button onClick={handleLogout} className="btn secondary">
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Mes informations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>Nom :</strong> {userData.nom}
          </div>
          <div>
            <strong>Email :</strong> {userData.email}
          </div>
          <div>
            <strong>Promotion :</strong> {userData.promotion}
          </div>
          <div>
            <strong>Date d'inscription :</strong> {new Date(userData.dateInscription).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Mes formations */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Mes formations</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {formations.map((formation) => (
            <div key={formation.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{formation.titre}</h3>
                  <p style={{ margin: '0', color: '#6c757d' }}>
                    Formateur : {formation.formateur} • Durée : {formation.duree}
                  </p>
                </div>
                {getStatusBadge(formation.statut)}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Progression</span>
                  <span style={{ fontWeight: 'bold' }}>{formation.progression}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${formation.progression}%`,
                    height: '100%',
                    backgroundColor: getProgressColor(formation.progression),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Début :</strong> {new Date(formation.dateDebut).toLocaleDateString('fr-FR')}
                </div>
                <div>
                  <strong>Fin :</strong> {new Date(formation.dateFin).toLocaleDateString('fr-FR')}
                </div>
                {formation.note && (
                  <div>
                    <strong>Note :</strong> {formation.note}
                  </div>
                )}
              </div>

              {formation.prochaineCours && (
                <div style={{
                  backgroundColor: '#e7f3ff',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginTop: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>Prochain cours</h4>
                  <p style={{ margin: 0 }}>
                    📅 {new Date(formation.prochaineCours.date).toLocaleDateString('fr-FR')} à {formation.prochaineCours.heure}
                    <br />
                    📚 {formation.prochaineCours.sujet}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mes documents */}
      <div className="card">
        <h2>Mes documents</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {documents.map((doc) => (
            <div key={doc.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {getCategoryIcon(doc.categorie)}
                </span>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{doc.nom}</h4>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>
                    {doc.type} • {doc.taille} • Ajouté le {new Date(doc.dateAjout).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <button className="btn primary" style={{ fontSize: '0.9rem' }}>
                Télécharger
              </button>
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
            Aucun document disponible pour le moment
          </p>
        )}
      </div>

      {/* Actions rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>🎓 Mes cours</h3>
          <p>Accédez à votre plateforme e-learning pour suivre vos cours en ligne</p>
          <a href="https://cipfaro.org" target="_blank" rel="noopener noreferrer" className="btn primary" style={{ backgroundColor: '#e67e22', borderColor: '#e67e22' }}>
            Accéder à Moodle
          </a>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>📞 Contact</h3>
          <p>Besoin d'aide ? Contactez votre formateur ou l'administration</p>
          <button className="btn secondary">Nous contacter</button>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>💼 Mon CV</h3>
          <p>Mettre à jour votre CV dans l'espace recrutement</p>
          <button className="btn primary" onClick={() => window.location.href = '/recrutement'}>
            Gérer mon CV
          </button>
        </div>
      </div>
    </div>
  )
}