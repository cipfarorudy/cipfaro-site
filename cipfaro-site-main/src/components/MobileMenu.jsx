import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function MobileMenu(){
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    function onKey(e){
      if(e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[])

  return (
    <>
      <button aria-label={open? 'Fermer le menu' : 'Ouvrir le menu'} className="mobile-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d={open ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={"mobile-panel " + (open? 'open':'')} role="dialog" aria-modal={open} aria-hidden={!open}>
        <div className="panel-inner" role="menu">
          <nav aria-label="Menu mobile">
            <Link to="/" onClick={()=>setOpen(false)}>Accueil</Link>
            <Link to="/formations" onClick={()=>setOpen(false)}>Formations</Link>
            <Link to="/devis" onClick={()=>setOpen(false)}>Devis</Link>
            <Link to="/preinscription" onClick={()=>setOpen(false)}>Préinscription</Link>
            <Link to="/financements" onClick={()=>setOpen(false)}>Financements</Link>
            <Link to="/indicateurs" onClick={()=>setOpen(false)}>Indicateurs</Link>
            <Link to="/accessibilite" onClick={()=>setOpen(false)}>Accessibilité</Link>
            <Link to="/reclamations" onClick={()=>setOpen(false)}>Réclamations</Link>
            <Link to="/contact" onClick={()=>setOpen(false)}>Contact</Link>
          </nav>
        </div>
      </div>
    </>
  )
}
