import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const KEY = 'cookie-consent-v1'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (!saved) setOpen(true)
  }, [])

  function decide(value) {
    localStorage.setItem(KEY, value) // "accept" | "reject"
    setOpen(false)
    // TODO: activer/désactiver vos tags (Analytics, etc.) en fonction de value
  }

  if (!open) return null

  return (
    <div className="cookie-banner">
      <strong>🍪 Cookies</strong>
      <p className="muted">
        Nous utilisons des cookies pour mesurer l'audience et améliorer nos services.
        Vous pouvez accepter ou refuser librement. Vous pourrez changer d'avis à tout moment.
      </p>
      <div className="cookie-banner-buttons">
        <button className="btn" onClick={() => decide('reject')}>Tout refuser</button>
        <button className="btn primary" onClick={() => decide('accept')}>Tout accepter</button>
        <a className="btn" href="/politique-confidentialite">En savoir plus</a>
      </div>
    </div>
  )
}