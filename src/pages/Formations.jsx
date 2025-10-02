import { Link } from 'react-router-dom'
import { formations } from '../data/formations'

export default function Formations() {
  return (
    <>
      <h1>Nos formations</h1>
      
      {/* Bouton d'accès à la plateforme */}
      <div style={{ 
        backgroundColor: '#e67e22', 
        color: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        textAlign: 'center', 
        marginBottom: '2rem' 
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>🎓 Déjà inscrit ?</h2>
        <p style={{ margin: '0 0 1rem 0' }}>
          Accédez directement à votre plateforme e-learning Moodle pour suivre vos cours
        </p>
        <a 
          href="https://cipfaro.org" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn"
          style={{ 
            backgroundColor: 'white', 
            color: '#e67e22',
            border: '2px solid white'
          }}
        >
          Accéder à vos cours sur cipfaro.org
        </a>
      </div>

      <div className="grid" style={{marginTop:'1rem'}}>
        {formations.map(f => (
          <article key={f.slug} className="card">
            <h2>{f.titre}</h2>
            <p><strong>Durée :</strong> {f.duree}</p>
            <p><strong>Modalités :</strong> {f.modalites}</p>
            <Link className="btn" to={`/formations/${f.slug}`}>Consulter</Link>
          </article>
        ))}
      </div>
    </>
  )
}