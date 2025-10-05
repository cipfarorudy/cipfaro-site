import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

export default function Header({ theme, setTheme, logoSrc }) {
  const [open, setOpen] = useState(null); // "formations" | "services" | "infos" | null
  const navRef = useRef(null);

  // Fermer si clic en dehors
  useEffect(() => {
    function onDocClick(e) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) setOpen(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Fermer à ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (key) => setOpen((cur) => (cur === key ? null : key));

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200" to="/" aria-label="Accueil CIP FARO">
            <div className="relative">
              <picture>
                <source srcSet="/assets/logo-cipfaro.png" type="image/png" />
                <img 
                  src={logoSrc || '/assets/logo-cipfaro.png'} 
                  alt="CIP FARO" 
                  className="h-12 w-auto object-contain" 
                  width="260" 
                  height="120" 
                />
              </picture>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CIP FARO
              </h1>
              <p className="text-sm text-gray-600 font-medium">Centre de Formation</p>
            </div>
          </Link>

          {/* Theme Switcher - Modern Design */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-full p-1 space-x-1">
              <button 
                className={`p-2 rounded-full transition-all duration-200 ${theme==='light' ? 'bg-white shadow-md text-yellow-500' : 'text-gray-500 hover:bg-white/50'}`}
                onClick={()=>setTheme && setTheme('light')} 
                aria-pressed={theme==='light'} 
                title="Thème clair"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded-full transition-all duration-200 ${theme==='dark' ? 'bg-gray-800 shadow-md text-indigo-400' : 'text-gray-500 hover:bg-white/50'}`}
                onClick={()=>setTheme && setTheme('dark')} 
                aria-pressed={theme==='dark'} 
                title="Thème sombre"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded-full transition-all duration-200 ${theme==='warm' ? 'bg-orange-100 shadow-md text-orange-500' : 'text-gray-500 hover:bg-white/50'}`}
                onClick={()=>setTheme && setTheme('warm')} 
                aria-pressed={theme==='warm'} 
                title="Thème chaud"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded-full transition-all duration-200 ${theme==='pastel' ? 'bg-pink-100 shadow-md text-pink-500' : 'text-gray-500 hover:bg-white/50'}`}
                onClick={()=>setTheme && setTheme('pastel')} 
                aria-pressed={theme==='pastel'} 
                title="Thème pastel"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM3 15a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm6-11a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {/* Navigation Menu */}
      <nav className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <ul className="flex items-center space-x-8 py-4 overflow-x-auto" id="main-navigation" ref={navRef}>
            {/* Formations */}
            <li className="relative group">
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium ${open === "formations" ? "text-blue-600 bg-blue-50" : ""}`}
                aria-haspopup="true"
                aria-expanded={open === "formations"}
                onClick={() => toggle("formations")}
              >
                <span>Formations</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${open === "formations" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transition-all duration-200 ${open === "formations" ? "opacity-100 visible transform translate-y-0" : "opacity-0 invisible transform -translate-y-2"}`}>
                <Link to="/formations" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Toutes les formations
                </Link>
                <Link to="/devis" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM3 15a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm6-11a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Devis
                </Link>
                <Link to="/preinscription" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  Préinscription
                </Link>
                <Link to="/financements" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Financements
                </Link>
              </div>
            </li>

            {/* Services */}
            <li className="relative group">
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium ${open === "services" ? "text-blue-600 bg-blue-50" : ""}`}
                aria-haspopup="true"
                aria-expanded={open === "services"}
                onClick={() => toggle("services")}
              >
                <span>Services</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${open === "services" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transition-all duration-200 ${open === "services" ? "opacity-100 visible transform translate-y-0" : "opacity-0 invisible transform -translate-y-2"}`}>
                <Link to="/contact" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Contact
                </Link>
                <Link to="/recrutement" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Recrutement
                </Link>
                <Link to="/indicateurs" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Indicateurs
                </Link>
                <Link to="/accessibilite" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  Accessibilité
                </Link>
              </div>
            </li>

            {/* Informations */}
            <li className="relative group">
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium ${open === "infos" ? "text-blue-600 bg-blue-50" : ""}`}
                aria-haspopup="true"
                aria-expanded={open === "infos"}
                onClick={() => toggle("infos")}
              >
                <span>Informations</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${open === "infos" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transition-all duration-200 ${open === "infos" ? "opacity-100 visible transform translate-y-0" : "opacity-0 invisible transform -translate-y-2"}`}>
                <Link to="/mentions-legales" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Mentions légales
                </Link>
                <Link to="/politique-confidentialite" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Politique de confidentialité
                </Link>
                <Link to="/cgv" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  CGV
                </Link>
                <Link to="/reclamations" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={() => setOpen(null)}>
                  <svg className="w-4 h-4 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Réclamations
                </Link>
              </div>
            </li>

            {/* CTA Button */}
            <li className="ml-auto">
              <Link 
                to="/preinscription" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                S'inscrire
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
