import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EspaceFormateur() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [groupes, setGroupes] = useState([])
  const [stagiaires, setStagiaires] = useState([])
  const [selectedGroupe, setSelectedGroupe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Vérification de l'authentification
  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    const userEmail = localStorage.getItem('userEmail')
    
    if (!userRole || !userEmail || userRole !== 'formateur') {
      navigate('/connexion')
      return
    }
    
    setIsAuthenticated(true)
  }, [navigate])

  useEffect(() => {
    // Simulation de chargement des données
    const mockUserData = {
      nom: 'Jean Martin',
      email: 'jean.martin@cipfaro-formations.com',
      specialite: 'Développement Web',
      dateEmbauche: '2022-09-01'
    }

    const mockGroupes = [
      {
        id: 1,
        nom: 'Promo Web Dev 2024-A',
        formation: 'Développeur Web et Web Mobile',
        dateDebut: '2024-01-15',
        dateFin: '2024-07-15',
        nombreStagiaires: 12,
        statut: 'en_cours',
        prochainCours: {
          date: '2024-01-20',
          heure: '09:00',
          sujet: 'React - Composants avancés',
          duree: '3h'
        }
      },
      {
        id: 2,
        nom: 'Promo Web Dev 2023-B',
        formation: 'Développeur Web et Web Mobile',
        dateDebut: '2023-07-10',
        dateFin: '2024-01-10',
        nombreStagiaires: 8,
        statut: 'termine',
        moyenneGroupe: 16.5
      }
    ]

    const mockStagiaires = [
      {
        id: 1,
        groupeId: 1,
        nom: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        progression: 65,
        derniereConnexion: '2024-01-19',
        notes: [
          { evaluation: 'HTML/CSS', note: 18, date: '2024-01-10' },
          { evaluation: 'JavaScript', note: 16, date: '2024-01-15' }
        ],
        assiduite: 95,
        statut: 'actif'
      },
      {
        id: 2,
        groupeId: 1,
        nom: 'Pierre Laurent',
        email: 'pierre.laurent@email.com',
        progression: 72,
        derniereConnexion: '2024-01-18',
        notes: [
          { evaluation: 'HTML/CSS', note: 15, date: '2024-01-10' },
          { evaluation: 'JavaScript', note: 17, date: '2024-01-15' }
        ],
        assiduite: 88,
        statut: 'actif'
      },
      {
        id: 3,
        groupeId: 1,
        nom: 'Sophie Bernard',
        email: 'sophie.bernard@email.com',
        progression: 58,
        derniereConnexion: '2024-01-17',
        notes: [
          { evaluation: 'HTML/CSS', note: 14, date: '2024-01-10' },
          { evaluation: 'JavaScript', note: 13, date: '2024-01-15' }
        ],
        assiduite: 78,
        statut: 'attention'
      }
    ]

    setTimeout(() => {
      setUserData(mockUserData)
      setGroupes(mockGroupes)
      setStagiaires(mockStagiaires)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.location.href = '/'
  }

  const getStatusBadge = (status) => {
    const styles = {
      en_cours: { backgroundColor: '#007bff', color: 'white' },
      termine: { backgroundColor: '#28a745', color: 'white' },
      planifie: { backgroundColor: '#6c757d', color: 'white' }
    }

    const labels = {
      en_cours: 'En cours',
      termine: 'Terminé',
      planifie: 'Planifié'
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

  const getStagiaireStatusColor = (status) => {
    const colors = {
      actif: '#28a745',
      attention: '#ffc107',
      absent: '#dc3545'
    }
    return colors[status] || '#6c757d'
  }

  const getProgressColor = (progression) => {
    if (progression >= 70) return '#28a745'
    if (progression >= 50) return '#ffc107'
    return '#dc3545'
  }

  const stagiairesGroupe = selectedGroupe 
    ? stagiaires.filter(s => s.groupeId === selectedGroupe.id)
    : []

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
            <h1 className="h1">Espace Formateur</h1>
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
            <strong>Spécialité :</strong> {userData.specialite}
          </div>
          <div>
            <strong>Depuis le :</strong> {new Date(userData.dateEmbauche).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Mes groupes */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Mes groupes de formation</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {groupes.map((groupe) => (
            <div key={groupe.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: selectedGroupe?.id === groupe.id ? '#e7f3ff' : 'white'
            }}
            onClick={() => setSelectedGroupe(groupe)}
            onMouseEnter={(e) => {
              if (selectedGroupe?.id !== groupe.id) {
                e.target.style.backgroundColor = '#f8f9fa'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedGroupe?.id !== groupe.id) {
                e.target.style.backgroundColor = 'white'
              }
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{groupe.nom}</h3>
                  <p style={{ margin: '0', color: '#6c757d' }}>
                    {groupe.formation}
                  </p>
                </div>
                {getStatusBadge(groupe.statut)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <strong>Début :</strong> {new Date(groupe.dateDebut).toLocaleDateString('fr-FR')}
                </div>
                <div>
                  <strong>Fin :</strong> {new Date(groupe.dateFin).toLocaleDateString('fr-FR')}
                </div>
                <div>
                  <strong>Stagiaires :</strong> {groupe.nombreStagiaires}
                </div>
                {groupe.moyenneGroupe && (
                  <div>
                    <strong>Moyenne :</strong> {groupe.moyenneGroupe}/20
                  </div>
                )}
              </div>

              {groupe.prochainCours && groupe.statut === 'en_cours' && (
                <div style={{
                  backgroundColor: '#d4edda',
                  padding: '1rem',
                  borderRadius: '4px'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#155724' }}>Prochain cours</h4>
                  <p style={{ margin: 0 }}>
                    📅 {new Date(groupe.prochainCours.date).toLocaleDateString('fr-FR')} à {groupe.prochainCours.heure}
                    <br />
                    📚 {groupe.prochainCours.sujet} ({groupe.prochainCours.duree})
                  </p>
                </div>
              )}

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <small style={{ color: '#6c757d' }}>
                  Cliquez pour voir les détails des stagiaires
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Détails du groupe sélectionné */}
      {selectedGroupe && (
        <div className="card">
          <h2>Stagiaires - {selectedGroupe.nom}</h2>
          
          {/* Statistiques du groupe */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0', color: '#007bff' }}>{stagiairesGroupe.length}</h4>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>Stagiaires</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0', color: '#28a745' }}>
                {stagiairesGroupe.filter(s => s.statut === 'actif').length}
              </h4>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>Actifs</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0', color: '#ffc107' }}>
                {stagiairesGroupe.filter(s => s.statut === 'attention').length}
              </h4>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>Attention</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0', color: '#007bff' }}>
                {Math.round(stagiairesGroupe.reduce((acc, s) => acc + s.progression, 0) / stagiairesGroupe.length)}%
              </h4>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>Progression moy.</p>
            </div>
          </div>

          {/* Liste des stagiaires */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {stagiairesGroupe.map((stagiaire) => (
              <div key={stagiaire.id} style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '1rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0 }}>{stagiaire.nom}</h4>
                      <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getStagiaireStatusColor(stagiaire.statut)
                      }} />
                    </div>
                    <p style={{ margin: '0 0 1rem 0', color: '#6c757d' }}>
                      {stagiaire.email} • Dernière connexion : {new Date(stagiaire.derniereConnexion).toLocaleDateString('fr-FR')}
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong>Progression :</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <div style={{
                            width: '100px',
                            height: '6px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${stagiaire.progression}%`,
                              height: '100%',
                              backgroundColor: getProgressColor(stagiaire.progression)
                            }} />
                          </div>
                          <span style={{ fontSize: '0.9rem' }}>{stagiaire.progression}%</span>
                        </div>
                      </div>
                      <div>
                        <strong>Assiduité :</strong> {stagiaire.assiduite}%
                      </div>
                    </div>

                    {stagiaire.notes.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Dernières notes :</strong>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          {stagiaire.notes.map((note, index) => (
                            <span key={index} style={{
                              fontSize: '0.9rem',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '4px'
                            }}>
                              {note.evaluation}: {note.note}/20
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button className="btn primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                      Contacter
                    </button>
                    <button className="btn secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                      Voir profil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stagiairesGroupe.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
              Aucun stagiaire dans ce groupe
            </p>
          )}
        </div>
      )}

      {/* Actions rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>🎓 Plateforme Moodle</h3>
          <p>Accédez à la plateforme e-learning pour gérer vos cours</p>
          <a href="https://cipfaro.org" target="_blank" rel="noopener noreferrer" className="btn primary" style={{ backgroundColor: '#e67e22', borderColor: '#e67e22' }}>
            Accéder à Moodle
          </a>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>📚 Ressources</h3>
          <p>Accédez aux supports de cours et ressources pédagogiques</p>
          <button className="btn secondary">Voir ressources</button>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>📝 Évaluations</h3>
          <p>Créer et gérer les évaluations de vos groupes</p>
          <button className="btn primary">Gérer évaluations</button>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>📊 Rapports</h3>
          <p>Générer des rapports de progression et d'assiduité</p>
          <button className="btn secondary">Générer rapport</button>
        </div>
      </div>
    </div>
  )
}