// src/pages/Preinscription.jsx
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
// lazy-load jsPDF et jspdf-autotable uniquement quand nécessaire
import dayjs from 'dayjs'
import { formations } from '../data/formations'
import { envoyerEmailInscription, initEmailService } from '../utils/emailService'

const formatEuro = (n) => new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR' }).format(n ?? 0)

export default function Preinscription() {
  const [sp] = useSearchParams()
  const slugParam = sp.get('slug') || ''
  
  // Initialiser le service email au chargement
  useEffect(() => {
    initEmailService()
  }, [])

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
      
      // 1. Envoi au serveur (existant)
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.cipfaro-formations.com'
      const resp = await fetch(`${API_BASE.replace(/\/$/, '')}/api/preinscription`, { 
        method: 'POST', 
        body: form,
        headers: {
          // Le header Content-Type est automatiquement défini pour FormData
        }
      })
      if (!resp.ok) {
        const data = await resp.json().catch(()=>null)
        setErrorMessage(data?.error || resp.statusText || 'Erreur serveur')
        setIsSending(false)
        return
      }
      
      // 2. Envoi de l'email de confirmation
      const inscriptionData = {
        prenom,
        nom,
        email: '', // À ajouter dans le formulaire si pas déjà présent
        formation: formation?.titre || '',
        duree: formation?.duree || '',
        modalites: formation?.modalites || '',
        dateDebut: 'À définir selon planning',
        financement: 'CPF, Pôle Emploi, financement personnel'
      }
      
      // Tentative d'envoi email (ne doit pas bloquer si ça échoue)
      try {
        const emailResult = await envoyerEmailInscription(inscriptionData)
        if (emailResult.success) {
          setSuccessMessage('Préinscription envoyée au secrétariat ✅ Un email de confirmation vous a été envoyé.')
        } else {
          setSuccessMessage('Préinscription envoyée au secrétariat ✅')
        }
      } catch (emailError) {
        console.log('Email de confirmation non envoyé:', emailError)
        setSuccessMessage('Préinscription envoyée au secrétariat ✅')
      }
      
      setErrorMessage('')
    } catch (err) {
      console.error('Erreur envoi serveur', err)
      setErrorMessage('Erreur réseau lors de l\'envoi au serveur.')
    } finally {
      setIsSending(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header avec breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <span>›</span>
            <Link to="/formations" className="hover:text-blue-600 transition-colors">Formations</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Préinscription</span>
          </nav>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl">�</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Questionnaire de préinscription</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complétez ce formulaire pour candidater à votre formation. 
              Toutes les informations renseignées resteront confidentielles.
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
              <span className="font-medium text-gray-900">Informations personnelles</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">2</div>
              <span>Motivation</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">3</div>
              <span>Validation</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progression du formulaire</span>
              <span className="text-sm font-medium text-blue-600">{Math.round(calculateProgress())}% complété</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Identité */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Vos informations</h3>
                    <p className="text-sm text-gray-600">Renseignez votre identité et la formation souhaitée</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input 
                      value={nom} 
                      onChange={e=>setNom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre nom de famille"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input 
                      value={prenom} 
                      onChange={e=>setPrenom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formation souhaitée <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={slug} 
                      onChange={e=>setSlug(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">— Sélectionnez une formation —</option>
                      {formations.map(f => (
                        <option key={f.slug} value={f.slug}>{f.titre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de candidature</label>
                    <input 
                      type="date" 
                      value={dateJour} 
                      onChange={e=>setDateJour(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Motivation et parcours */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Votre motivation</h3>
                    <p className="text-sm text-gray-600">Parlez-nous de votre projet et votre parcours</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quelle est votre demande de formation ?
                  </label>
                  <textarea 
                    rows={3} 
                    value={demande} 
                    onChange={e=>setDemande(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Décrivez précisément ce que vous recherchez..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quelle est votre situation actuelle ?
                  </label>
                  <textarea 
                    rows={3} 
                    value={situation} 
                    onChange={e=>setSituation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Emploi, recherche d'emploi, reconversion..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pour quelles raisons souhaitez-vous entrer en formation ?
                  </label>
                  <textarea 
                    rows={3} 
                    value={raisons} 
                    onChange={e=>setRaisons(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Vos objectifs professionnels, vos aspirations..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expérience professionnelle dans ce domaine
                  </label>
                  <textarea 
                    rows={3} 
                    value={experience} 
                    onChange={e=>setExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Décrivez vos expériences pertinentes..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau de qualification
                    </label>
                    <input 
                      placeholder="Ex. Niveau 4 (Bac), Niveau 5 (BTS)..." 
                      value={niveau} 
                      onChange={e=>setNiveau(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dernier diplôme obtenu
                    </label>
                    <input 
                      value={dernierDiplome} 
                      onChange={e=>setDernierDiplome(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Intitulé et année d'obtention"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="flex items-start space-x-3">
                    <input 
                      type="checkbox" 
                      checked={psh} 
                      onChange={e=>setPsh(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">Besoins spécifiques (situation de handicap)</span>
                      <textarea 
                        rows={2} 
                        placeholder="Si oui, comment pouvons-nous adapter la formation à vos besoins ?" 
                        value={pshDetails} 
                        onChange={e=>setPshDetails(e.target.value)}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        disabled={!psh}
                      />
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commentaires libres
                  </label>
                  <textarea 
                    rows={3} 
                    value={commentaires} 
                    onChange={e=>setCommentaires(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Toute information complémentaire..."
                  />
                </div>
              </div>
            </div>

            {/* Évaluation des prérequis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Évaluation des prérequis</h3>
                    <p className="text-sm text-gray-600">Section complétée par l'organisme de formation</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>📝 Note :</strong> Cette section sera complétée par nos formateurs après étude de votre dossier.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prérequis identifiés
                  </label>
                  <textarea 
                    rows={2} 
                    value={prerequis} 
                    onChange={e=>setPrerequis(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="À compléter par l'organisme..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modalités de validation des prérequis
                  </label>
                  <textarea 
                    rows={2} 
                    value={modalitesValidation} 
                    onChange={e=>setModalitesValidation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="À compléter par l'organisme..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test de positionnement / Entretien
                  </label>
                  <input 
                    placeholder="Ex. Test en ligne + entretien individuel" 
                    value={positionnement} 
                    onChange={e=>setPositionnement(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Pièces jointes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📎</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pièces jointes</h3>
                    <p className="text-sm text-gray-600">Joignez votre CV et autres documents</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-xl">📄</span>
                    </div>
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Télécharger votre CV
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PDF, DOC ou DOCX jusqu'à 10 MB
                      </span>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                        onChange={handleCV}
                        className="hidden"
                      />
                      <span className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        Choisir un fichier
                      </span>
                    </label>
                    {cvFile && (
                      <div className="mt-3 text-sm text-green-600 flex items-center justify-center space-x-1">
                        <span>✅</span>
                        <span>{cvFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 text-center">
                  Votre CV sera joint automatiquement à votre candidature
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar informative */}
          <div className="lg:col-span-1 space-y-6">
            {/* Informations formation */}
            {formation && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Formation sélectionnée</h3>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">{formation.titre}</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs">⏱</span>
                      <span className="text-gray-600">Durée : {formation.duree || '—'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">💰</span>
                      <span className="text-gray-600">
                        {thInd ? `${formatEuro(thInd)}/h (individuel)` : 'Tarif sur demande'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-xs">🎓</span>
                      <span className="text-gray-600">
                        {formation.certifiante ? 'Formation certifiante' : 'Formation qualifiante'}
                      </span>
                    </div>
                    {formation.rncp && (
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-xs">📜</span>
                        <span className="text-gray-600">RNCP : {formation.rncp}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link 
                      to={`/formations/${formation.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      → Voir la fiche détaillée
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Aide et contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Besoin d'aide ?</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">📧</div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">secretariat@cipfaro-formations.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">📞</div>
                    <div>
                      <p className="font-medium text-gray-900">Téléphone</p>
                      <p className="text-gray-600">0590 XXX XXX</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs">⏰</div>
                    <div>
                      <p className="font-medium text-gray-900">Horaires</p>
                      <p className="text-gray-600">Lun-Ven : 8h-17h</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link 
                    to="/contact"
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions de validation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Finaliser votre candidature</h3>
                <p className="text-sm text-gray-600">Vérifiez vos informations et envoyez votre dossier</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Résumé formation */}
            {formation && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Récapitulatif</h4>
                <p className="text-sm text-gray-600">
                  <strong>Formation :</strong> {formation.titre}<br/>
                  <strong>Durée :</strong> {formation.duree || '—'}<br/>
                  <strong>Modalités :</strong> {formation.modalites || 'Présentiel / distanciel'}<br/>
                  <strong>Tarif indicatif :</strong> {thInd ? `${formatEuro(thInd)}/h (individuel)` : 'Sur demande'} 
                  {thGrp && ` / ${formatEuro(thGrp)}/h (groupe)`}
                </p>
              </div>
            )}

            {/* Consentement RGPD */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={consent} 
                  onChange={e=>setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Consentement RGPD</span>
                  <p className="text-gray-600 mt-1">
                    Je consens au traitement de mes données personnelles pour l'étude de ma candidature, 
                    la relation précontractuelle et, le cas échéant, l'inscription en formation. 
                    J'ai pris connaissance de la Politique de confidentialité et de mes droits.
                  </p>
                </div>
              </label>
            </div>

            {/* Messages d'état */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">❌</span>
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={generatePDF} 
                disabled={isSending || !consent}
              >
                <span className="mr-2">📄</span>
                Générer PDF
              </button>
              
              <a 
                className="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                href={mailto} 
                onClick={(e)=>{ if(isSending) e.preventDefault() }}
              >
                <span className="mr-2">✉️</span>
                Email pré-rempli
              </a>
              
              <button 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={sendToServer} 
                disabled={isSending || !consent || !nom || !prenom || !slug}
              >
                <span className="mr-2">📨</span>
                {isSending ? 'Envoi...' : 'Envoyer candidature'}
              </button>
              
              <Link 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                to="/formations"
              >
                <span className="mr-2">←</span>
                Formations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
