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