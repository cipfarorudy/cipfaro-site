import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Formations from './pages/Formations.jsx'
import Formation from './pages/Formation.jsx'
import Devis from './pages/Devis.jsx'
import Preinscription from './pages/Preinscription.jsx'
import Financements from './pages/Financements.jsx'
import Indicateurs from './pages/Indicateurs.jsx'
import Accessibilite from './pages/Accessibilite.jsx'
import Reclamations from './pages/Reclamations.jsx'
import Mentions from './pages/Mentions.jsx'
import Politique from './pages/Politique.jsx'
import CGV from './pages/CGV.jsx'
import Contact from './pages/Contact.jsx'
import CookieBanner from './components/CookieBanner.jsx'

export default function App() {
  return (
    <>
      <header>
        <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <Link to="/"><strong>CIP FARO Rudy</strong></Link>
          <nav>
            <Link to="/formations">Formations</Link>
            <Link to="/devis">Devis</Link>
            <Link to="/preinscription">Préinscription</Link>
            <Link to="/financements">Financements</Link>
            <Link to="/indicateurs">Indicateurs</Link>
            <Link to="/accessibilite">Accessibilité</Link>
            <Link to="/reclamations">Réclamations</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="container" style={{paddingTop:'1rem', paddingBottom:'3rem'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:slug" element={<Formation />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/preinscription" element={<Preinscription />} />
          <Route path="/financements" element={<Financements />} />
          <Route path="/indicateurs" element={<Indicateurs />} />
          <Route path="/accessibilite" element={<Accessibilite />} />
          <Route path="/reclamations" element={<Reclamations />} />
          <Route path="/mentions-legales" element={<Mentions />} />
          <Route path="/politique-confidentialite" element={<Politique />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer>
        <div className="container" style={{display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'space-between'}}>
          <small className="muted">© {new Date().getFullYear()} CIP FARO Rudy</small>
          <nav style={{display:'flex', gap:'.8rem', flexWrap:'wrap'}}>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/politique-confidentialite">Confidentialité</Link>
            <Link to="/cgv">CGV</Link>
            <Link to="/accessibilite">Accessibilité</Link>
          </nav>
        </div>
      </footer>

      <CookieBanner />
    </>
  )
}
