export default function Financements() {
  return (
    <article className="card">
      <h1>Financements</h1>
      
      {/* Section CPF avec liens directs */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#2c5282', marginBottom: '1rem' }}>💳 CPF — Mon Compte Formation</h2>
        <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
          Nos formations sont éligibles au CPF. Inscrivez-vous directement sur votre compte formation :
        </p>
        <div style={{ 
          backgroundColor: '#f7fafc', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          marginBottom: '1rem'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>🎯 Formations disponibles :</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#2d3748' }}>
              📚 Formation Professionnelle Adulte 2025
            </h4>
            <a 
              href="https://www.moncompteformation.gouv.fr/espace-prive/html/#/formation/recherche/42916872700080_FPA2025/42916872700080_FPA202504"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#3182ce',
                color: 'white',
                padding: '0.75rem 1.5rem',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
            >
              🚀 S'inscrire avec mon CPF
            </a>
          </div>

          <div>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#2d3748' }}>
              💻 Titre Professionnel CIP (TPCIP37274)
            </h4>
            <a 
              href="https://www.moncompteformation.gouv.fr/espace-prive/html/#/formation/recherche/42916872700080_TPCIP37274/42916872700080_TPCIP37274"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#38a169',
                color: 'white',
                padding: '0.75rem 1.5rem',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2f855a'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#38a169'}
            >
              🎯 S'inscrire avec mon CPF
            </a>
          </div>
        </div>
        
        <p style={{ fontSize: '0.9rem', color: '#718096', fontStyle: 'italic' }}>
          💡 <strong>Astuce :</strong> Vérifiez votre solde CPF avant l'inscription et contactez-nous pour un accompagnement personnalisé.
        </p>
      </div>

      {/* Section France Travail */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#2c5282', marginBottom: '1rem' }}>🔍 France Travail — Formations disponibles</h2>
        <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
          Nos formations sont référencées sur la plateforme officielle France Travail. 
          Consultez directement les sessions disponibles et les taux de retour à l'emploi :
        </p>
        
        <div style={{ 
          backgroundColor: '#f0f8ff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          border: '1px solid #bee3f8',
          marginBottom: '1rem'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            📊 Formations actuellement disponibles :
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1rem', 
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#2d3748' }}>
                🎯 Conseil en insertion professionnelle
              </h4>
              <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                <span style={{ fontWeight: 'bold' }}>1503 heures</span> • 
                Début : <strong>05/01/2026</strong> • 
                Taux retour emploi : <span style={{ color: '#38a169', fontWeight: 'bold' }}>50%</span>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '1rem', 
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#2d3748' }}>
                📊 Excel pour Créateurs d'Entreprise
              </h4>
              <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                <span style={{ fontWeight: 'bold' }}>275h et 230h</span> • 
                Sessions : <strong>En cours</strong> • 
                Taux retour emploi : <span style={{ color: '#f56500', fontWeight: 'bold' }}>22%</span>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '1rem', 
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#2d3748' }}>
                🤖 Découverte de l'IA : informatique et algorithmes
              </h4>
              <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                <span style={{ fontWeight: 'bold' }}>8 heures</span> • 
                Début : <strong>14/04/2025</strong> • 
                Taux retour emploi : <span style={{ color: '#38a169', fontWeight: 'bold' }}>56%</span>
              </div>
            </div>
          </div>

          <a 
            href="https://candidat.francetravail.fr/formations/recherche?filtreEstFormationEnCoursOuAVenir=formEnCours&filtreEstFormationTerminee=formEnCours&ou=COMMUNE-97101&quoi=cip+faro&range=0-9&tri=0"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: '#1a365d',
              color: 'white',
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1a365d'}
          >
            🔗 Voir toutes nos formations sur France Travail
          </a>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#718096', fontStyle: 'italic' }}>
          💼 <strong>Avantage :</strong> Formations financées par France Travail selon votre situation 
          (demandeur d'emploi, reconversion, etc.)
        </p>
      </div>

      {/* Autres financements */}
      <div>
        <h2 style={{ color: '#2c5282', marginBottom: '1rem' }}>🏢 Autres modes de financement</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>OPCO</strong> (selon branche professionnelle)</li>
          <li><strong>France Travail / Région</strong> (selon dispositif)</li>
          <li><strong>Financement personnel / Entreprise</strong></li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#e6fffa', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginTop: '2rem',
        border: '1px solid #81e6d9'
      }}>
        <h3 style={{ marginTop: 0, color: '#285e61' }}>🤝 Notre accompagnement</h3>
        <p style={{ margin: 0, color: '#2c7a7b' }}>
          Nous vous accompagnons pour le montage du dossier : devis personnalisé, 
          programme détaillé, attestations et conseils pour optimiser votre financement.
        </p>
      </div>
    </article>
  )
}