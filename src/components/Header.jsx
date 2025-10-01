import { useEffect, useRef, useState } from "react";
import "./Nav.css";

export default function Header({ theme, setTheme, logoSrc }) {
  const [open, setOpen] = useState(null); // "formations" | "pages" | "blog" | "plus" | null
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
    <header className="site-header">
      <a className="logo" href="/" aria-label="Accueil CIP FARO">
        <picture>
          <source srcSet="/assets/logo-cip-faro-ei.webp" type="image/webp" />
          <img src={logoSrc || '/assets/logo-cip-faro-ei.jpeg'} alt="CIP FARO" className="logo-img" width="220" height="80" />
        </picture>
        <span className="logo-text">CIP FARO</span>
      </a>

      <div className="actions" aria-hidden={false}>
        <div style={{display:'flex',gap:'.4rem',alignItems:'center'}}>
          <button className="btn" onClick={()=>setTheme && setTheme('light')} aria-pressed={theme==='light'} title="Thème clair">☀️</button>
          <button className="btn" onClick={()=>setTheme && setTheme('dark')} aria-pressed={theme==='dark'} title="Thème sombre">🌙</button>
          <button className="btn secondary" onClick={()=>setTheme && setTheme('warm')} aria-pressed={theme==='warm'} title="Thème chaud">🔥</button>
          <button className="btn secondary" onClick={()=>setTheme && setTheme('pastel')} aria-pressed={theme==='pastel'} title="Thème pastel">🎨</button>
        </div>
      </div>

      <ul className="main-nav" id="main-navigation" ref={navRef}>
        {/* Formations */}
        <li className={`nav-dropdown ${open === "formations" ? "open" : ""}`}>
          <button
            className="nav-link"
            aria-haspopup="true"
            aria-expanded={open === "formations"}
            onClick={() => toggle("formations")}
          >
            Formations ▾
          </button>
          <ul className="dropdown" role="menu">
            <li><a href="/formations">Toutes les formations</a></li>
            <li><a href="/devis">Devis</a></li>
            <li><a href="/preinscription">Préinscription</a></li>
            <li><a href="/financements">Financements</a></li>
          </ul>
        </li>

        {/* Pages */}
        <li className={`nav-dropdown ${open === "pages" ? "open" : ""}`}>
          <button
            className="nav-link"
            aria-haspopup="true"
            aria-expanded={open === "pages"}
            onClick={() => toggle("pages")}
          >
            Pages ▾
          </button>
          <ul className="dropdown" role="menu">
            <li><a href="/indicateurs">Indicateurs</a></li>
            <li><a href="/accessibilite">Accessibilité</a></li>
            <li><a href="/reclamations">Réclamations</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/mentions-legales">Mentions légales</a></li>
            <li><a href="/politique">Politique</a></li>
            <li><a href="/cgv">CGV</a></li>
          </ul>
        </li>

        {/* Blog */}
        <li className={`nav-dropdown ${open === "blog" ? "open" : ""}`}>
          <button
            className="nav-link"
            aria-haspopup="true"
            aria-expanded={open === "blog"}
            onClick={() => toggle("blog")}
          >
            Blog ▾
          </button>
          <ul className="dropdown" role="menu">
            <li><a href="/blog">Blog</a></li>
            <li><a href="/financements">Financements</a></li>
          </ul>
        </li>

        {/* Plus */}
        <li className={`nav-dropdown ${open === "plus" ? "open" : ""}`}>
          <button
            className="nav-link"
            aria-haspopup="true"
            aria-expanded={open === "plus"}
            onClick={() => toggle("plus")}
          >
            Plus ▾
          </button>
          <ul className="dropdown" role="menu">
            <li><a href="/formations">Formations</a></li>
            <li><a href="/financements">Financements</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/indicateurs">Indicateurs</a></li>
            <li><a href="/accessibilite">Accessibilité</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </li>
      </ul>
    </header>
  );
}
