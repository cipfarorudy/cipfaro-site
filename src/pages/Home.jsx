export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-text">
            <h1 className="h1">CIP FARO Rudy</h1>
            <p className="lead" style={{ maxWidth: 720 }}>
              Centre de formation spécialisé dans l'insertion professionnelle et l'accompagnement des publics. Formations certifiantes, accompagnement individualisé et conseils pour le financement.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <a href="/preinscription" className="btn">S'inscrire</a>
              <a href="/devis" className="btn secondary">Demander un devis</a>
              <a href="/assets/certificat-B04066-2025-03-30.pdf" className="btn" target="_blank" rel="noopener noreferrer" download="certificat-B04066-2025-03-30.pdf">Télécharger le certificat</a>
            </div>
          </div>
          <div className="hero-visual">
            {/* Certificat Qualiopi Actions de formation */}
            <img src="/assets/Qualiopi Actions de formation.JPG" alt="Certificat Qualiopi Actions de formation" style={{ maxWidth: 320 }} loading="lazy" width="320" height="160" />
          </div>
        </div>
      </section>

  <div className="grid">
        <div className="card">
          <h2>Formations certifiantes</h2>
          <p>
            Découvrez nos formations reconnues par l'État et inscrites au RNCP, 
            conçues pour répondre aux besoins du marché de l'emploi.
          </p>
          <a href="/formations" className="btn primary">
            Voir nos formations
          </a>
        </div>

        <div className="card">
          <h2>Accompagnement</h2>
          <p>
            Bénéficiez d'un accompagnement personnalisé tout au long de votre parcours 
            de formation et d'insertion professionnelle.
          </p>
          <a href="/contact" className="btn">
            Nous contacter
          </a>
        </div>

        <div className="card">
          <h2>Financement</h2>
          <p>
            Explorez les différentes solutions de financement disponibles 
            pour votre projet de formation professionnelle.
          </p>
          <a href="/financements" className="btn">
            Solutions de financement
          </a>
        </div>
      </div>

      <section className="card" style={{ marginTop: '3rem', background: '#f8fafc' }}>
        <h2>Nos engagements qualité</h2>
        <div className="grid">
          <div>
            <h3>Certification Qualiopi</h3>
            <p className="muted">
              Notre centre est certifié Qualiopi, gage de qualité 
              de nos actions de formation.
            </p>
          </div>
          <div>
            <h3>Accessibilité</h3>
            <p className="muted">
              Nos locaux sont accessibles aux personnes en situation de handicap 
              et nous adaptons nos formations selon vos besoins.
            </p>
          </div>
          <div>
            <h3>Suivi personnalisé</h3>
            <p className="muted">
              Chaque apprenant bénéficie d'un suivi individualisé 
              pour maximiser ses chances de réussite.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}