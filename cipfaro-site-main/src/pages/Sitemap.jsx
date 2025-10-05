import React from 'react'

export default function Sitemap() {
  // Génération automatique du sitemap XML
  const baseUrl = 'https://cipfaro-formations.com'
  
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/formations', priority: '0.9', changefreq: 'weekly' },
    { url: '/preinscription', priority: '0.8', changefreq: 'monthly' },
    { url: '/recrutement', priority: '0.8', changefreq: 'weekly' },
    { url: '/devis', priority: '0.7', changefreq: 'monthly' },
    { url: '/financements', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/indicateurs', priority: '0.5', changefreq: 'monthly' },
    { url: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
    { url: '/politique-confidentialite', priority: '0.3', changefreq: 'yearly' },
    { url: '/cgv', priority: '0.3', changefreq: 'yearly' },
    { url: '/accessibilite', priority: '0.3', changefreq: 'yearly' }
  ]
  
  // Formations individuelles (import dynamique si nécessaire)
  const formations = [
    'tp-conseiller-insertion-professionnelle',
    'tp-formateur-professionnel-adultes', 
    'tp-responsable-espace-mediation-numerique',
    'conseiller-mediation-digitale-ia',
    'concevoir-developper-projet-entrepreneurial',
    'devenir-chef-entreprise',
    'excel-createurs-entreprise',
    'maitrisez-microsoft-teams',
    'decouverte-ia-informatique-algorithmes',
    'marketing-digital',
    'digitalisation-entreprise',
    'techniques-image-son'
  ]
  
  formations.forEach(slug => {
    pages.push({
      url: `/formations/${slug}`,
      priority: '0.8',
      changefreq: 'monthly'
    })
  })

  const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`
    
    return sitemap
  }

  const downloadSitemap = () => {
    const sitemap = generateSitemap()
    const blob = new Blob([sitemap], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sitemap.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="h1">Plan du site CIP FARO</h1>
        <p className="lead">
          Découvrez toutes les pages et ressources disponibles sur notre plateforme de formation.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2>📋 Pages principales</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pages.filter(p => !p.url.includes('/formations/')).map((page, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem',
                border: '1px solid #eee',
                borderRadius: '4px'
              }}>
                <a href={page.url} style={{ textDecoration: 'none', color: '#007bff' }}>
                  {baseUrl}{page.url}
                </a>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  Priorité: {page.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>🎓 Formations détaillées</h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {formations.map((slug, index) => (
              <a 
                key={index}
                href={`/formations/${slug}`} 
                style={{ 
                  display: 'block',
                  padding: '0.5rem',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: '#28a745'
                }}
              >
                {baseUrl}/formations/{slug}
              </a>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>🔧 Outils SEO</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button 
              onClick={downloadSitemap}
              className="btn primary"
              style={{ justifySelf: 'start' }}
            >
              📥 Télécharger sitemap.xml
            </button>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              <p><strong>Instructions :</strong></p>
              <ol>
                <li>Téléchargez le fichier sitemap.xml</li>
                <li>Uploadez-le à la racine de votre serveur</li>
                <li>Soumettez l'URL dans Google Search Console</li>
                <li>URL du sitemap : <code>https://cipfaro-formations.com/sitemap.xml</code></li>
              </ol>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>📊 Statistiques SEO</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                {pages.length}
              </div>
              <div>Pages indexables</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {formations.length}
              </div>
              <div>Formations détaillées</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e67e22' }}>
                100%
              </div>
              <div>Optimisation mobile</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}