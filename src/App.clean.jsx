import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div className="card">
      <h1>Accueil</h1>
      <p>Exemple de navigation :</p>
      <p><Link className="btn" to="/about">Aller à About</Link></p>
    </div>
  )
}

function About() {
  return (
    <div className="card">
      <h1>About</h1>
      <p><Link className="btn" to="/">← Retour</Link></p>
    </div>
  )
}

export default function App() {
  return (
    <main className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </main>
  )
}
