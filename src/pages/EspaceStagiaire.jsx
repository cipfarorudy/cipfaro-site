import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { requireAuth, logout } from '../utils/auth'

export default function EspaceStagiaire() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [formations, setFormations] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Vérification de l'authentification
  useEffect(() => {
    const authCheck = requireAuth('stagiaire')
    
    if (!authCheck.authenticated) {
      navigate(authCheck.redirectTo)
      return
    }

    if (!authCheck.authorized) {
      navigate('/')
      return
    }
    
    setIsAuthenticated(true)
  }, [navigate])

  useEffect(() => {
    // Simulation de chargement des données utilisateur
    const mockUserData = {
      nom: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      promotion: '2024-Web-Dev',
      dateInscription: '2024-01-10',
      statut: 'en_formation'
    }

    const mockFormations = [
      {
        id: 1,
        titre: 'Développeur Web et Web Mobile',
        progression: 65,
        duree: '6 mois',
        dateDebut: '2024-01-15',
        dateFin: '2024-07-15',
        formateur: 'Jean Martin',
        statut: 'en_cours',
        prochaineCours: {
          date: '2024-01-20',
          heure: '09:00',
          sujet: 'React - Composants avancés'
        },
        competencesAcquises: ['HTML/CSS', 'JavaScript ES6', 'React Basics'],
        competencesEnCours: ['React Advanced', 'Node.js', 'API REST']
      },
      {
        id: 2,
        titre: 'JavaScript Avancé',
        progression: 100,
        duree: '2 mois',
        dateDebut: '2023-11-01',
        dateFin: '2023-12-31',
        formateur: 'Sophie Laurent',
        statut: 'termine',
        note: 'A - 18/20',
        competencesAcquises: ['ES6+', 'Async/Await', 'POO JavaScript', 'Modules ES6'],
        certification: 'Validé avec mention'
      },
      {
        id: 3,
        titre: 'Base de données MySQL',
        progression: 30,
        duree: '3 mois',
        dateDebut: '2024-02-01',
        dateFin: '2024-04-30',
        formateur: 'Pierre Rousseau',
        statut: 'en_cours',
        competencesEnCours: ['SQL de base', 'Jointures', 'Optimisation'],
        prochaineCours: {
          date: '2024-01-22',
          heure: '14:00',
          sujet: 'Jointures complexes'
        }
      }
    ]

    const mockDocuments = [
      {
        id: 1,
        nom: 'Convention de stage',
        type: 'PDF',
        taille: '245 KB',
        dateAjout: '2024-01-10',
        categorie: 'administratif'
      },
      {
        id: 2,
        nom: 'Planning formation Web Dev',
        type: 'PDF',
        taille: '156 KB',
        dateAjout: '2024-01-12',
        categorie: 'formation'
      },
      {
        id: 3,
        nom: 'Supports de cours React',
        type: 'ZIP',
        taille: '2.1 MB',
        dateAjout: '2024-01-15',
        categorie: 'cours'
      },
      {
        id: 4,
        nom: 'Évaluation JS - Correction',
        type: 'PDF',
        taille: '89 KB',
        dateAjout: '2024-01-18',
        categorie: 'evaluation'
      },
      {
        id: 5,
        nom: 'Certificat JavaScript Avancé',
        type: 'PDF',
        taille: '312 KB',
        dateAjout: '2024-01-02',
        categorie: 'certificat'
      }
    ]

    setTimeout(() => {
      setUserData(mockUserData)
      setFormations(mockFormations)
      setDocuments(mockDocuments)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getProgressColor = (progression) => {
    if (progression >= 80) return 'from-emerald-500 to-green-600'
    if (progression >= 60) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-pink-600'
  }

  const getStatusBadge = (status) => {
    const styles = {
      en_cours: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      termine: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
      en_attente: 'bg-gradient-to-r from-slate-500 to-gray-600 text-white'
    }

    const labels = {
      en_cours: 'En cours',
      termine: 'Terminé',
      en_attente: 'En attente'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]} shadow-lg`}>
        {labels[status]}
      </span>
    )
  }

  const getCategoryIcon = (categorie) => {
    const icons = {
      administratif: '📋',
      formation: '📚',
      cours: '💻',
      evaluation: '📝',
      certificat: '🏆'
    }
    return icons[categorie] || '📄'
  }

  const getCategoryColor = (categorie) => {
    const colors = {
      administratif: 'from-slate-500/20 to-gray-600/20',
      formation: 'from-blue-500/20 to-indigo-600/20',
      cours: 'from-purple-500/20 to-violet-600/20',
      evaluation: 'from-orange-500/20 to-red-600/20',
      certificat: 'from-yellow-500/20 to-amber-600/20'
    }
    return colors[categorie] || 'from-gray-500/20 to-slate-600/20'
  }

  // Vérification de l'authentification avant affichage
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Vérification des droits d'accès...</h2>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-pulse flex space-x-4 mb-4">
            <div className="rounded-full bg-indigo-400 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-indigo-400 rounded w-3/4"></div>
              <div className="h-4 bg-indigo-400 rounded w-1/2"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Chargement de vos données...</h2>
        </div>
      </div>
    )
  }

  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className={`${bgColor} backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  )

  const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
        active
          ? 'bg-white text-indigo-600 shadow-lg'
          : 'text-white/80 hover:text-white hover:bg-white/10'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )

  const formationsEnCours = formations.filter(f => f.statut === 'en_cours')
  const formationsTerminees = formations.filter(f => f.statut === 'termine')
  const progressionMoyenne = formations.length > 0 
    ? Math.round(formations.reduce((acc, f) => acc + f.progression, 0) / formations.length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-800 to-indigo-900">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🎓</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Espace Stagiaire
                  </h1>
                  <p className="text-cyan-200 text-lg">Bonjour {userData.nom} !</p>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="text-right text-white/80">
                <p className="text-sm">Promotion {userData.promotion}</p>
                <p className="text-xs">Inscrit depuis le {new Date(userData.dateInscription).toLocaleDateString('fr-FR')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Navigation tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 mb-8 flex flex-wrap gap-2">
          <TabButton
            id="dashboard"
            label="Tableau de bord"
            icon="📊"
            active={activeTab === 'dashboard'}
            onClick={setActiveTab}
          />
          <TabButton
            id="formations"
            label="Mes formations"
            icon="📚"
            active={activeTab === 'formations'}
            onClick={setActiveTab}
          />
          <TabButton
            id="documents"
            label="Documents"
            icon="📄"
            active={activeTab === 'documents'}
            onClick={setActiveTab}
          />
          <TabButton
            id="competences"
            label="Compétences"
            icon="🎯"
            active={activeTab === 'competences'}
            onClick={setActiveTab}
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Formations en cours"
                value={formationsEnCours.length}
                icon="📖"
                color="text-cyan-400"
                bgColor="bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
              />
              <StatCard
                title="Formations terminées"
                value={formationsTerminees.length}
                icon="✅"
                color="text-emerald-400"
                bgColor="bg-gradient-to-br from-emerald-500/20 to-teal-600/20"
              />
              <StatCard
                title="Progression moyenne"
                value={`${progressionMoyenne}%`}
                icon="📈"
                color="text-purple-400"
                bgColor="bg-gradient-to-br from-purple-500/20 to-violet-600/20"
              />
              <StatCard
                title="Documents"
                value={documents.length}
                icon="📋"
                color="text-orange-400"
                bgColor="bg-gradient-to-br from-orange-500/20 to-red-600/20"
              />
            </div>

            {/* Prochains cours */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Prochains cours</h2>
              <div className="space-y-4">
                {formationsEnCours.map((formation) => formation.prochaineCours && (
                  <div key={formation.id} className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur border border-blue-300/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{formation.titre}</h3>
                      <span className="text-cyan-300 text-sm">{formation.formateur}</span>
                    </div>
                    <div className="text-white/80 text-sm">
                      📅 {new Date(formation.prochaineCours.date).toLocaleDateString('fr-FR')} à {formation.prochaineCours.heure}
                    </div>
                    <div className="text-cyan-200 font-medium">
                      📚 {formation.prochaineCours.sujet}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Mes cours</h3>
                  <p className="text-white/60 text-sm mb-4">Accédez à votre plateforme e-learning</p>
                  <a 
                    href="https://cipfaro.org" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-block"
                  >
                    Accéder à Moodle
                  </a>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">📞</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Contact</h3>
                  <p className="text-white/60 text-sm mb-4">Contactez votre formateur</p>
                  <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    Nous contacter
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">💼</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Mon CV</h3>
                  <p className="text-white/60 text-sm mb-4">Mettre à jour votre CV</p>
                  <button 
                    onClick={() => window.location.href = '/recrutement'}
                    className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Gérer mon CV
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formations Tab */}
        {activeTab === 'formations' && (
          <div className="space-y-6">
            {formations.map((formation) => (
              <div key={formation.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{formation.titre}</h3>
                      {getStatusBadge(formation.statut)}
                    </div>
                    <p className="text-white/60">
                      Formateur : {formation.formateur} • Durée : {formation.duree}
                    </p>
                    <p className="text-white/60 text-sm">
                      Du {new Date(formation.dateDebut).toLocaleDateString('fr-FR')} au {new Date(formation.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {formation.note && (
                    <div className="mt-4 lg:mt-0">
                      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 backdrop-blur border border-emerald-300/20 rounded-xl p-3">
                        <p className="text-emerald-300 font-semibold">Note finale</p>
                        <p className="text-white text-lg font-bold">{formation.note}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progression */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Progression</span>
                    <span className="text-white font-bold text-lg">{formation.progression}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getProgressColor(formation.progression)} rounded-full transition-all duration-500`}
                      style={{ width: `${formation.progression}%` }}
                    />
                  </div>
                </div>

                {/* Prochain cours */}
                {formation.prochaineCours && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur border border-blue-300/20 rounded-xl p-4 mb-4">
                    <h4 className="text-cyan-300 font-semibold mb-2">Prochain cours</h4>
                    <div className="text-white/80">
                      📅 {new Date(formation.prochaineCours.date).toLocaleDateString('fr-FR')} à {formation.prochaineCours.heure}
                    </div>
                    <div className="text-cyan-200 font-medium">
                      📚 {formation.prochaineCours.sujet}
                    </div>
                  </div>
                )}

                {/* Compétences */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {formation.competencesAcquises && (
                    <div>
                      <h4 className="text-emerald-300 font-medium mb-2">✅ Compétences acquises</h4>
                      <div className="flex flex-wrap gap-2">
                        {formation.competencesAcquises.map((comp, idx) => (
                          <span key={idx} className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-200 px-3 py-1 rounded-full text-sm">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {formation.competencesEnCours && (
                    <div>
                      <h4 className="text-amber-300 font-medium mb-2">⏳ En cours d'acquisition</h4>
                      <div className="flex flex-wrap gap-2">
                        {formation.competencesEnCours.map((comp, idx) => (
                          <span key={idx} className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-200 px-3 py-1 rounded-full text-sm">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Mes documents ({documents.length})</h2>
              </div>
              
              {documents.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white/60 text-2xl">📄</span>
                  </div>
                  <p className="text-white/60">Aucun document disponible</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-6 hover:bg-white/5 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(doc.categorie)} backdrop-blur border border-white/20 rounded-xl flex items-center justify-center`}>
                            <span className="text-xl">{getCategoryIcon(doc.categorie)}</span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{doc.nom}</h3>
                            <p className="text-white/60 text-sm">
                              {doc.type} • {doc.taille} • Ajouté le {new Date(doc.dateAjout).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2">
                          <span>📥</span>
                          <span>Télécharger</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compétences Tab */}
        {activeTab === 'competences' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compétences acquises */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <span className="text-white">✅</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Compétences acquises</h2>
                </div>
                
                <div className="space-y-4">
                  {formations.map((formation) => formation.competencesAcquises && (
                    <div key={formation.id}>
                      <h3 className="text-emerald-300 font-medium mb-2">{formation.titre}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formation.competencesAcquises.map((comp, idx) => (
                          <span key={idx} className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-200 px-3 py-1 rounded-full text-sm border border-emerald-300/20">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compétences en cours */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <span className="text-white">⏳</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">En cours d'acquisition</h2>
                </div>
                
                <div className="space-y-4">
                  {formations.map((formation) => formation.competencesEnCours && (
                    <div key={formation.id}>
                      <h3 className="text-amber-300 font-medium mb-2">{formation.titre}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formation.competencesEnCours.map((comp, idx) => (
                          <span key={idx} className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-200 px-3 py-1 rounded-full text-sm border border-amber-300/20">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Certification */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <span className="text-white">🏆</span>
                </div>
                <h2 className="text-xl font-semibold text-white">Certifications obtenues</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formations.filter(f => f.certification).map((formation) => (
                  <div key={formation.id} className="bg-gradient-to-r from-yellow-500/20 to-amber-600/20 backdrop-blur border border-yellow-300/20 rounded-xl p-4">
                    <h3 className="text-yellow-200 font-semibold">{formation.titre}</h3>
                    <p className="text-white/80">{formation.certification}</p>
                    <p className="text-yellow-300 text-sm mt-1">{formation.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}