import { Link } from 'react-router-dom'
import { formations } from '../data/formations'
import { useSEO, seoConfig } from '../utils/seo'
import { trackFormationView } from '../utils/analytics'

export default function Formations() {
  // SEO optimisé pour la page formations
  useSEO(seoConfig.formations)
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

      {/* Lien vers France Travail */}
      <div style={{ 
        backgroundColor: '#f0f8ff', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        border: '1px solid #bee3f8',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a365d' }}>🔍 Formations financées</h2>
        <p style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>
          Découvrez nos formations disponibles sur France Travail avec financement possible
        </p>
        <a 
          href="https://candidat.francetravail.fr/formations/recherche?filtreEstFormationEnCoursOuAVenir=formEnCours&filtreEstFormationTerminee=formEnCours&ou=COMMUNE-97101&quoi=cip+faro&range=0-9&tri=0"
          target="_blank" 
          rel="noopener noreferrer"
          className="btn"
          style={{ 
            backgroundColor: '#1a365d', 
            color: 'white',
            border: '2px solid #1a365d'
          }}
        >
          📋 Voir nos formations sur France Travail
        </a>
      </div>

      <div className="grid" style={{marginTop:'1rem'}}>
        {formations.map(f => (
          <article key={f.slug} className="card">
            <h2>{f.titre}</h2>
            <p><strong>Durée :</strong> {f.duree}</p>
            <p><strong>Modalités :</strong> {f.modalites}</p>
            {f.code_officiel && (
              <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                <strong>Code :</strong> {f.code_officiel}
              </p>
            )}
            <Link className="btn" to={`/formations/${f.slug}`}>Consulter</Link>
          </article>
        ))}
      </div>
    </>
  )
}