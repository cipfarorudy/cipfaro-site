// src/pages/Devis.jsx
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { formations } from '../data/formations'
import { useSearchParams, Link } from 'react-router-dom'

const formatEUR = (n) => new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR' }).format(n ?? 0)

export default function Devis() {
  const [sp] = useSearchParams()
  const slugParam = sp.get('slug') || ''

  // Client / financeur
  const [clientNom, setClientNom] = useState('')
  const [financeur, setFinanceur] = useState('')
  const [siret, setSiret] = useState('')
  const [adresse, setAdresse] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')

  // Formation choisie
  const [slug, setSlug] = useState(slugParam)
  const formation = useMemo(() => formations.find(f => f.slug === slug) || null, [slug])

  // Paramètres devis
  const [mode, setMode] = useState('individuel') // 'individuel' | 'groupe'
  const [participants, setParticipants] = useState(1)
  const [heures, setHeures] = useState(formation?.duree_heures || 0)
  const [tva, setTva] = useState(0) // TVA en %
  const [coutCertif, setCoutCertif] = useState(0) // optionnel (ex : 915 euros)
  const [lieu, setLieu] = useState('CIP FARO Rudy (ou distanciel)')
  const [periode, setPeriode] = useState('Dates à définir')
  const [refDevis, setRefDevis] = useState(`DEVIS-${dayjs().format('YYYYMMDD-HHmm')}`)
  const [dateDevis, setDateDevis] = useState(dayjs().format('YYYY-MM-DD'))
  const [echeance, setEcheance] = useState(dayjs().add(30,'day').format('YYYY-MM-DD'))

  useEffect(() => {
    // Si on arrive depuis /formations/:slug -> préremplir
    if (formation) {
      setHeures(formation.duree_heures || 0)
    }
  }, [formation])

  const tarifHoraireInd = Number(formation?.tarif_horaire_individuel || 0)
  const tarifHoraireGrp = Number(formation?.tarif_horaire_groupe || 0)
  const puHT = useMemo(() => {
    const taux = mode === 'individuel' ? tarifHoraireInd : tarifHoraireGrp
    return (heures || 0) * taux
  }, [mode, heures, tarifHoraireInd, tarifHoraireGrp])

  const ligneFormationHT = useMemo(() => {
    // total par participant en groupe ; en individuel c'est 1 participant
    return mode === 'groupe' ? puHT * (participants || 1) : puHT
  }, [puHT, mode, participants])

  const totalHT = useMemo(() => (ligneFormationHT + (Number(coutCertif) || 0)), [ligneFormationHT, coutCertif])
  const totalTVA = useMemo(() => totalHT * (Number(tva)/100), [totalHT, tva])
  const totalTTC = useMemo(() => totalHT + totalTVA, [totalHT, totalTVA])

  // État pour les historiques et options
  const [historique, setHistorique] = useState(() => {
    const saved = localStorage.getItem('devis-historique')
    return saved ? JSON.parse(saved) : []
  })
  const [templatePDF, setTemplatePDF] = useState('standard')
  const [logoActif, setLogoActif] = useState(true)

  // Fonction envoi par email
  function envoyerParEmail() {
    const objet = encodeURIComponent(`Devis ${refDevis} - ${formation?.titre || 'Formation'}`)
    const corps = encodeURIComponent(`Bonjour,

Veuillez trouver ci-joint notre devis pour la formation "${formation?.titre || 'Formation'}" :

• Référence : ${refDevis}
• Formation : ${formation?.titre || 'Non spécifiée'}
• Mode : ${mode === 'individuel' ? 'Individuel' : `Groupe (${participants} participants)`}
• Durée : ${heures}h
• Total HT : ${formatEUR(totalHT)}
• Total TTC : ${formatEUR(totalTTC)}

Nous restons à votre disposition pour tout complément d'information.

Cordialement,
CIP FARO Rudy
secretariat@cipfaro-formations.com`)

    const destinataire = email || ''
    const mailtoURL = `mailto:${destinataire}?subject=${objet}&body=${corps}`
    window.open(mailtoURL)
  }

  async function generatePDF() {
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const marginX = 40
    const line = (y) => doc.line(marginX, y, 555, y)

    // Logo (si activé)
    if (logoActif) {
      // Placeholder pour logo - remplacez par votre logo en base64
      try {
        // doc.addImage(logoBase64, 'PNG', 450, 25, 100, 50) // Ajustez position/taille
        doc.setFontSize(8)
        doc.setTextColor(100)
        doc.text('[LOGO]', 500, 40)
        doc.setTextColor(0)
      } catch (err) {
        console.log('Logo non disponible', err)
      }
    }

    // En-tête avec template personnalisé
    const couleurPrimaire = templatePDF === 'moderne' ? [0, 102, 204] : [0, 0, 0]
    doc.setTextColor(...couleurPrimaire)
    doc.setFontSize(14)
    doc.text('CIP FARO Rudy — EURO COM KARAIB', marginX, 40)
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text('Chemin Coulée Zebsi, 97139 Les Abymes — secretariat@cipfaro-formations.com', marginX, 58)
    doc.text('NDA : 01973171597 — SIRET : 429 168 727 00080', marginX, 72)
    line(84)

    // Bloc devis
    doc.setFontSize(12)
    doc.text(`Devis : ${refDevis}`, marginX, 110)
    doc.text(`Date : ${dayjs(dateDevis).format('DD/MM/YYYY')}`, marginX, 126)
    doc.text(`Échéance : ${dayjs(echeance).format('DD/MM/YYYY')}`, marginX, 142)

    // Client / financeur
    doc.setFontSize(12)
    doc.text('Destinataire :', marginX, 172)
    doc.setFontSize(10)
    doc.text([
      clientNom || '[Nom du destinataire]',
      adresse || '[Adresse]',
      siret ? `SIRET : ${siret}` : '',
      email ? `Email : ${email}` : '',
      tel ? `Tél. : ${tel}` : ''
    ].filter(Boolean), marginX, 190)

    // Formation
    const intitule = formation ? formation.titre : '[Intitulé formation]'
    const rncp = formation?.rncp || ''
    const obj = formation?.objectifs?.join(' • ') || ''
    const baseHoraire = mode === 'individuel' ? tarifHoraireInd : tarifHoraireGrp

    const items = [
      {
        designation: `${intitule}${rncp ? ` — ${rncp}` : ''}\n` +
                     `Modalités : ${mode === 'individuel' ? 'Individuel' : `Groupe (${participants} part.)`} — ${heures} h — Lieu : ${lieu}\n` +
                     (obj ? `Objectifs : ${obj}` : ''),
        qte: 1,
        pu: baseHoraire ? `${formatEUR(baseHoraire)} / h` : '—',
        total: formatEUR(ligneFormationHT)
      }
    ]

    if (Number(coutCertif) > 0) {
      items.push({
        designation: 'Coût de certification',
        qte: 1,
        pu: '—',
        total: formatEUR(Number(coutCertif))
      })
    }

    // Tableau avec style personnalisé
    const tableauStyle = templatePDF === 'moderne' 
      ? { fontSize: 10, cellPadding: 8, fillColor: [240, 248, 255] }
      : { fontSize: 10, cellPadding: 6 }

    autoTable(doc, {
      startY: 250,
      head: [['Désignation', 'Qté', 'PU', 'Total HT']],
      body: items.map(i => [i.designation, i.qte, i.pu, i.total]),
      styles: tableauStyle,
      columnStyles: { 0: { cellWidth: 300 } },
      headStyles: { fillColor: couleurPrimaire }
    })

    // Totaux
    let y = (doc.lastAutoTable?.finalY || 250) + 12
    line(y); y += 18
    doc.setFontSize(11)
    doc.text(`Total HT : ${formatEUR(totalHT)}`, 400, y); y += 16
    doc.text(`TVA (${tva || 0}%) : ${formatEUR(totalTVA)}`, 400, y); y += 16
    doc.setFontSize(12)
    doc.text(`Net à payer TTC : ${formatEUR(totalTTC)}`, 400, y); y += 24

    // Infos utiles
    doc.setFontSize(10)
    doc.text([
      `Période / dates prévisionnelles : ${periode}`,
      `Financeur : ${financeur || '[à préciser]'}`,
      'TVA : 0% par défaut (formation professionnelle, le cas échéant).',
      'Le devis sera accompagné du programme et de la fiche formation Qualiopi (Indicateur 1).'
    ], marginX, y)

    // Nom de fichier
    const safeNom = (clientNom || 'client').replace(/[^\p{L}\p{N}\-_ ]/gu, '').slice(0,60)
    const safeSlug = (slug || 'formation').slice(0,40)
    const filename = `${refDevis}_${dayjs(dateDevis).format('YYYYMMDD')}_${safeSlug}_${safeNom}.pdf`
    
    // Sauvegarder dans l'historique
    const nouveauDevis = {
      id: Date.now(),
      ref: refDevis,
      date: dateDevis,
      formation: formation?.titre || 'Formation',
      client: clientNom || 'Client',
      total: formatEUR(totalTTC),
      filename
    }
    
    const nouvelHistorique = [nouveauDevis, ...historique].slice(0, 20) // Garder 20 derniers
    setHistorique(nouvelHistorique)
    localStorage.setItem('devis-historique', JSON.stringify(nouvelHistorique))
    
    doc.save(filename)
  }

  // Générateur de programme de formation
  async function generateProgramme() {
    if (!formation) {
      alert('Veuillez sélectionner une formation')
      return
    }
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const marginX = 40

    // En-tête programme
    doc.setFontSize(16)
    doc.text('PROGRAMME DE FORMATION', marginX, 40)
    
    doc.setFontSize(14)
    doc.text(formation.titre, marginX, 70)
    
    if (formation.rncp) {
      doc.setFontSize(10)
      doc.text(`Code RNCP : ${formation.rncp}`, marginX, 90)
    }

    doc.line(marginX, 100, 555, 100)

    let y = 130

    // Objectifs
    doc.setFontSize(12)
    doc.text('OBJECTIFS DE LA FORMATION', marginX, y)
    y += 20
    doc.setFontSize(10)
    formation.objectifs?.forEach((obj, index) => {
      doc.text(`${index + 1}. ${obj}`, marginX + 10, y)
      y += 18
    })

    y += 10

    // Prérequis
    doc.setFontSize(12)
    doc.text('PRÉREQUIS', marginX, y)
    y += 20
    doc.setFontSize(10)
    doc.text(formation.prerequis || 'Aucun prérequis spécifique', marginX + 10, y)
    y += 30

    // Durée et modalités
    doc.setFontSize(12)
    doc.text('DURÉE ET MODALITÉS', marginX, y)
    y += 20
    doc.setFontSize(10)
    doc.text(`Durée : ${formation.duree}`, marginX + 10, y)
    y += 18
    doc.text(`Modalités : ${formation.modalites}`, marginX + 10, y)
    y += 18
    doc.text(`Délais d'accès : ${formation.delais_acces}`, marginX + 10, y)
    y += 30

    // Méthodes
    doc.setFontSize(12)
    doc.text('MÉTHODES PÉDAGOGIQUES', marginX, y)
    y += 20
    doc.setFontSize(10)
    doc.text(formation.methodes_mobilisees, marginX + 10, y, { maxWidth: 500 })
    y += 50

    // Évaluation
    doc.setFontSize(12)
    doc.text('MODALITÉS D\'ÉVALUATION', marginX, y)
    y += 20
    doc.setFontSize(10)
    doc.text(formation.modalites_evaluation, marginX + 10, y, { maxWidth: 500 })

    const filename = `Programme_${formation.slug}_${dayjs().format('YYYYMMDD')}.pdf`
    doc.save(filename)
  }

  // Permet d'ouvrir un devis existant placé dans /public/devis/…
  // Ex : renomme ton PDF en "devis-fpa-2025-09-12.pdf" et mets-le dans public/devis/
  const pdfExistantURL = '/devis/devis-fpa-2025-09-12.pdf' // change ce nom selon ton fichier

  return (
    <section className="card">
      <h1>Devis</h1>

      <div className="grid" style={{marginTop:'1rem'}}>
        {/* Formulaire devis */}
        <div className="card">
          <h2>Générer un devis PDF</h2>

          <div className="grid">
            <label className="card">
              <span>Formation</span>
              <select value={slug} onChange={e=>setSlug(e.target.value)}>
                <option value="">— Choisir —</option>
                {formations.map(f => <option key={f.slug} value={f.slug}>{f.titre}</option>)}
              </select>
              {!slug && <small className="muted">Ou démarrez depuis une fiche formation via "Demander un devis".</small>}
            </label>

            <label className="card">
              <span>Template PDF</span>
              <select value={templatePDF} onChange={e=>setTemplatePDF(e.target.value)}>
                <option value="standard">Standard</option>
                <option value="moderne">Moderne (couleur)</option>
              </select>
            </label>

            <label className="card">
              <span>Options</span>
              <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                <label>
                  <input type="checkbox" checked={logoActif} onChange={e=>setLogoActif(e.target.checked)} />
                  Logo dans PDF
                </label>
              </div>
            </label>

            <label className="card">
              <span>Mode</span>
              <select value={mode} onChange={e=>setMode(e.target.value)}>
                <option value="individuel">Individuel (15 euros/h)</option>
                <option value="groupe">Groupe (9 euros/h / participant)</option>
              </select>
            </label>

            {mode === 'groupe' && (
              <label className="card">
                <span>Participants</span>
                <input type="number" min="1" value={participants} onChange={e=>setParticipants(+e.target.value || 1)} />
              </label>
            )}

            <label className="card">
              <span>Heures</span>
              <input type="number" min="1" value={heures} onChange={e=>setHeures(+e.target.value || 0)} />
              <small className="muted">Référence : {formation?.duree_heures ? `${formation.duree_heures} h` : '—'}</small>
            </label>

            <label className="card">
              <span>Coût certification (optionnel)</span>
              <input type="number" min="0" step="1" value={coutCertif} onChange={e=>setCoutCertif(+e.target.value || 0)} />
            </label>

            <label className="card">
              <span>TVA (%)</span>
              <input type="number" min="0" step="1" value={tva} onChange={e=>setTva(+e.target.value || 0)} />
              <small className="muted">En formation pro, TVA souvent 0% : à confirmer selon ton cas.</small>
            </label>
          </div>

          <div className="grid" style={{marginTop:'1rem'}}>
            <label className="card">
              <span>Client / Destinataire</span>
              <input placeholder="Nom / Société" value={clientNom} onChange={e=>setClientNom(e.target.value)} />
              <input placeholder="Adresse" value={adresse} onChange={e=>setAdresse(e.target.value)} />
              <input placeholder="SIRET (optionnel)" value={siret} onChange={e=>setSiret(e.target.value)} />
              <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <input placeholder="Téléphone" value={tel} onChange={e=>setTel(e.target.value)} />
            </label>

            <label className="card">
              <span>Financeur</span>
              <input placeholder="Ex : MFR du Lamentin / OPCO…" value={financeur} onChange={e=>setFinanceur(e.target.value)} />
              <span style={{marginTop:8}}>Lieu</span>
              <input value={lieu} onChange={e=>setLieu(e.target.value)} />
              <span style={{marginTop:8}}>Période / dates</span>
              <input value={periode} onChange={e=>setPeriode(e.target.value)} />
            </label>

            <label className="card">
              <span>Référence devis</span>
              <input value={refDevis} onChange={e=>setRefDevis(e.target.value)} />
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                <label>Émis le<input type="date" value={dateDevis} onChange={e=>setDateDevis(e.target.value)} /></label>
                <label>Échéance<input type="date" value={echeance} onChange={e=>setEcheance(e.target.value)} /></label>
              </div>
            </label>
          </div>

          <div className="card" style={{marginTop:'1rem'}}>
            <h3>Récapitulatif</h3>
            <ul>
              <li><strong>Total formation HT :</strong> {formatEUR(ligneFormationHT)}</li>
              {Number(coutCertif) > 0 && <li><strong>Certification HT :</strong> {formatEUR(Number(coutCertif))}</li>}
              <li><strong>Total HT :</strong> {formatEUR(totalHT)}</li>
              <li><strong>TVA ({tva || 0}%) :</strong> {formatEUR(totalTVA)}</li>
              <li><strong>Net à payer TTC :</strong> {formatEUR(totalTTC)}</li>
            </ul>
            <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'1rem'}}>
              <button className="btn primary" onClick={generatePDF}>📄 Générer le PDF</button>
              <button className="btn" onClick={generateProgramme}>📋 Programme formation</button>
              <button className="btn" onClick={envoyerParEmail}>📧 Envoyer par email</button>
            </div>
          </div>
        </div>

        {/* Historique des devis */}
        <div className="card">
          <h2>Historique des devis</h2>
          {historique.length === 0 ? (
            <p className="muted">Aucun devis généré récemment.</p>
          ) : (
            <div>
              {historique.slice(0, 5).map(devis => (
                <div key={devis.id} style={{padding:'0.5rem', border:'1px solid #e5e7eb', borderRadius:'8px', marginBottom:'0.5rem'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <strong>{devis.ref}</strong> - {devis.formation}<br/>
                      <small className="muted">{devis.client} • {dayjs(devis.date).format('DD/MM/YYYY')} • {devis.total}</small>
                    </div>
                    <button className="btn" onClick={() => navigator.clipboard?.writeText(devis.filename)}>
                      📋 Copier nom
                    </button>
                  </div>
                </div>
              ))}
              {historique.length > 5 && (
                <small className="muted">... et {historique.length - 5} autres devis</small>
              )}
            </div>
          )}
        </div>

        {/* Visionneuse d'un PDF existant */}
        <div className="card">
          <h2>Voir un devis existant</h2>
          <p className="muted">Place ton PDF dans <code>public/devis/</code> puis ajuste l'URL ci-dessous.</p>
          <p><a className="btn" href={pdfExistantURL} target="_blank" rel="noopener noreferrer">Ouvrir le PDF existant</a></p>
          <div style={{border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden', aspectRatio:'1/1.3'}}>
            <iframe title="Devis existant" src={pdfExistantURL} style={{width:'100%', height:'100%', border:'0'}} />
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:'1rem'}}>
        <small className="muted">
          Conformité Qualiopi : un programme et une fiche formation détaillée (Indicateur 1) accompagnent le devis.
          Les indicateurs de résultats sont disponibles sur la page "Indicateurs".
        </small>
      </div>

      <p style={{marginTop:'1rem'}}>
        <Link className="btn" to="/formations">← Retour aux formations</Link>
      </p>
    </section>
  )
}
