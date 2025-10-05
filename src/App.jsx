import { lazy, Suspense } from 'react';
import { useGoogleAnalytics } from './utils/analytics';
import CookieBanner from './components/CookieBanner.jsx';
import Nav from './components/Nav.jsx';
import Header from './components/Header.jsx';
import logo from './assets/logo-cipfaro.png'
import icpfMark from './assets/logo-cipfaro.png'

// Lazy loading des pages principales
const Home = lazy(() => import('./pages/Home.jsx'));
const Formations = lazy(() => import('./pages/Formations.jsx'));
const Formation = lazy(() => import('./pages/Formation.jsx'));
const Devis = lazy(() => import('./pages/Devis.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const ApiTest = lazy(() => import('./pages/ApiTest.tsx'));

// Lazy loading des pages secondaires
const Preinscription = lazy(() => import('./pages/Preinscription.jsx'));
const Inscription = lazy(() => import('./pages/Inscription.tsx'));
const Sitemap = lazy(() => import('./pages/Sitemap.jsx'));
const Financements = lazy(() => import('./pages/Financements.jsx'));
const Indicateurs = lazy(() => import('./pages/Indicateurs.jsx'));
const Accessibilite = lazy(() => import('./pages/Accessibilite.jsx'));
const Reclamations = lazy(() => import('./pages/Reclamations.jsx'));
const Mentions = lazy(() => import('./pages/Mentions.jsx'));
const Politique = lazy(() => import('./pages/Politique.jsx'));
const CGV = lazy(() => import('./pages/CGV.jsx'));
const Recrutement = lazy(() => import('./pages/Recrutement.jsx'));

// Lazy loading des pages d'administration
const Connexion = lazy(() => import('./pages/Connexion.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const EspaceAdmin = lazy(() => import('./pages/EspaceAdmin.jsx'));
const EspaceStagiaire = lazy(() => import('./pages/EspaceStagiaire.jsx'));
const EspaceFormateur = lazy(() => import('./pages/EspaceFormateur.jsx'));
const Moodle = lazy(() => import('./pages/Moodle.jsx'));
const PageBlanche = lazy(() => import('./pages/PageBlanche.jsx'));
const Post = lazy(() => import('./pages/Post.jsx'));
import { Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function App() {
  const [theme, setTheme] = useState(()=>{
    try{ return localStorage.getItem('theme') || 'light' }catch{ return 'light' }
  })

  // Initialiser Google Analytics
  useGoogleAnalytics()

  useEffect(()=>{
    // Remove all theme classes and attributes first
    document.documentElement.classList.remove('theme-warm','theme-pastel')
    document.documentElement.removeAttribute('data-theme')
    
    // Apply the correct theme
    if(theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else if(theme === 'warm') {
      document.documentElement.classList.add('theme-warm')
    } else if(theme === 'pastel') {
      document.documentElement.classList.add('theme-pastel')
    }
    // 'light' theme is the default CSS, no need to apply anything
    
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

      <main className="container mx-auto px-4 max-w-7xl" style={{paddingTop:'1rem', paddingBottom:'3rem'}}>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement...</p>
              </div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/formations/:slug" element={<Formation />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/preinscription" element={<Preinscription />} />
            <Route path="/inscription" element={<Inscription />} />
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
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/page-blanche" element={<PageBlanche />} />
            <Route path="/page-blanche/:slug" element={<Post />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border-t border-gray-700">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CF</span>
                </div>
                <span className="text-white font-bold text-lg">CIP FARO</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Centre de formation spécialisé dans l'insertion professionnelle 
                et l'accompagnement des publics. Certifié Qualiopi.
              </p>
              <div className="flex items-center space-x-3">
                <a 
                  href="/assets/certificat-B04066-2025-03-30.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Télécharger le certificat CIP FARO" 
                  download="certificat-B04066-2025-03-30.pdf"
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Certificat Qualiopi</span>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Liens utiles</h3>
              <nav className="flex flex-col space-y-2">
                <Link to="/formations" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Nos formations
                </Link>
                <Link to="/preinscription" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Pré-inscription
                </Link>
                <Link to="/inscription" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  S'inscrire
                </Link>
                <Link to="/devis" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Demander un devis
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Informations légales</h3>
              <nav className="flex flex-col space-y-2">
                <Link to="/mentions-legales" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Mentions légales
                </Link>
                <Link to="/politique-confidentialite" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Politique de confidentialité
                </Link>
                <Link to="/cgv" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Conditions générales
                </Link>
                <Link to="/accessibilite" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Accessibilité
                </Link>
              </nav>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <small className="text-gray-400">
                © {new Date().getFullYear()} CIP FARO Rudy. Tous droits réservés.
              </small>
              <img 
                src={icpfMark} 
                alt="Certification ICPF" 
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity duration-200" 
                loading="lazy" 
                width="120" 
                height="32" 
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Suivez-nous :</span>
              <div className="flex space-x-3">
                {/* Social links placeholder - can be activated when needed */}
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </>
  );
}

