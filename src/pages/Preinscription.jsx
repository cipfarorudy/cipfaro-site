// src/pages/Preinscription.jsx
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
// lazy-load jsPDF et jspdf-autotable uniquement quand nécessaire
import dayjs from 'dayjs'
import { formations } from '../data/formations'

const formatEuro = (n) => new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR' }).format(n ?? 0)

export default function Preinscription() {
  const [sp] = useSearchParams()
  const slugParam = sp.get('slug') || ''

  // ————— Identité / entête (doc : "Nom, Prénom, Intitulé, Le : …") —————
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [slug, setSlug] = useState(slugParam)
  const [dateJour, setDateJour] = useState(dayjs().format('YYYY-MM-DD'))

  // Formation associée (pour afficher durée / tarifs si besoin)
  const formation = useMemo(() => formations.find(f => f.slug === slug) || null, [slug])

  // ————— "Réponse du candidat" (doc : demande, situation, raisons, expérience…) —————
  const [demande, setDemande] = useState('')
  const [situation, setSituation] = useState('')
  const [raisons, setRaisons] = useState('')
  const [experience, setExperience] = useState('')
  const [niveau, setNiveau] = useState('')                 // niveau de qualification
  const [dernierDiplome, setDernierDiplome] = useState('') // dernier diplôme
  const [psh, setPsh] = useState(false)                    // besoins spécifiques (PSH)
  const [pshDetails, setPshDetails] = useState('')
  const [commentaires, setCommentaires] = useState('')

  // ————— "Dans le cadre où la formation présente des prérequis / modalités / test" —————
  const [prerequis, setPrerequis] = useState('')
  const [modalitesValidation, setModalitesValidation] = useState('')
  const [positionnement, setPositionnement] = useState('') // test / entretien / les deux

  // ————— Pièces jointes —————
  const [cvFile, setCvFile] = useState(null) // PDF/DOC/DOCX

  // ————— RGPD / consentement —————
  const [consent, setConsent] = useState(false)

  // UX state for server send
  const [isSending, setIsSending] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (formation && formation.duree_heures) {
      // tu peux pré-remplir "prérequis" selon la fiche si tu les documentes
    }
  }, [formation])

  function handleCV(e) {
    const f = e.target.files?.[0]
    if (f) setCvFile(f)
  }

  async function generatePDF() {
    if (!consent) {
      alert("Merci de cocher la case de consentement RGPD avant de générer le PDF.")
      return
    }
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const marginX = 40

    // En-tête organisme (reprend les mentions en pied de ton doc)
    doc.setFontSize(12)
    doc.text('CIP FARO Rudy', marginX, 40)
    doc.setFontSize(10)
    doc.text('Chemin Coulée Zebsi, 97139 Les Abymes — NDA : 01973171597 — SIRET : 42916872700080', marginX, 56)
    doc.text('secretariat@cipfaro-formations.com', marginX, 72)

    // Titre du formulaire
    doc.setFontSize(14)
    doc.text('Questionnaire préalable à la formation', marginX, 104)

    // Bloc identité
    autoTable(doc, {
      startY: 120,
      head: [['A destination du futur candidat']],
      body: [
        [`Nom : ${nom || ''}`],
        [`Prénom : ${prenom || ''}`],
        [`Intitulé de formation : ${formation ? formation.titre : ''}`],
        [`Le : ${dayjs(dateJour).format('DD/MM/YYYY')}`],
      ],
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [226,232,240], textColor: 15 },
      theme: 'grid'
    })

    // Réponse du candidat
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [['Réponse du candidat']],
      body: [
        ['Quelle est votre demande de formation ?', demande],
        ['Quelle est votre situation actuelle ?', situation],
        ['Pour quelles raisons souhaitez-vous entrer en formation ?', raisons],
        ['Quelle est votre expérience professionnelle dans ce domaine ?', experience],
        ['Quel est votre niveau de qualification ?', niveau],
        ['Quel est votre dernier diplôme obtenu ?', dernierDiplome],
        ['Avez-vous des besoins spécifiques ? (situation de handicap)', psh ? 'Oui' : 'Non'],
        ['Si oui, comment pouvons-nous y répondre ?', pshDetails],
        ['Commentaires', commentaires],
      ],
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: { 0: { cellWidth: 240 }, 1: { cellWidth: 255 } },
      headStyles: { fillColor: [226,232,240], textColor: 15 },
      theme: 'grid'
    })

    // Prérequis / validation / test (OF)
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [['Dans le cadre où la formation présente des prérequis (à remplir par l organisme)']],
      body: [
        ['Prérequis', prerequis],
        ['Modalités de validation', modalitesValidation],
        ['Test de positionnement / entretien', positionnement],
      ],
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: { 0: { cellWidth: 240 }, 1: { cellWidth: 255 } },
      headStyles: { fillColor: [226,232,240], textColor: 15 },
      theme: 'grid'
    })

    // Mention RGPD / attestation consentement
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      body: [[
        "Je consens à l'utilisation de mes données pour l'étude de ma candidature, la relation précontractuelle et, le cas échéant, l'inscription en formation. J'ai pris connaissance de la Politique de confidentialité et de mes droits (accès, rectification, opposition, effacement, etc.)."
      ]],
      styles: { fontSize: 9, cellPadding: 6 },
      theme: 'plain'
    })

    // Nom de fichier
    const safeNom = (nom || 'candidat').replace(/[^\p{L}\p{N}\-_ ]/gu, '').slice(0,60)
    const safePrenom = (prenom || '').replace(/[^\p{L}\p{N}\-_ ]/gu, '').slice(0,40)
    const safeSlug = (slug || 'formation').slice(0,40)
    const filename = `Questionnaire_preinscription_${safeSlug}_${safeNom}_${safePrenom}_${dayjs(dateJour).format('YYYYMMDD')}.pdf`
    doc.save(filename)

    // NOTE : le fichier CV ne peut pas être "attaché" automatiquement au PDF généré côté navigateur.
    // L'utilisateur devra joindre le CV manuellement à l'email.
  }

  // Mail pré-rempli (ouvre le client mail, l'utilisateur joint le PDF et le CV)
  const mailto = useMemo(() => {
    const sujet = encodeURIComponent(`Préinscription - ${nom} ${prenom} - ${formation ? formation.titre : ''}`)
    const corps = encodeURIComponent(
      `Bonjour,\n\nVeuillez trouver ci-joint mon questionnaire préalable et mon CV.\n\n` +
      `Nom : ${nom}\nPrénom : ${prenom}\nFormation : ${formation ? formation.titre : ''}\nDate : ${dayjs(dateJour).format('DD/MM/YYYY')}\n\n` +
      `Cordialement,`
    )
    return `mailto:secretariat@cipfaro-formations.com?subject=${sujet}&body=${corps}`
  }, [nom, prenom, formation, dateJour])

  // Données tarifs indicatives
  const thInd = Number(formation?.tarif_horaire_individuel || 0)
  const thGrp = Number(formation?.tarif_horaire_groupe || 0)

  async function sendToServer() {
    if (!consent) {
      alert('Merci de cocher la case de consentement RGPD.')
      return
    }
    if (!nom || !prenom || !slug) {
      alert('Nom, prénom et formation sont requis.')
      return
    }

    // Generer PDF en memoire
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const marginX = 40
    doc.setFontSize(12)
    doc.text('CIP FARO Rudy', marginX, 40)
    doc.setFontSize(10)
    doc.text('Chemin Coulée Zebsi, 97139 Les Abymes — NDA : 01973171597 — SIRET : 42916872700080', marginX, 56)
    doc.text('secretariat@cipfaro-formations.com', marginX, 72)
    doc.setFontSize(14)
    doc.text('Questionnaire préalable à la formation', marginX, 104)

    autoTable(doc, {
      startY: 120,
      head: [['A destination du futur candidat']],
      body: [
        [`Nom : ${nom || ''}`],
        [`Prénom : ${prenom || ''}`],
        [`Intitulé de formation : ${formation ? formation.titre : ''}`],
        [`Le : ${dayjs(dateJour).format('DD/MM/YYYY')}`],
      ],
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [226,232,240], textColor: 15 },
      theme: 'grid'
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [['Réponse du candidat']],
      body: [
        ['Demande', demande], ['Situation', situation], ['Raisons', raisons], ['Expérience', experience],
        ['Niveau', niveau], ['Dernier diplôme', dernierDiplome], ['PSH', psh ? 'Oui' : 'Non'], ['PSH détails', pshDetails], ['Commentaires', commentaires]
      ],
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: { 0: { cellWidth: 240 }, 1: { cellWidth: 255 } },
      headStyles: { fillColor: [226,232,240], textColor: 15 },
      theme: 'grid'
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [['Prérequis / validation (OF)']],
      body: [['Prérequis', prerequis], ['Modalités', modalitesValidation], ['Positionnement', positionnement]],
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: { 0: { cellWidth: 240 }, 1: { cellWidth: 255 } },
      headStyles: { fillColor: [226,232,240], textColor: 15 },
      theme: 'grid'
    })

    const pdfBlob = doc.output('blob')

    const form = new FormData()
    form.append('nom', nom)
    form.append('prenom', prenom)
    form.append('slug', slug)
    form.append('dateJour', dateJour)
    form.append('demande', demande)
    form.append('situation', situation)
    form.append('raisons', raisons)
    form.append('experience', experience)
    form.append('niveau', niveau)
    form.append('dernierDiplome', dernierDiplome)
    form.append('psh', psh ? 'oui' : 'non')
    form.append('pshDetails', pshDetails)
    form.append('commentaires', commentaires)
    form.append('prerequis', prerequis)
    form.append('modalitesValidation', modalitesValidation)
    form.append('positionnement', positionnement)
    form.append('consent', 'oui')
    form.append('_hp', '')
    if (cvFile) form.append('cv', cvFile, cvFile.name || 'cv')
    form.append('questionnaire', pdfBlob, `Questionnaire_${nom}_${prenom}.pdf`)

    // UX: disable while sending and show success/error
    try {
      setIsSending(true)
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.cipfaro-formation.com'
      const resp = await fetch(`${API_BASE.replace(/\/$/, '')}/api/preinscription`, { method: 'POST', body: form })
      if (!resp.ok) {
        const data = await resp.json().catch(()=>null)
        setErrorMessage(data?.error || resp.statusText || 'Erreur serveur')
        setIsSending(false)
        return
      }
      setSuccessMessage('Préinscription envoyée au secrétariat ✅')
      setErrorMessage('')
    } catch (err) {
      console.error('Erreur envoi serveur', err)
      setErrorMessage('Erreur réseau lors de l\'envoi au serveur.')
    } finally {
      setIsSending(false)
    }
  }


  return (
    <section className="card">
      <h1>Questionnaire préalable (Préinscription)</h1>

      <div className="grid" style={{marginTop:'1rem'}}>
        {/* Identité */}
        <div className="card">
          <h3>A destination du futur candidat</h3>
          <div className="grid">
            <label className="card">
              <span>Nom</span>
              <input value={nom} onChange={e=>setNom(e.target.value)} />
            </label>
            <label className="card">
              <span>Prénom</span>
              <input value={prenom} onChange={e=>setPrenom(e.target.value)} />
            </label>
            <label className="card">
              <span>Intitulé de formation</span>
              <select value={slug} onChange={e=>setSlug(e.target.value)}>
                <option value="">— Choisir —</option>
                {formations.map(f => <option key={f.slug} value={f.slug}>{f.titre}</option>)}
              </select>
            </label>
            <label className="card">
              <span>Le</span>
              <input type="date" value={dateJour} onChange={e=>setDateJour(e.target.value)} />
            </label>
          </div>
        </div>

        {/* Réponse du candidat */}
        <div className="card">
          <h3>Réponse du candidat</h3>
          <label className="card">
            <span>Quelle est votre demande de formation ?</span>
            <textarea rows={3} value={demande} onChange={e=>setDemande(e.target.value)} />
          </label>
          <label className="card">
            <span>Quelle est votre situation actuelle ?</span>
            <textarea rows={3} value={situation} onChange={e=>setSituation(e.target.value)} />
          </label>
          <label className="card">
            <span>Pour quelles raisons souhaitez-vous entrer en formation ?</span>
            <textarea rows={3} value={raisons} onChange={e=>setRaisons(e.target.value)} />
          </label>
          <label className="card">
            <span>Quelle est votre expérience professionnelle dans ce domaine ?</span>
            <textarea rows={3} value={experience} onChange={e=>setExperience(e.target.value)} />
          </label>

          <div className="grid">
            <label className="card">
              <span>Quel est votre niveau de qualification ?</span>
              <input placeholder="Ex. Niveau 4 (Bac) / Niveau 5 (BTS)..." value={niveau} onChange={e=>setNiveau(e.target.value)} />
            </label>
            <label className="card">
              <span>Dernier diplôme obtenu</span>
              <input value={dernierDiplome} onChange={e=>setDernierDiplome(e.target.value)} />
            </label>
          </div>

          <label className="card">
            <span>Avez-vous des besoins spécifiques ? (situation de handicap)</span>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <input type="checkbox" checked={psh} onChange={e=>setPsh(e.target.checked)} />
              <span>Oui</span>
            </div>
            <textarea rows={2} placeholder="Si oui, comment pouvons-nous y répondre ?" value={pshDetails} onChange={e=>setPshDetails(e.target.value)} />
          </label>

          <label className="card">
            <span>Commentaires</span>
            <textarea rows={3} value={commentaires} onChange={e=>setCommentaires(e.target.value)} />
          </label>
        </div>

        {/* Prérequis / validation / test */}
        <div className="card">
          <h3>Si la formation présente des prérequis (à remplir par l'organisme)</h3>
          <div className="grid">
            <label className="card">
              <span>Prérequis</span>
              <textarea rows={2} value={prerequis} onChange={e=>setPrerequis(e.target.value)} />
            </label>
            <label className="card">
              <span>Modalités de validation</span>
              <textarea rows={2} value={modalitesValidation} onChange={e=>setModalitesValidation(e.target.value)} />
            </label>
            <label className="card">
              <span>Test de positionnement / entretien</span>
              <input placeholder="Ex. Test en ligne + entretien individuel" value={positionnement} onChange={e=>setPositionnement(e.target.value)} />
            </label>
          </div>
        </div>

        {/* Pièces jointes */}
        <div className="card">
          <h3>Pièces jointes</h3>
          <label className="card">
            <span>CV (PDF/DOC/DOCX)</span>
            <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleCV} />
            <small className="muted">Le CV sera joint manuellement à l'email de préinscription.</small>
          </label>
        </div>

        {/* Récap / consentement / actions */}
        <div className="card">
          <h3>Envoyer</h3>
          {formation && (
            <p className="muted">
              Référence formation : {formation.titre} — Durée : {formation.duree_heures || '—'} h — Tarif indicatif :
              {' '}{thInd ? `Individuel ${formatEuro(thInd)}/h` : '—'} / {thGrp ? `Groupe ${formatEuro(thGrp)}/h` : '—'} (par participant)
            </p>
          )}

          <label style={{display:'flex', gap:8, alignItems:'center', margin:'8px 0'}}>
            <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
            <span>Je consens au traitement de mes données selon la Politique de confidentialité.</span>
          </label>

          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <button className="btn" onClick={generatePDF} disabled={isSending}>📄 Générer le PDF du questionnaire</button>
            <a className="btn primary" href={mailto} onClick={()=>{ if(isSending) return false }}>✉️ Ouvrir mon e-mail prérempli</a>
            <button className="btn primary" onClick={sendToServer} disabled={isSending}>{isSending ? 'Envoi en cours...' : '📨 Envoyer au secrétariat (serveur)'}</button>
            <Link className="btn" to="/formations">← Retour aux formations</Link>
          </div>

          {successMessage && <p style={{color:'green', marginTop:8}}>{successMessage}</p>}
          {errorMessage && <p style={{color:'crimson', marginTop:8}}>{errorMessage}</p>}
        </div>
      </div>
    </section>
  )
}
