import Home from './pages/Home.jsx';
import Formations from './pages/Formations.jsx';
import Formation from './pages/Formation.jsx';
import Devis from './pages/Devis.jsx';
import Preinscription from './pages/Preinscription.jsx';
import Financements from './pages/Financements.jsx';
import Indicateurs from './pages/Indicateurs.jsx';
import Accessibilite from './pages/Accessibilite.jsx';
import Reclamations from './pages/Reclamations.jsx';
import Mentions from './pages/Mentions.jsx';
import Politique from './pages/Politique.jsx';
import CGV from './pages/CGV.jsx';
import Contact from './pages/Contact.jsx';
import Recrutement from './pages/Recrutement.jsx';
import Connexion from './pages/Connexion.jsx';
import EspaceAdmin from './pages/EspaceAdmin.jsx';
import EspaceStagiaire from './pages/EspaceStagiaire.jsx';
import EspaceFormateur from './pages/EspaceFormateur.jsx';
import Moodle from './pages/Moodle.jsx';
import CookieBanner from './components/CookieBanner.jsx';
import Nav from './components/Nav.jsx';
import Header from './components/Header.jsx';
import logo from './assets/logo-cipfaro.png'
import icpfMark from './assets/logo-cipfaro.png'
import PageBlanche from './pages/PageBlanche.jsx';
import Post from './pages/Post.jsx';
import { Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function App() {
  const [theme, setTheme] = useState(()=>{
    try{ return localStorage.getItem('theme') || 'light' }catch{ return 'light' }
  })

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
    // also apply palette classes
    document.documentElement.classList.remove('theme-warm','theme-pastel')
    if(theme === 'warm') document.documentElement.classList.add('theme-warm')
    if(theme === 'pastel') document.documentElement.classList.add('theme-pastel')
    try{ localStorage.setItem('theme', theme) }catch(e){
      console.warn('Could not persist theme to localStorage', e)
    }
  },[theme])

  // Nav state moved to `src/components/Nav.jsx` (keeps App.jsx simpler)

  // Note: focus and nav state are managed inside `src/components/Nav.jsx`

  return (
    <>
  <Header theme={theme} setTheme={setTheme} logoSrc={logo} />

      {/* focus management: when mobile nav opens, move focus to first nav control; when it closes, move focus back to the toggle */}
      <script type="text/javascript">
        {/* noop placeholder to keep JSX formatting consistent; actual focus handling handled via useEffect below */}
      </script>

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
          <Route path="/recrutement" element={<Recrutement />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/admin" element={<EspaceAdmin />} />
          <Route path="/stagiaire" element={<EspaceStagiaire />} />
          <Route path="/formateur" element={<EspaceFormateur />} />
          <Route path="/moodle" element={<Moodle />} />
          <Route path="/page-blanche" element={<PageBlanche />} />
          <Route path="/page-blanche/:slug" element={<Post />} />
        </Routes>
      </main>

      <footer>
        <div className="container" style={{display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', gap:'.8rem', alignItems:'center'}}>
            <small className="muted">© {new Date().getFullYear()} CIP FARO Rudy</small>
            <a href="/assets/certificat-B04066-2025-03-30.pdf" target="_blank" rel="noopener noreferrer" title="Télécharger le certificat CIP FARO" download="certificat-B04066-2025-03-30.pdf">
              <img src={icpfMark} alt="Logo CIP FARO" className="icpf-mark" loading="lazy" width="120" height="40" />
            </a>
          </div>
          <nav style={{display:'flex', gap:'.8rem', flexWrap:'wrap'}}>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/politique-confidentialite">Confidentialité</Link>
            <Link to="/cgv">CGV</Link>
            <Link to="/accessibilite">Accessibilité</Link>
            <a href="/assets/certificat-B04066-2025-03-30.pdf" download="certificat-B04066-2025-03-30.pdf" target="_blank" rel="noopener noreferrer" aria-label="Télécharger le certificat CIP FARO">Certificat</a>
          </nav>
        </div>
      </footer>

      <CookieBanner />
    </>
  );
}

