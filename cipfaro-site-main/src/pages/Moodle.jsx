import { useEffect } from 'react'

export default function Moodle() {
  // Redirection automatique après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://cipfaro.org'
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="h1">Redirection vers votre plateforme e-learning</h1>
        <p className="lead">
          Vous allez être redirigé vers la plateforme Moodle de CIP FARO Rudy...
        </p>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h2>🎓 Plateforme E-Learning Moodle</h2>
        <p>
          Accédez à tous vos cours en ligne, supports pédagogiques, exercices et évaluations 
          sur notre plateforme Moodle sécurisée.
        </p>
        
        <div style={{ margin: '2rem 0' }}>
          <a 
            href={import.meta.env.VITE_MOODLE_URL || "https://moodle.cipfaro-formations.com"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn primary"
            style={{ 
              backgroundColor: '#e67e22', 
              borderColor: '#e67e22',
              fontSize: '1.2rem',
              padding: '1rem 2rem'
            }}
          >
            🎓 Accéder à Moodle CIP FARO
          </a>
        </div>

        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginTop: '2rem' 
        }}>
          <h3>Fonctionnalités disponibles :</h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            textAlign: 'left'
          }}>
            <li>📚 Cours interactifs</li>
            <li>📝 Exercices pratiques</li>
            <li>🎯 Évaluations en ligne</li>
            <li>💬 Forums de discussion</li>
            <li>📊 Suivi de progression</li>
            <li>📱 Accès mobile</li>
            <li>🔒 Environnement sécurisé</li>
            <li>⏰ Disponible 24h/24</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <p style={{ color: '#6c757d' }}>
            <strong>Problème de connexion ?</strong><br />
            Contactez notre support technique : 
            <a href="mailto:secretariat@cipfaro-formations.com" style={{ color: '#007bff' }}>
              secretariat@cipfaro-formations.com
            </a>
          </p>
        </div>


      </div>
    </div>
  )
}