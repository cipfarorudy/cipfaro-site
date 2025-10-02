// Tableau de bord avancé CIP FARO
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'
import { formations } from '../data/formations'

export default function Dashboard() {
  const [stats, setStats] = useState({
    formations: {
      total: formations.length,
      populaires: [],
      taux_completion: 0
    },
    recrutement: {
      candidatures: 0,
      offres: 0,
      matchings: 0,
      taux_matching: 0
    },
    visiteurs: {
      total_today: 0,
      total_month: 0,
      pages_populaires: [],
      taux_conversion: 0
    },
    notifications: []
  })

  const [selectedPeriod, setSelectedPeriod] = useState('7j') // 24h, 7j, 30j

  // Simulation de données (à remplacer par de vraies données)
  useEffect(() => {
    // Simuler le chargement des statistiques
    const loadStats = async () => {
      // Données simulées basées sur les formations réelles
      const statsData = {
        formations: {
          total: formations.length,
          populaires: formations
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
            .map(f => ({
              titre: f.titre,
              vues: Math.floor(Math.random() * 500) + 50,
              inscriptions: Math.floor(Math.random() * 30) + 5
            })),
          taux_completion: 87.5
        },
        recrutement: {
          candidatures: Math.floor(Math.random() * 150) + 200,
          offres: Math.floor(Math.random() * 50) + 75,
          matchings: Math.floor(Math.random() * 80) + 120,
          taux_matching: 78.3
        },
        visiteurs: {
          total_today: Math.floor(Math.random() * 200) + 150,
          total_month: Math.floor(Math.random() * 5000) + 8000,
          pages_populaires: [
            { page: 'Formations', vues: Math.floor(Math.random() * 1000) + 500 },
            { page: 'Recrutement', vues: Math.floor(Math.random() * 800) + 300 },
            { page: 'Accueil', vues: Math.floor(Math.random() * 1200) + 800 },
            { page: 'Contact', vues: Math.floor(Math.random() * 400) + 200 },
            { page: 'Financement', vues: Math.floor(Math.random() * 600) + 250 }
          ],
          taux_conversion: 12.8
        },
        notifications: [
          {
            id: 1,
            type: 'success',
            titre: 'Nouveau matching réussi',
            message: 'Un candidat formé en "Développement Web" a été mis en relation avec "TechCorp Guadeloupe"',
            date: new Date(Date.now() - 1000 * 60 * 30) // il y a 30 min
          },
          {
            id: 2,
            type: 'info',
            titre: 'Nouvelle candidature',
            message: 'Candidature reçue pour la formation "Bureautique Avancée"',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2) // il y a 2h
          },
          {
            id: 3,
            type: 'warning',
            titre: 'Formation bientôt complète',
            message: 'La formation "Excel Perfectionnement" n\'a plus que 2 places disponibles',
            date: new Date(Date.now() - 1000 * 60 * 60 * 4) // il y a 4h
          }
        ]
      }
      setStats(statsData)
    }

    loadStats()
  }, [selectedPeriod])

  const formatDate = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  }

  const handleExportData = () => {
    trackEvent('admin', 'export_data', 'dashboard')
    // Simuler l'export des données
    const dataToExport = {
      date: new Date().toISOString(),
      periode: selectedPeriod,
      stats: stats
    }
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cipfaro-stats-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="dashboard">
      <style>{`
        .dashboard {
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          color: white;
        }
        .dashboard-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0;
        }
        .dashboard-actions {
          display: flex;
          gap: 1rem;
        }
        .period-selector {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          color: white;
        }
        .export-btn {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-weight: 500;
        }
        .export-btn:hover {
          background: #059669;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: rgba(255,255,255,0.95);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-left: 4px solid #3b82f6;
        }
        .stat-card.success { border-left-color: #10b981; }
        .stat-card.warning { border-left-color: #f59e0b; }
        .stat-card.info { border-left-color: #8b5cf6; }
        .stat-card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          color: #1f2937;
        }
        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }
        .stat-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .stat-list li {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .stat-list li:last-child {
          border-bottom: none;
        }
        .notifications-section {
          background: rgba(255,255,255,0.95);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .notification {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          border-left: 4px solid #3b82f6;
        }
        .notification.success { 
          background: #ecfdf5; 
          border-left-color: #10b981; 
        }
        .notification.warning { 
          background: #fffbeb; 
          border-left-color: #f59e0b; 
        }
        .notification.info { 
          background: #f3f4f6; 
          border-left-color: #6b7280; 
        }
        .notification-icon {
          font-size: 1.5rem;
        }
        .notification-content h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #1f2937;
        }
        .notification-content p {
          margin: 0 0 0.5rem 0;
          color: #6b7280;
          font-size: 0.875rem;
        }
        .notification-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .action-card {
          background: rgba(255,255,255,0.95);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          text-decoration: none;
          color: #1f2937;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .action-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          display: block;
        }
      `}</style>

      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Tableau de bord CIP FARO</h1>
        <div className="dashboard-actions">
          <select 
            className="period-selector"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="24h">Dernières 24h</option>
            <option value="7j">7 derniers jours</option>
            <option value="30j">30 derniers jours</option>
          </select>
          <button className="export-btn" onClick={handleExportData}>
            📊 Exporter les données
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>📚 Formations</h3>
          <div className="stat-number">{stats.formations.total}</div>
          <div className="stat-label">Formations disponibles</div>
          <div style={{marginTop: '1rem'}}>
            <strong>Taux de completion:</strong> {stats.formations.taux_completion}%
          </div>
        </div>

        <div className="stat-card success">
          <h3>🎯 Recrutement</h3>
          <div className="stat-number">{stats.recrutement.matchings}</div>
          <div className="stat-label">Matchings réussis</div>
          <div style={{marginTop: '1rem'}}>
            <div>Candidatures: <strong>{stats.recrutement.candidatures}</strong></div>
            <div>Offres: <strong>{stats.recrutement.offres}</strong></div>
            <div>Taux de matching: <strong>{stats.recrutement.taux_matching}%</strong></div>
          </div>
        </div>

        <div className="stat-card info">
          <h3>👥 Visiteurs</h3>
          <div className="stat-number">{stats.visiteurs.total_today}</div>
          <div className="stat-label">Visiteurs aujourd'hui</div>
          <div style={{marginTop: '1rem'}}>
            <div>Ce mois: <strong>{stats.visiteurs.total_month.toLocaleString()}</strong></div>
            <div>Taux de conversion: <strong>{stats.visiteurs.taux_conversion}%</strong></div>
          </div>
        </div>

        <div className="stat-card">
          <h3>🔥 Formations populaires</h3>
          <ul className="stat-list">
            {stats.formations.populaires.map((formation, index) => (
              <li key={index}>
                <span>{formation.titre}</span>
                <span><strong>{formation.vues}</strong> vues</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="stat-card">
          <h3>📈 Pages populaires</h3>
          <ul className="stat-list">
            {stats.visiteurs.pages_populaires.map((page, index) => (
              <li key={index}>
                <span>{page.page}</span>
                <span><strong>{page.vues}</strong> vues</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="notifications-section">
        <h3>🔔 Notifications récentes</h3>
        {stats.notifications.map((notification) => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            <span className="notification-icon">
              {notification.type === 'success' ? '✅' : 
               notification.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <div className="notification-content">
              <h4>{notification.titre}</h4>
              <p>{notification.message}</p>
              <div className="notification-time">{formatDate(notification.date)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <Link to="/formations" className="action-card">
          <span className="action-icon">📚</span>
          <div>Gérer les formations</div>
        </Link>
        <Link to="/recrutement" className="action-card">
          <span className="action-icon">🎯</span>
          <div>Espace recrutement</div>
        </Link>
        <Link to="/contact" className="action-card">
          <span className="action-icon">📞</span>
          <div>Messages & contacts</div>
        </Link>
        <Link to="/sitemap" className="action-card">
          <span className="action-icon">🗺️</span>
          <div>Outils SEO</div>
        </Link>
        <a 
          href="https://analytics.google.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="action-card"
        >
          <span className="action-icon">📊</span>
          <div>Google Analytics</div>
        </a>
        <a 
          href="https://search.google.com/search-console" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="action-card"
        >
          <span className="action-icon">🔍</span>
          <div>Search Console</div>
        </a>
      </div>
    </div>
  )
}