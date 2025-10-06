import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { requireAuth, logout } from '../utils/auth'

export default function EspaceFormateur() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [groupes, setGroupes] = useState([])
  const [stagiaires, setStagiaires] = useState([])
  const [selectedGroupe, setSelectedGroupe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Vérification de l'authentification
  useEffect(() => {
    const authCheck = requireAuth('formateur')
    
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
    // Simulation de chargement des données
    const mockUserData = {
      nom: 'Jean Martin',
      email: 'jean.martin@cipfaro-formations.com',
      specialite: 'Développement Web',
      dateEmbauche: '2022-09-01'
    }

    const mockGroupes = [
      {
        id: 1,
        nom: 'Promo Web Dev 2024-A',
        formation: 'Développeur Web et Web Mobile',
        dateDebut: '2024-01-15',
        dateFin: '2024-07-15',
        nombreStagiaires: 12,
        statut: 'en_cours',
        prochainCours: {
          date: '2024-01-20',
          heure: '09:00',
          sujet: 'React - Composants avancés',
          duree: '3h'
        },
        progressionMoyenne: 65,
        assiduiteMoyenne: 89
      },
      {
        id: 2,
        nom: 'Promo Web Dev 2023-B',
        formation: 'Développeur Web et Web Mobile',
        dateDebut: '2023-07-10',
        dateFin: '2024-01-10',
        nombreStagiaires: 8,
        statut: 'termine',
        moyenneGroupe: 16.5,
        progressionMoyenne: 100,
        assiduiteMoyenne: 92
      },
      {
        id: 3,
        nom: 'Promo Data 2024-A',
        formation: 'Data Analyst',
        dateDebut: '2024-02-01',
        dateFin: '2024-08-01',
        nombreStagiaires: 10,
        statut: 'planifie',
        progressionMoyenne: 0,
        assiduiteMoyenne: 0
      }
    ]

    const mockStagiaires = [
      {
        id: 1,
        groupeId: 1,
        nom: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        progression: 65,
        derniereConnexion: '2024-01-19',
        notes: [
          { evaluation: 'HTML/CSS', note: 18, date: '2024-01-10' },
          { evaluation: 'JavaScript', note: 16, date: '2024-01-15' },
          { evaluation: 'React Basics', note: 17, date: '2024-01-18' }
        ],
        assiduite: 95,
        statut: 'actif',
        competencesValidees: ['HTML/CSS', 'JavaScript ES6'],
        competencesEnCours: ['React', 'Node.js']
      },
      {
        id: 2,
        groupeId: 1,
        nom: 'Pierre Laurent',
        email: 'pierre.laurent@email.com',
        progression: 72,
        derniereConnexion: '2024-01-18',
        notes: [
          { evaluation: 'HTML/CSS', note: 15, date: '2024-01-10' },
          { evaluation: 'JavaScript', note: 17, date: '2024-01-15' },
          { evaluation: 'React Basics', note: 19, date: '2024-01-18' }
        ],
        assiduite: 88,
        statut: 'actif',
        competencesValidees: ['HTML/CSS', 'JavaScript ES6', 'React'],
        competencesEnCours: ['Node.js', 'API REST']
      },
      {
        id: 3,
        groupeId: 1,
        nom: 'Sophie Bernard',
        email: 'sophie.bernard@email.com',
        progression: 58,
        derniereConnexion: '2024-01-17',
        notes: [
          { evaluation: 'HTML/CSS', note: 14, date: '2024-01-10' },
          { evaluation: 'JavaScript', note: 13, date: '2024-01-15' },
          { evaluation: 'React Basics', note: 15, date: '2024-01-18' }
        ],
        assiduite: 78,
        statut: 'attention',
        competencesValidees: ['HTML/CSS'],
        competencesEnCours: ['JavaScript ES6', 'React']
      },
      {
        id: 4,
        groupeId: 1,
        nom: 'Lucas Moreau',
        email: 'lucas.moreau@email.com',
        progression: 80,
        derniereConnexion: '2024-01-19',
        notes: [
          { evaluation: 'HTML/CSS', note: 19, date: '2024-01-10' },
          { evaluation: 'JavaScript', note: 18, date: '2024-01-15' },
          { evaluation: 'React Basics', note: 20, date: '2024-01-18' }
        ],
        assiduite: 97,
        statut: 'actif',
        competencesValidees: ['HTML/CSS', 'JavaScript ES6', 'React'],
        competencesEnCours: ['Node.js', 'API REST', 'MongoDB']
      }
    ]

    setTimeout(() => {
      setUserData(mockUserData)
      setGroupes(mockGroupes)
      setStagiaires(mockStagiaires)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getStatusBadge = (status) => {
    const styles = {
      en_cours: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      termine: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
      planifie: 'bg-gradient-to-r from-slate-500 to-gray-600 text-white'
    }

    const labels = {
      en_cours: 'En cours',
      termine: 'Terminé',
      planifie: 'Planifié'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]} shadow-lg`}>
        {labels[status]}
      </span>
    )
  }

  const getStagiaireStatusColor = (status) => {
    const colors = {
      actif: 'from-emerald-500 to-teal-600',
      attention: 'from-amber-500 to-orange-600',
      absent: 'from-red-500 to-pink-600'
    }
    return colors[status] || 'from-slate-500 to-gray-600'
  }

  const getProgressColor = (progression) => {
    if (progression >= 70) return 'from-emerald-500 to-green-600'
    if (progression >= 50) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-pink-600'
  }

  const stagiairesGroupe = selectedGroupe 
    ? stagiaires.filter(s => s.groupeId === selectedGroupe.id)
    : []

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
          <h2 className="text-xl font-semibold text-gray-700">Chargement de vos groupes...</h2>
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

  const groupesActifs = groupes.filter(g => g.statut === 'en_cours')
  const totalStagiaires = groupes.reduce((acc, g) => acc + g.nombreStagiaires, 0)
  const progressionMoyenneGlobale = groupes.length > 0 
    ? Math.round(groupes.reduce((acc, g) => acc + g.progressionMoyenne, 0) / groupes.length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">👨‍🏫</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    Espace Formateur
                  </h1>
                  <p className="text-emerald-200 text-lg">Bonjour {userData.nom} !</p>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="text-right text-white/80">
                <p className="text-sm">Spécialité : {userData.specialite}</p>
                <p className="text-xs">Depuis le {new Date(userData.dateEmbauche).toLocaleDateString('fr-FR')}</p>
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
            id="groupes"
            label="Mes groupes"
            icon="👥"
            active={activeTab === 'groupes'}
            onClick={setActiveTab}
          />
          <TabButton
            id="stagiaires"
            label="Suivi individuel"
            icon="🎯"
            active={activeTab === 'stagiaires'}
            onClick={setActiveTab}
          />
          <TabButton
            id="evaluations"
            label="Évaluations"
            icon="📝"
            active={activeTab === 'evaluations'}
            onClick={setActiveTab}
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Groupes actifs"
                value={groupesActifs.length}
                icon="👥"
                color="text-emerald-400"
                bgColor="bg-gradient-to-br from-emerald-500/20 to-teal-600/20"
              />
              <StatCard
                title="Total stagiaires"
                value={totalStagiaires}
                icon="🎓"
                color="text-cyan-400"
                bgColor="bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
              />
              <StatCard
                title="Progression moyenne"
                value={`${progressionMoyenneGlobale}%`}
                icon="📈"
                color="text-purple-400"
                bgColor="bg-gradient-to-br from-purple-500/20 to-violet-600/20"
              />
              <StatCard
                title="Groupes terminés"
                value={groupes.filter(g => g.statut === 'termine').length}
                icon="✅"
                color="text-orange-400"
                bgColor="bg-gradient-to-br from-orange-500/20 to-red-600/20"
              />
            </div>

            {/* Prochains cours */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Prochains cours</h2>
              <div className="space-y-4">
                {groupesActifs.map((groupe) => groupe.prochainCours && (
                  <div key={groupe.id} className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur border border-emerald-300/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{groupe.nom}</h3>
                      <span className="text-emerald-300 text-sm">{groupe.nombreStagiaires} stagiaires</span>
                    </div>
                    <div className="text-white/80 text-sm mb-1">
                      📅 {new Date(groupe.prochainCours.date).toLocaleDateString('fr-FR')} à {groupe.prochainCours.heure} ({groupe.prochainCours.duree})
                    </div>
                    <div className="text-emerald-200 font-medium">
                      📚 {groupe.prochainCours.sujet}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Moodle</h3>
                  <p className="text-white/60 text-sm mb-4">Gérer vos cours</p>
                  <a 
                    href="https://cipfaro.org" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-block text-sm"
                  >
                    Accéder
                  </a>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">📚</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Ressources</h3>
                  <p className="text-white/60 text-sm mb-4">Supports de cours</p>
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm">
                    Voir ressources
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">📝</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Évaluations</h3>
                  <p className="text-white/60 text-sm mb-4">Créer des tests</p>
                  <button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm">
                    Gérer
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Rapports</h3>
                  <p className="text-white/60 text-sm mb-4">Suivre les progrès</p>
                  <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm">
                    Générer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Groupes Tab */}
        {activeTab === 'groupes' && (
          <div className="space-y-6">
            {groupes.map((groupe) => (
              <div 
                key={groupe.id} 
                className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer ${
                  selectedGroupe?.id === groupe.id ? 'ring-2 ring-emerald-400 bg-white/15' : ''
                }`}
                onClick={() => setSelectedGroupe(selectedGroupe?.id === groupe.id ? null : groupe)}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{groupe.nom}</h3>
                      {getStatusBadge(groupe.statut)}
                    </div>
                    <p className="text-white/60 mb-1">{groupe.formation}</p>
                    <p className="text-white/60 text-sm">
                      Du {new Date(groupe.dateDebut).toLocaleDateString('fr-FR')} au {new Date(groupe.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {groupe.moyenneGroupe && (
                    <div className="mt-4 lg:mt-0">
                      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 backdrop-blur border border-emerald-300/20 rounded-xl p-3">
                        <p className="text-emerald-300 font-semibold">Moyenne groupe</p>
                        <p className="text-white text-lg font-bold">{groupe.moyenneGroupe}/20</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-300">{groupe.nombreStagiaires}</p>
                    <p className="text-white/60 text-sm">Stagiaires</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-300">{groupe.progressionMoyenne}%</p>
                    <p className="text-white/60 text-sm">Progression</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-300">{groupe.assiduiteMoyenne}%</p>
                    <p className="text-white/60 text-sm">Assiduité</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-300">{groupe.statut === 'en_cours' ? '●' : groupe.statut === 'termine' ? '✓' : '○'}</p>
                    <p className="text-white/60 text-sm">Statut</p>
                  </div>
                </div>

                {groupe.prochainCours && groupe.statut === 'en_cours' && (
                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur border border-emerald-300/20 rounded-xl p-4 mb-4">
                    <h4 className="text-emerald-300 font-semibold mb-2">Prochain cours</h4>
                    <div className="text-white/80">
                      📅 {new Date(groupe.prochainCours.date).toLocaleDateString('fr-FR')} à {groupe.prochainCours.heure} ({groupe.prochainCours.duree})
                    </div>
                    <div className="text-emerald-200 font-medium">
                      📚 {groupe.prochainCours.sujet}
                    </div>
                  </div>
                )}

                <div className="text-center text-white/60 text-sm">
                  {selectedGroupe?.id === groupe.id ? 'Cliquez pour masquer les détails' : 'Cliquez pour voir les stagiaires'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stagiaires Tab ou Détails du groupe */}
        {(activeTab === 'stagiaires' || selectedGroupe) && (
          <div className="space-y-6">
            {selectedGroupe && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Stagiaires - {selectedGroupe.nom}
                </h2>
                
                {/* Statistiques du groupe */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur border border-cyan-300/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-300">{stagiairesGroupe.length}</p>
                    <p className="text-white/60 text-sm">Total stagiaires</p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 backdrop-blur border border-emerald-300/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-300">
                      {stagiairesGroupe.filter(s => s.statut === 'actif').length}
                    </p>
                    <p className="text-white/60 text-sm">Actifs</p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 backdrop-blur border border-amber-300/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-300">
                      {stagiairesGroupe.filter(s => s.statut === 'attention').length}
                    </p>
                    <p className="text-white/60 text-sm">Attention</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-violet-600/20 backdrop-blur border border-purple-300/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-300">
                      {stagiairesGroupe.length > 0 ? Math.round(stagiairesGroupe.reduce((acc, s) => acc + s.progression, 0) / stagiairesGroupe.length) : 0}%
                    </p>
                    <p className="text-white/60 text-sm">Progression moy.</p>
                  </div>
                </div>

                {/* Liste des stagiaires */}
                <div className="space-y-4">
                  {stagiairesGroupe.map((stagiaire) => (
                    <div key={stagiaire.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-white font-semibold text-lg">{stagiaire.nom}</h4>
                            <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStagiaireStatusColor(stagiaire.statut)}`} />
                          </div>
                          <p className="text-white/60 mb-4">
                            {stagiaire.email} • Dernière connexion : {new Date(stagiaire.derniereConnexion).toLocaleDateString('fr-FR')}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-medium">Progression</span>
                                <span className="text-white font-bold">{stagiaire.progression}%</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${getProgressColor(stagiaire.progression)} rounded-full transition-all duration-500`}
                                  style={{ width: `${stagiaire.progression}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <span className="text-white font-medium">Assiduité : </span>
                              <span className="text-white">{stagiaire.assiduite}%</span>
                            </div>
                          </div>

                          {/* Compétences */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            {stagiaire.competencesValidees && stagiaire.competencesValidees.length > 0 && (
                              <div>
                                <h5 className="text-emerald-300 font-medium mb-2">✅ Compétences validées</h5>
                                <div className="flex flex-wrap gap-2">
                                  {stagiaire.competencesValidees.map((comp, idx) => (
                                    <span key={idx} className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-200 px-2 py-1 rounded-full text-xs">
                                      {comp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {stagiaire.competencesEnCours && stagiaire.competencesEnCours.length > 0 && (
                              <div>
                                <h5 className="text-amber-300 font-medium mb-2">⏳ En cours</h5>
                                <div className="flex flex-wrap gap-2">
                                  {stagiaire.competencesEnCours.map((comp, idx) => (
                                    <span key={idx} className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-200 px-2 py-1 rounded-full text-xs">
                                      {comp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Notes */}
                          {stagiaire.notes.length > 0 && (
                            <div>
                              <h5 className="text-white font-medium mb-2">📝 Dernières notes</h5>
                              <div className="flex flex-wrap gap-2">
                                {stagiaire.notes.map((note, index) => (
                                  <span key={index} className="bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-blue-200 px-3 py-1 rounded-full text-sm">
                                    {note.evaluation}: {note.note}/20
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-3 lg:ml-6">
                          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm">
                            📧 Contacter
                          </button>
                          <button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm">
                            👤 Voir profil
                          </button>
                          <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm">
                            📝 Noter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {stagiairesGroupe.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white/60 text-2xl">👥</span>
                    </div>
                    <p className="text-white/60">Aucun stagiaire dans ce groupe</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Évaluations Tab */}
        {activeTab === 'evaluations' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Gestion des évaluations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur border border-blue-300/20 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">➕</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Créer une évaluation</h3>
                  <p className="text-white/60 text-sm mb-4">Nouvelle évaluation pour un groupe</p>
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    Créer
                  </button>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 backdrop-blur border border-emerald-300/20 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📋</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Mes évaluations</h3>
                  <p className="text-white/60 text-sm mb-4">Consulter et modifier</p>
                  <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    Consulter
                  </button>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-violet-600/20 backdrop-blur border border-purple-300/20 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Résultats</h3>
                  <p className="text-white/60 text-sm mb-4">Analyser les performances</p>
                  <button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    Analyser
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}