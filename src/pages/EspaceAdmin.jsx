import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EspaceAdmin() {
  const navigate = useNavigate()
  const [cvList, setCvList] = useState([])
  const [filteredCVs, setFilteredCVs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('tous')
  const [selectedCV, setSelectedCV] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Vérification de l'authentification
  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    const userEmail = localStorage.getItem('userEmail')
    
    if (!userRole || !userEmail || userRole !== 'admin') {
      // Redirection vers la page de connexion si pas admin
      navigate('/connexion')
      return
    }
    
    setIsAuthenticated(true)
  }, [navigate])

  // Simulation des données CV (à remplacer par une vraie API)
  useEffect(() => {
    const mockCVs = [
      {
        id: 1,
        nom: 'Martin Dubois',
        email: 'martin.dubois@email.com',
        telephone: '06 12 34 56 78',
        poste: 'Développeur Web',
        fichier: 'cv_martin_dubois.pdf',
        dateDepot: '2024-01-15',
        statut: 'nouveau',
        experience: '3 ans',
        localisation: 'Paris'
      },
      {
        id: 2,
        nom: 'Sarah Laurent',
        email: 'sarah.laurent@email.com',
        telephone: '07 98 76 54 32',
        poste: 'Designer UX/UI',
        fichier: 'cv_sarah_laurent.pdf',
        dateDepot: '2024-01-14',
        statut: 'en_cours',
        experience: '5 ans',
        localisation: 'Lyon'
      },
      {
        id: 3,
        nom: 'Thomas Bernard',
        email: 'thomas.bernard@email.com',
        telephone: '06 11 22 33 44',
        poste: 'Chef de projet',
        fichier: 'cv_thomas_bernard.docx',
        dateDepot: '2024-01-13',
        statut: 'traite',
        experience: '7 ans',
        localisation: 'Marseille'
      }
    ]

    setTimeout(() => {
      setCvList(mockCVs)
      setFilteredCVs(mockCVs)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filtrage et recherche
  useEffect(() => {
    let filtered = cvList

    if (searchTerm) {
      filtered = filtered.filter(cv =>
        cv.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.poste.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'tous') {
      filtered = filtered.filter(cv => cv.statut === filterStatus)
    }

    setFilteredCVs(filtered)
  }, [searchTerm, filterStatus, cvList])

  const handleStatusChange = (cvId, newStatus) => {
    setCvList(prev => prev.map(cv =>
      cv.id === cvId ? { ...cv, statut: newStatus } : cv
    ))
  }

  const getStatusBadge = (status) => {
    const styles = {
      nouveau: { backgroundColor: '#28a745', color: 'white' },
      en_cours: { backgroundColor: '#ffc107', color: 'black' },
      traite: { backgroundColor: '#6c757d', color: 'white' }
    }

    const labels = {
      nouveau: 'Nouveau',
      en_cours: 'En cours',
      traite: 'Traité'
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

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.location.href = '/'
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
            <h1 className="h1">Espace Administrateur</h1>
            <p className="lead">Gestion des CV et candidatures</p>
          </div>
          <button onClick={handleLogout} className="btn secondary">
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#28a745' }}>{cvList.filter(cv => cv.statut === 'nouveau').length}</h3>
          <p>Nouveaux CV</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#ffc107' }}>{cvList.filter(cv => cv.statut === 'en_cours').length}</h3>
          <p>En cours de traitement</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#6c757d' }}>{cvList.filter(cv => cv.statut === 'traite').length}</h3>
          <p>Traités</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#007bff' }}>{cvList.length}</h3>
          <p>Total</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Nom, email ou poste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="tous">Tous</option>
              <option value="nouveau">Nouveau</option>
              <option value="en_cours">En cours</option>
              <option value="traite">Traité</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des CV */}
      <div className="card">
        <h2>CV reçus ({filteredCVs.length})</h2>
        
        {filteredCVs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
            Aucun CV trouvé selon les critères de recherche
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Candidat</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Poste souhaité</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Expérience</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date de dépôt</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCVs.map((cv) => (
                  <tr key={cv.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <strong>{cv.nom}</strong>
                        <br />
                        <small style={{ color: '#6c757d' }}>{cv.email}</small>
                        <br />
                        <small style={{ color: '#6c757d' }}>{cv.telephone}</small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{cv.poste}</td>
                    <td style={{ padding: '1rem' }}>{cv.experience}</td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(cv.dateDepot).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(cv.statut)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setSelectedCV(cv)}
                          className="btn primary"
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                          Voir détails
                        </button>
                        <select
                          value={cv.statut}
                          onChange={(e) => handleStatusChange(cv.id, e.target.value)}
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.25rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                          }}
                        >
                          <option value="nouveau">Nouveau</option>
                          <option value="en_cours">En cours</option>
                          <option value="traite">Traité</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedCV && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Détails de la candidature</h3>
              <button
                onClick={() => setSelectedCV(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>Nom :</strong> {selectedCV.nom}
              </div>
              <div>
                <strong>Email :</strong> {selectedCV.email}
              </div>
              <div>
                <strong>Téléphone :</strong> {selectedCV.telephone}
              </div>
              <div>
                <strong>Poste souhaité :</strong> {selectedCV.poste}
              </div>
              <div>
                <strong>Expérience :</strong> {selectedCV.experience}
              </div>
              <div>
                <strong>Localisation :</strong> {selectedCV.localisation}
              </div>
              <div>
                <strong>Date de dépôt :</strong> {new Date(selectedCV.dateDepot).toLocaleDateString('fr-FR')}
              </div>
              <div>
                <strong>Fichier CV :</strong> {selectedCV.fichier}
              </div>
              <div>
                <strong>Statut :</strong> {getStatusBadge(selectedCV.statut)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn primary">
                Télécharger CV
              </button>
              <button className="btn secondary">
                Contacter le candidat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}