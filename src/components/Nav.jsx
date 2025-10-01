import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom'
import "./Nav.css";

export default function Nav() {
  const [open, setOpen] = useState(null); // "formations" | "pages" | "blog" | "plus" | null
  const navRef = useRef(null);
  const topButtonsRef = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuKeys = ["formations", "pages", "blog", "plus"];

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

  // Helper to focus a top-level button by index
  const focusTopButton = (idx) => {
    const btn = topButtonsRef.current[idx];
    if (btn && typeof btn.focus === 'function') btn.focus();
  };

  // Focus first/last menuitem of a dropdown
  const focusMenuItem = (key, which = 'first') => {
    if (!navRef.current) return;
    const dropdown = navRef.current.querySelector(`.nav-dropdown.${key} .dropdown`);
    if (!dropdown) return;
    const items = dropdown.querySelectorAll('[role="menuitem"]');
    if (!items || items.length === 0) return;
    if (which === 'first') items[0].focus();
    else if (which === 'last') items[items.length - 1].focus();
  };

  // Keydown handler for top-level buttons
  const onTopButtonKeyDown = (e, idx, keyName) => {
    const len = menuKeys.length;
    switch (e.key) {
      case 'ArrowRight': {
        const next = (idx + 1) % len;
        setFocusedIndex(next);
        focusTopButton(next);
        e.preventDefault();
        break;
      }
      case 'ArrowLeft': {
        const prev = (idx - 1 + len) % len;
        setFocusedIndex(prev);
        focusTopButton(prev);
        e.preventDefault();
        break;
      }
      case 'Home': {
        setFocusedIndex(0);
        focusTopButton(0);
        e.preventDefault();
        break;
      }
      case 'End': {
        setFocusedIndex(len - 1);
        focusTopButton(len - 1);
        e.preventDefault();
        break;
      }
      case 'ArrowDown': {
        // open submenu and focus first item
        setOpen(keyName);
        // wait for DOM update
        requestAnimationFrame(() => focusMenuItem(keyName, 'first'));
        e.preventDefault();
        break;
      }
      case 'Enter':
      case ' ': {
        // toggle submenu
        const willOpen = open !== keyName;
        toggle(keyName);
        if (willOpen) requestAnimationFrame(() => focusMenuItem(keyName, 'first'));
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  };

  // Keydown handler for items inside menus
  const onMenuItemKeyDown = (e, parentKey) => {
    const dropdown = navRef.current.querySelector(`.nav-dropdown.${parentKey} .dropdown`);
    if (!dropdown) return;
    const items = Array.from(dropdown.querySelectorAll('[role="menuitem"]'));
    const current = items.indexOf(e.target);
    switch (e.key) {
      case 'ArrowDown': {
        const next = (current + 1) % items.length;
        items[next].focus();
        e.preventDefault();
        break;
      }
      case 'ArrowUp': {
        const prev = (current - 1 + items.length) % items.length;
        items[prev].focus();
        e.preventDefault();
        break;
      }
      case 'Home': {
        items[0].focus();
        e.preventDefault();
        break;
      }
      case 'End': {
        items[items.length - 1].focus();
        e.preventDefault();
        break;
      }
      case 'Escape': {
        setOpen(null);
        // focus the parent top-level button
        const idx = menuKeys.indexOf(parentKey);
        setTimeout(()=> focusTopButton(idx), 0);
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  };

  return (
    <nav className="main-nav" id="main-navigation" ref={navRef} aria-label="Navigation principale">
  <ul className="main-nav-list" role="menubar" aria-label="Navigation principale">
        {/* Formations */}
        <li className={`nav-dropdown ${open === "formations" ? "open" : ""}`} role="none">
          <button
            ref={(el)=> topButtonsRef.current[0]=el}
            className="nav-link"
            aria-haspopup="true"
            aria-expanded={open === "formations"}
            onClick={() => { setFocusedIndex(0); toggle("formations"); }}
            onFocus={() => setFocusedIndex(0)}
            onKeyDown={(e)=> onTopButtonKeyDown(e, 0, 'formations')}
            tabIndex={focusedIndex === 0 ? 0 : -1}
          >
            Formations ▾
          </button>
          <ul className="dropdown" role="menu">
            <li role="none"><Link to="/formations" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'formations')} onClick={()=>setOpen(null)}>Toutes les formations</Link></li>
            <li role="none"><Link to="/devis" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'formations')} onClick={()=>setOpen(null)}>Devis</Link></li>
            <li role="none"><Link to="/preinscription" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'formations')} onClick={()=>setOpen(null)}>Préinscription</Link></li>
            <li role="none"><Link to="/financements" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'formations')} onClick={()=>setOpen(null)}>Financements</Link></li>
          </ul>
        </li>

        {/* Pages */}
        <li className={`nav-dropdown ${open === "pages" ? "open" : ""}`} role="none">
          <button
            ref={(el)=> topButtonsRef.current[1]=el}
            className="nav-link"
            aria-haspopup="true"
            aria-expanded={open === "pages"}
            onClick={() => { setFocusedIndex(1); toggle("pages"); }}
            onFocus={() => setFocusedIndex(1)}
            onKeyDown={(e)=> onTopButtonKeyDown(e, 1, 'pages')}
            tabIndex={focusedIndex === 1 ? 0 : -1}
          >
            Pages ▾
          </button>
          <ul className="dropdown" role="menu">
            <li role="none"><Link to="/indicateurs" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'pages')} onClick={()=>setOpen(null)}>Indicateurs</Link></li>
            <li role="none"><Link to="/accessibilite" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'pages')} onClick={()=>setOpen(null)}>Accessibilité</Link></li>
            <li role="none"><Link to="/reclamations" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'pages')} onClick={()=>setOpen(null)}>Réclamations</Link></li>
            <li role="none"><Link to="/contact" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'pages')} onClick={()=>setOpen(null)}>Contact</Link></li>
            <li role="none"><Link to="/mentions-legales" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'pages')} onClick={()=>setOpen(null)}>Mentions légales</Link></li>
            <li role="none"><Link to="/politique_confidentialite" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'pages')} onClick={()=>setOpen(null)}>Politique</Link></li>
            <li role="none"><Link to="/cgv" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'pages')} onClick={()=>setOpen(null)}>CGV</Link></li>
          </ul>
        </li>

        {/* Blog */}
        <li className={`nav-dropdown ${open === "blog" ? "open" : ""}`} role="none">
          <button
            ref={(el)=> topButtonsRef.current[2]=el}
            className="nav-link"
            aria-haspopup="true"
            aria-expanded={open === "blog"}
            onClick={() => { setFocusedIndex(2); toggle("blog"); }}
            onFocus={() => setFocusedIndex(2)}
            onKeyDown={(e)=> onTopButtonKeyDown(e, 2, 'blog')}
            tabIndex={focusedIndex === 2 ? 0 : -1}
          >
            Blog ▾
          </button>
          <ul className="dropdown" role="menu">
            <li role="none"><Link to="/page-blanche" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'blog')} onClick={()=>setOpen(null)}>Blog</Link></li>
            <li role="none"><Link to="/financements" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'blog')} onClick={()=>setOpen(null)}>Financements</Link></li>
          </ul>
        </li>

        {/* Plus */}
        <li className={`nav-dropdown ${open === "plus" ? "open" : ""}`} role="none">
          <button
            ref={(el)=> topButtonsRef.current[3]=el}
            className="nav-link"
            aria-haspopup="true"
            aria-expanded={open === "plus"}
            onClick={() => { setFocusedIndex(3); toggle("plus"); }}
            onFocus={() => setFocusedIndex(3)}
            onKeyDown={(e)=> onTopButtonKeyDown(e, 3, 'plus')}
            tabIndex={focusedIndex === 3 ? 0 : -1}
          >
            Plus ▾
          </button>
          <ul className="dropdown" role="menu">
            <li role="none"><Link to="/formations" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'plus')} onClick={()=>setOpen(null)}>Formations</Link></li>
            <li role="none"><Link to="/financements" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'plus')} onClick={()=>setOpen(null)}>Financements</Link></li>
            <li role="none"><Link to="/page-blanche" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'plus')} onClick={()=>setOpen(null)}>Blog</Link></li>
            <li role="none"><Link to="/indicateurs" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'plus')} onClick={()=>setOpen(null)}>Indicateurs</Link></li>
            <li role="none"><Link to="/accessibilite" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'plus')} onClick={()=>setOpen(null)}>Accessibilité</Link></li>
            <li role="none"><Link to="/contact" role="menuitem" tabIndex={-1} onKeyDown={(e)=>onMenuItemKeyDown(e,'plus')} onClick={()=>setOpen(null)}>Contact</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
