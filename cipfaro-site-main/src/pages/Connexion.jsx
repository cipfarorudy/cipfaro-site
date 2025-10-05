import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthenticated, getCurrentUser } from '../utils/auth'

export default function Connexion() {
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser()
      switch (user.role) {
        case 'admin':
          navigate('/admin')
          break
        case 'formateur':
          navigate('/formateur')
          break
        case 'stagiaire':
          navigate('/stagiaire')
          break
        default:
          navigate('/')
      }
    }
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    // Validation basique
    if (!loginData.email || !loginData.password) {
      setMessage('Veuillez remplir tous les champs')
      setIsLoading(false)
      return
    }

    try {
      const result = await login(loginData.email, loginData.password)
      
      if (result.success) {
        // Connexion réussie
        const user = result.user
        
        // Redirection selon le rôle
        switch (user.role) {
          case 'admin':
            navigate('/admin')
            break
          case 'formateur':
            navigate('/formateur')
            break
          case 'stagiaire':
            navigate('/stagiaire')
            break
          case 'secretariat':
            navigate('/admin') // Même interface que l'admin
            break
          default:
            navigate('/')
        }
      } else {
        setMessage(result.error)
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      setMessage('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="h1">Connexion</h1>
        <p className="lead">
          Accédez à votre espace personnel selon votre profil
        </p>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card">
          <h2>Se connecter</h2>
          
          {message && (
            <div className="message error" style={{
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label htmlFor="userType" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Type de compte
              </label>
              <select
                id="userType"
                name="userType"
                value={loginData.userType}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                <option value="stagiaire">Stagiaire</option>
                <option value="formateur">Formateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <a href="mailto:secretariat@cipfaro-formations.com" style={{ color: '#007bff' }}>
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Comptes de test</h3>
          <p><strong>Administrateur :</strong></p>
          <ul>
            <li>Email : admin@cipfaro-formations.com</li>
            <li>Mot de passe : admin123</li>
          </ul>
          <p><strong>Formateur :</strong></p>
          <ul>
            <li>Email : formateur@cipfaro-formations.com</li>
            <li>Mot de passe : formateur123</li>
          </ul>
          <p><strong>Stagiaire :</strong></p>
          <ul>
            <li>Email : stagiaire@cipfaro-formations.com</li>
            <li>Mot de passe : stagiaire123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}