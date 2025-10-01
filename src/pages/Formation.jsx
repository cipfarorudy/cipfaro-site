import { useParams, Link } from 'react-router-dom'
import { formations } from '../data/formations'

const formatEUR = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

export default function Formation() {
  const { slug } = useParams()
  const f = formations.find(x => x.slug === slug)

  if (!f) return <p>Formation introuvable.</p>

  // Données tarifaires (sécurisées)
  const dureeH = Number(f?.duree_heures ?? 0)
  const thInd = Number(f?.tarif_horaire_individuel ?? 0)  // €/h
  const thGrp = Number(f?.tarif_horaire_groupe ?? 0)      // €/h (par participant)

  const totalInd = dureeH && thInd ? dureeH * thInd : null
  const totalGrp = dureeH && thGrp ? dureeH * thGrp : null

  return (
    <article className="card">
      <h1>{f.titre}</h1>

      {f.certifiante && (
        <p className="muted">
          <strong>Formation certifiante</strong><br/>
          Libellé exact : {f.titre}<br/>
          Code RNCP/RS : {f.rncp} — Certificateur : {f.certificateur}<br/>
          Date d'enregistrement : {f.date_enregistrement}
        </p>
      )}

      <h3>Objectifs</h3>
      <ul>{f.objectifs?.map((o,i)=><li key={i}>{o}</li>)}</ul>

      <p><strong>Prérequis :</strong> {f.prerequis}</p>
      <p><strong>Durée :</strong> {f.duree} {dureeH ? `(${dureeH} h)` : ''}</p>
      <p><strong>Modalités & délais d'accès :</strong> {f.modalites} — {f.delais_acces}</p>

      {/* 🔢 Tarifs calculés automatiquement */}
      <h3>Tarifs (calcul automatique)</h3>
      <ul>
        <li><strong>Tarif horaire (individuel) :</strong> {thInd ? `${formatEUR(thInd)} / h` : '—'}</li>
        <li><strong>Tarif horaire (groupe) :</strong> {thGrp ? `${formatEUR(thGrp)} / h (par participant)` : '—'}</li>
        <li><strong>Durée de référence :</strong> {dureeH ? `${dureeH} h` : (f.duree || '—')}</li>
        <li><strong>Total (individuel) :</strong> {totalInd ? `${formatEUR(totalInd)} TTC` : '—'}</li>
        <li><strong>Total (groupe) :</strong> {totalGrp ? `${formatEUR(totalGrp)} TTC / participant` : '—'}</li>
      </ul>
      <p className="muted">
        Les montants sont indicatifs et peuvent varier selon le financement (CPF, OPCO, France Travail, entreprise…).
        Un devis détaillé est transmis avant contractualisation.
      </p>

      <p><strong>Contacts :</strong> {f.contacts}</p>
      <p><strong>Méthodes mobilisées :</strong> {f.methodes_mobilisees}</p>
      <p><strong>Modalités d'évaluation :</strong> {f.modalites_evaluation}</p>
      <p><strong>Accessibilité PSH :</strong> {f.accessibilite_psh}</p>

      <div style={{marginTop:'1.5rem', display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
        <Link className="btn primary" to={`/devis?slug=${f.slug}`}>📄 Demander un devis</Link>
        <Link className="btn" to={`/preinscription?slug=${f.slug}`}>📝 Se pré-inscrire</Link>
        <Link className="btn" to="/contact">✉️ Nous contacter</Link>
      </div>

      {f.passerelles && (
        <>
          <h3>Passerelles & débouchés (si certifiant)</h3>
          <p><strong>Débouchés :</strong> {f.debouches}</p>
          <p><strong>Passerelles :</strong> {f.passerelles}</p>
        </>
      )}
    </article>
  )
}