import { useState } from 'react'

export default function Contact() {
  const [isSending, setIsSending] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [wantsCallback, setWantsCallback] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSending(true)

    // Simulation d'envoi (remplacez par fetch -> API réel si besoin)
    setTimeout(() => {
      setIsSending(false)
      setSuccessMessage('Votre message a bien été envoyé. Nous vous recontacterons sous 48h.')
    }, 900)
  }

  return (
    <div>
      <h1>Contact</h1>
      <p className="muted" style={{ marginBottom: '2rem' }}>
        Une question ? Un projet de formation ? N'hésitez pas à nous contacter.
      </p>

      <div className="grid">
        <div className="card">
          <h2>📍 Adresse</h2>
          <p>
            CIP FARO Rudy<br />
            Chemin Coulée Zebsi<br />
            97139 Les Abymes
          </p>
        </div>

        <div className="card">
          <h2>📞 Téléphone</h2>
          <p>
            <strong>Accueil :</strong> 0690570846<br />
            <strong>Secrétariat :</strong> 069570846
          </p>
        </div>

        <div className="card">
          <h2>✉️ Email</h2>
          <p>
            <strong>Contact général :</strong><br />
            secretariat@cipfaro-formations.com
            <br /><br />
            <strong>Référent handicap :</strong><br />
            referent.handicap@cipfaro-formations.com
          </p>
        </div>

        <div className="card">
          <h2>🕒 Horaires</h2>
          <p>
            <strong>Lundi - Jeudi :</strong><br />
            8h00 - 17h00<br />
            <br />
            <strong>Vendredi :</strong><br />
            8h00 - 16h00
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Formulaire de contact</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
          <div>
            <label htmlFor="nom" style={{ display: 'block', marginBottom: '.3rem', fontWeight: 'bold' }}>
              Nom *
            </label>
            <input type="text" id="nom" name="nom" required style={{ width: '100%', padding: '.6rem', border: '1px solid #e5e7eb', borderRadius: '.5rem' }} />
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '.3rem', fontWeight: 'bold' }}>
              Email *
            </label>
            <input type="email" id="email" name="email" required style={{ width: '100%', padding: '.6rem', border: '1px solid #e5e7eb', borderRadius: '.5rem' }} />
          </div>

          <div>
            <label htmlFor="telephone" style={{ display: 'block', marginBottom: '.3rem', fontWeight: 'bold' }}>
              Téléphone
            </label>
            <input type="tel" id="telephone" name="telephone" style={{ width: '100%', padding: '.6rem', border: '1px solid #e5e7eb', borderRadius: '.5rem' }} />
          </div>

          <div>
            <label htmlFor="objet" style={{ display: 'block', marginBottom: '.3rem', fontWeight: 'bold' }}>
              Objet *
            </label>
            <select id="objet" name="objet" required style={{ width: '100%', padding: '.6rem', border: '1px solid #e5e7eb', borderRadius: '.5rem' }}>
              <option value="">Choisissez un objet</option>
              <option value="information-formation">Information sur une formation</option>
              <option value="inscription">Demande d'inscription</option>
              <option value="financement">Question sur le financement</option>
              <option value="accessibilite">Accessibilité / Handicap</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '.3rem', fontWeight: 'bold' }}>
              Message *
            </label>
            <textarea id="message" name="message" required rows="5" style={{ width: '100%', padding: '.6rem', border: '1px solid #e5e7eb', borderRadius: '.5rem', resize: 'vertical' }} placeholder="Décrivez votre demande..."></textarea>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <input type="checkbox" checked={wantsCallback} onChange={(e) => setWantsCallback(e.target.checked)} />
            Je souhaite être relancé(e)
          </label>

          {wantsCallback && (
            <div>
              <label htmlFor="prefhoraire" style={{ display: 'block', marginBottom: '.3rem', fontWeight: 'bold' }}>Préférence horaire</label>
              <input id="prefhoraire" name="prefhoraire" placeholder="Ex: Mardi matin" style={{ width: '100%', padding: '.6rem', border: '1px solid #e5e7eb', borderRadius: '.5rem' }} />
            </div>
          )}

          <button type="submit" className="btn primary" disabled={isSending}>{isSending ? 'Envoi...' : 'Envoyer le message'}</button>

          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <p className="muted" style={{ fontSize: '.8rem' }}>
            * Champs obligatoires<br />
            Vos données personnelles sont traitées conformément à notre <a href="/politique-confidentialite" style={{ color: '#0ea5e9' }}>politique de confidentialité</a>.
          </p>
        </form>
      </div>
    </div>
  )
}