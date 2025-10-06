import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { requireAuth, logout, hasPermission } from '../utils/auth'
import { useNotifications, NotificationContainer } from '../utils/notifications.jsx'

export default function EspaceAdmin() {
  const navigate = useNavigate()
  const [cvList, setCvList] = useState([])
  const [filteredCVs, setFilteredCVs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('tous')
  const [selectedCV, setSelectedCV] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const notifications = useNotifications()

  // Vérification de l'authentification
  useEffect(() => {
    const authCheck = requireAuth()
    
    if (!authCheck.authenticated) {
      navigate(authCheck.redirectTo)
      return
    }

    if (!hasPermission('users') && !hasPermission('candidatures')) {
      navigate('/')
      return
    }
    
    setIsAuthenticated(true)
  }, [navigate])

  // Simulation des données CV (à remplacer par une vraie API)
  useEffect(() => {
    const mockCVs = [
      {
        id: 1,
        nom: 'Martin Dubois',
        email: 'martin.dubois@email.com',
        telephone: '06 12 34 56 78',
        poste: 'Développeur Web',
        fichier: 'cv_martin_dubois.pdf',
        dateDepot: '2024-01-15',
        statut: 'nouveau',
        experience: '3 ans',
        localisation: 'Paris'
      },
      {
        id: 2,
        nom: 'Sarah Laurent',
        email: 'sarah.laurent@email.com',
        telephone: '07 98 76 54 32',
        poste: 'Designer UX/UI',
        fichier: 'cv_sarah_laurent.pdf',
        dateDepot: '2024-01-14',
        statut: 'en_cours',
        experience: '5 ans',
        localisation: 'Lyon'
      },
      {
        id: 3,
        nom: 'Thomas Bernard',
        email: 'thomas.bernard@email.com',
        telephone: '06 11 22 33 44',
        poste: 'Chef de projet',
        fichier: 'cv_thomas_bernard.docx',
        dateDepot: '2024-01-13',
        statut: 'traite',
        experience: '7 ans',
        localisation: 'Marseille'
      },
      {
        id: 4,
        nom: 'Emma Moreau',
        email: 'emma.moreau@email.com',
        telephone: '06 55 44 33 22',
        poste: 'Data Analyst',
        fichier: 'cv_emma_moreau.pdf',
        dateDepot: '2024-01-16',
        statut: 'nouveau',
        experience: '2 ans',
        localisation: 'Toulouse'
      },
      {
        id: 5,
        nom: 'Lucas Martin',
        email: 'lucas.martin@email.com',
        telephone: '07 11 22 33 44',
        poste: 'Formateur Digital',
        fichier: 'cv_lucas_martin.pdf',
        dateDepot: '2024-01-17',
        statut: 'en_cours',
        experience: '4 ans',
        localisation: 'Bordeaux'
      }
    ]

    setTimeout(() => {
      setCvList(mockCVs)
      setFilteredCVs(mockCVs)
      setIsLoading(false)
      notifications.success('Interface administrateur chargée avec succès')
    }, 1000)
  }, [notifications])

  // Filtrage et recherche
  useEffect(() => {
    let filtered = cvList

    if (searchTerm) {
      filtered = filtered.filter(cv =>
        cv.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.poste.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'tous') {
      filtered = filtered.filter(cv => cv.statut === filterStatus)
    }

    setFilteredCVs(filtered)
  }, [searchTerm, filterStatus, cvList])

  const handleStatusChange = (cvId, newStatus) => {
    setCvList(prev => prev.map(cv =>
      cv.id === cvId ? { ...cv, statut: newStatus } : cv
    ))
  }

  const getStatusBadge = (status) => {
    const styles = {
      nouveau: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
      en_cours: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
      traite: 'bg-gradient-to-r from-slate-500 to-gray-600 text-white'
    }

    const labels = {
      nouveau: 'Nouveau',
      en_cours: 'En cours',
      traite: 'Traité'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]} shadow-lg`}>
        {labels[status]}
      </span>
    )
  }

  const handleLogout = () => {
    notifications.success('Déconnexion réussie')
    setTimeout(() => {
      logout()
      navigate('/')
    }, 1000)
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
          <h2 className="text-xl font-semibold text-gray-700">Chargement des données...</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">👑</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                    Espace Administrateur
                  </h1>
                  <p className="text-indigo-200 text-lg">Gestion avancée des candidatures et ressources</p>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
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
            id="candidatures"
            label="Candidatures"
            icon="📋"
            active={activeTab === 'candidatures'}
            onClick={setActiveTab}
          />
          <TabButton
            id="statistiques"
            label="Statistiques"
            icon="📈"
            active={activeTab === 'statistiques'}
            onClick={setActiveTab}
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Nouveaux CV"
                value={cvList.filter(cv => cv.statut === 'nouveau').length}
                icon="🆕"
                color="text-emerald-400"
                bgColor="bg-gradient-to-br from-emerald-500/20 to-teal-600/20"
              />
              <StatCard
                title="En traitement"
                value={cvList.filter(cv => cv.statut === 'en_cours').length}
                icon="⚡"
                color="text-amber-400"
                bgColor="bg-gradient-to-br from-amber-500/20 to-orange-600/20"
              />
              <StatCard
                title="Traités"
                value={cvList.filter(cv => cv.statut === 'traite').length}
                icon="✅"
                color="text-slate-300"
                bgColor="bg-gradient-to-br from-slate-500/20 to-gray-600/20"
              />
              <StatCard
                title="Total CV"
                value={cvList.length}
                icon="📁"
                color="text-blue-400"
                bgColor="bg-gradient-to-br from-blue-500/20 to-indigo-600/20"
              />
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Gestion Utilisateurs</h3>
                    <p className="text-white/60 text-sm">Administrer les comptes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Formations</h3>
                    <p className="text-white/60 text-sm">Gérer le catalogue</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Rapports</h3>
                    <p className="text-white/60 text-sm">Analyser les données</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Candidatures Tab */}
        {activeTab === 'candidatures' && (
          <div className="space-y-6">
            {/* Filtres et recherche */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-white font-medium mb-2">Rechercher</label>
                  <input
                    type="text"
                    placeholder="Nom, email ou poste..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Statut</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="tous" className="bg-gray-800">Tous</option>
                    <option value="nouveau" className="bg-gray-800">Nouveau</option>
                    <option value="en_cours" className="bg-gray-800">En cours</option>
                    <option value="traite" className="bg-gray-800">Traité</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des CV */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">CV reçus ({filteredCVs.length})</h2>
              </div>
              
              {filteredCVs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white/60 text-2xl">📄</span>
                  </div>
                  <p className="text-white/60">Aucun CV trouvé selon les critères de recherche</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredCVs.map((cv) => (
                    <div key={cv.id} className="p-6 hover:bg-white/5 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-white font-semibold text-lg">{cv.nom}</h3>
                            {getStatusBadge(cv.statut)}
                          </div>
                          <p className="text-indigo-200">{cv.poste}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-white/60">
                            <span>✉️ {cv.email}</span>
                            <span>📞 {cv.telephone}</span>
                            <span>📍 {cv.localisation}</span>
                            <span>💼 {cv.experience}</span>
                            <span>📅 {new Date(cv.dateDepot).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedCV(cv)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                          >
                            Voir détails
                          </button>
                          <select
                            value={cv.statut}
                            onChange={(e) => handleStatusChange(cv.id, e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="nouveau" className="bg-gray-800">Nouveau</option>
                            <option value="en_cours" className="bg-gray-800">En cours</option>
                            <option value="traite" className="bg-gray-800">Traité</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistiques Tab */}
        {activeTab === 'statistiques' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Statistiques détaillées</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">
                    {Math.round((cvList.filter(cv => cv.statut === 'traite').length / cvList.length) * 100)}%
                  </div>
                  <p className="text-white/60">Taux de traitement</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {cvList.filter(cv => new Date(cv.dateDepot) > new Date(Date.now() - 7*24*60*60*1000)).length}
                  </div>
                  <p className="text-white/60">CV cette semaine</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {new Set(cvList.map(cv => cv.poste)).size}
                  </div>
                  <p className="text-white/60">Types de postes</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedCV && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Détails de la candidature</h3>
              <button
                onClick={() => setSelectedCV(null)}
                className="text-white/60 hover:text-white transition-colors duration-300"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Nom</label>
                  <p className="text-white font-medium">{selectedCV.nom}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Email</label>
                  <p className="text-white font-medium">{selectedCV.email}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Téléphone</label>
                  <p className="text-white font-medium">{selectedCV.telephone}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Poste souhaité</label>
                  <p className="text-white font-medium">{selectedCV.poste}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Expérience</label>
                  <p className="text-white font-medium">{selectedCV.experience}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Localisation</label>
                  <p className="text-white font-medium">{selectedCV.localisation}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Date de dépôt</label>
                  <p className="text-white font-medium">{new Date(selectedCV.dateDepot).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Statut</label>
                  <div>{getStatusBadge(selectedCV.statut)}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex flex-wrap gap-3">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                📥 Télécharger CV
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                📧 Contacter
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                📝 Planifier entretien
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Conteneur de notifications */}
      <NotificationContainer 
        notifications={notifications.notifications} 
        onRemove={notifications.removeNotification} 
      />
    </div>
  )
}