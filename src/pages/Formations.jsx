import { Link } from 'react-router-dom'
import { formations } from '../data/formations'

export default function Formations() {
  return (
    <>
      <h1>Nos formations</h1>
      <div className="grid" style={{marginTop:'1rem'}}>
        {formations.map(f => (
          <article key={f.slug} className="card">
            <h2>{f.titre}</h2>
            <p><strong>Durée :</strong> {f.duree}</p>
            <p><strong>Modalités :</strong> {f.modalites}</p>
            <Link className="btn" to={`/formations/${f.slug}`}>Consulter</Link>
          </article>
        ))}
      </div>
    </>
  )
}