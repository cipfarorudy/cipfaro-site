export default function Indicateurs() {
  // Remplis ces valeurs chaque année (affiche période de référence).
  const periode = "01/09/2024 → 31/08/2025"
  const indicateurs = [
    { label: "Taux de satisfaction global", valeur: "92%", note: "Issue d'enquêtes à chaud/à froid (n=57)" },
    { label: "Nombre de stagiaires formés", valeur: "64" },
    { label: "Taux d'abandon", valeur: "6%", note: "Causes principales : mobilité, santé" },
    { label: "Taux d'insertion à 6 mois", valeur: "68%" },
    // Ajoute : taux d'obtention pour le certifiant, etc.
    { label: "Taux d'obtention (TP CIP)", valeur: "78%" },
  ]

  return (
    <section className="card">
      <h1>Indicateurs de résultats</h1>
      <p className="muted">Période observée : {periode}</p>
      <ul>
        {indicateurs.map((i, idx) => (
          <li key={idx}>
            <strong>{i.label} :</strong> {i.valeur} {i.note && <em className="muted">— {i.note}</em>}
          </li>
        ))}
      </ul>
      <p className="muted">
        Méthodologie disponible sur demande. Mise à jour annuelle (au moins).
      </p>
    </section>
  )
}