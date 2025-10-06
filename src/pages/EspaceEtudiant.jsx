import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { requireAuth, logout } from '../utils/auth'

export default function EspaceEtudiant() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [notes, setNotes] = useState([])
  const [matieres, setMatieres] = useState([])
  const [planning, setPlanning] = useState([])
  const [ressources, setRessources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Vérification de l'authentification
  useEffect(() => {
    const authCheck = requireAuth('etudiant')
    
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
    // Simulation de chargement des données étudiant
    const mockUserData = {
      nom: 'Julie Moreau',
      prenom: 'Julie',
      email: 'julie.moreau@cipfaro-formations.com',
      niveau: 'BTS SIO - Option SLAM',
      promotion: '2023-2025',
      numeroEtudiant: 'E202300145',
      dateInscription: '2023-09-01'
    }

    const mockMatieres = [
      {
        id: 1,
        nom: 'Développement d\'Applications',
        code: 'SLAM1',
        coefficient: 3,
        professeur: 'M. Dubois',
        moyenneClasse: 14.2,
        couleur: 'from-blue-500 to-indigo-600'
      },
      {
        id: 2,
        nom: 'Base de Données',
        code: 'BDD1',
        coefficient: 2,
        professeur: 'Mme Laurent',
        moyenneClasse: 13.8,
        couleur: 'from-emerald-500 to-teal-600'
      },
      {
        id: 3,
        nom: 'Réseaux et Sécurité',
        code: 'RES1',
        coefficient: 2,
        professeur: 'M. Bernard',
        moyenneClasse: 15.1,
        couleur: 'from-purple-500 to-violet-600'
      },
      {
        id: 4,
        nom: 'Gestion de Projet',
        code: 'GP1',
        coefficient: 1,
        professeur: 'Mme Petit',
        moyenneClasse: 16.3,
        couleur: 'from-orange-500 to-red-600'
      },
      {
        id: 5,
        nom: 'Anglais Technique',
        code: 'ANG1',
        coefficient: 1,
        professeur: 'M. Wilson',
        moyenneClasse: 14.7,
        couleur: 'from-pink-500 to-rose-600'
      }
    ]

    const mockNotes = [
      { id: 1, matiereId: 1, nom: 'DS - Programmation objet', note: 16, coefficient: 2, date: '2024-01-15', type: 'Devoir Surveillé' },
      { id: 2, matiereId: 1, nom: 'TP - Application web', note: 18, coefficient: 1, date: '2024-01-10', type: 'Travaux Pratiques' },
      { id: 3, matiereId: 2, nom: 'Projet - Base MySQL', note: 17, coefficient: 2, date: '2024-01-12', type: 'Projet' },
      { id: 4, matiereId: 2, nom: 'QCM - SQL avancé', note: 14, coefficient: 1, date: '2024-01-08', type: 'QCM' },
      { id: 5, matiereId: 3, nom: 'DS - Sécurité réseau', note: 15, coefficient: 2, date: '2024-01-18', type: 'Devoir Surveillé' },
      { id: 6, matiereId: 4, nom: 'Présentation - Méthode Agile', note: 19, coefficient: 1, date: '2024-01-14', type: 'Oral' },
      { id: 7, matiereId: 5, nom: 'Test - Vocabulaire technique', note: 13, coefficient: 1, date: '2024-01-16', type: 'Test' }
    ]

    const mockPlanning = [
      {
        id: 1,
        date: '2024-01-22',
        heure: '08:00-10:00',
        matiere: 'Développement d\'Applications',
        type: 'Cours',
        salle: 'Salle Info 1',
        professeur: 'M. Dubois'
      },
      {
        id: 2,
        date: '2024-01-22',
        heure: '10:15-12:15',
        matiere: 'Base de Données',
        type: 'TP',
        salle: 'Salle Info 2',
        professeur: 'Mme Laurent'
      },
      {
        id: 3,
        date: '2024-01-22',
        heure: '14:00-16:00',
        matiere: 'Anglais Technique',
        type: 'Cours',
        salle: 'Salle A3',
        professeur: 'M. Wilson'
      },
      {
        id: 4,
        date: '2024-01-23',
        heure: '09:00-12:00',
        matiere: 'Gestion de Projet',
        type: 'Projet',
        salle: 'Salle B1',
        professeur: 'Mme Petit'
      },
      {
        id: 5,
        date: '2024-01-24',
        heure: '08:00-10:00',
        matiere: 'Réseaux et Sécurité',
        type: 'DS',
        salle: 'Amphi 1',
        professeur: 'M. Bernard'
      }
    ]

    const mockRessources = [
      {
        id: 1,
        nom: 'Cours - Programmation Orientée Objet en PHP',
        type: 'PDF',
        matiere: 'Développement d\'Applications',
        taille: '2.3 MB',
        dateAjout: '2024-01-15',
        url: '#'
      },
      {
        id: 2,
        nom: 'TP - Création d\'une API REST',
        type: 'ZIP',
        matiere: 'Développement d\'Applications',
        taille: '1.8 MB',
        dateAjout: '2024-01-12',
        url: '#'
      },
      {
        id: 3,
        nom: 'Correction - Exercices SQL avancés',
        type: 'PDF',
        matiere: 'Base de Données',
        taille: '890 KB',
        dateAjout: '2024-01-10',
        url: '#'
      },
      {
        id: 4,
        nom: 'Slides - Méthodes Agiles',
        type: 'PPTX',
        matiere: 'Gestion de Projet',
        taille: '4.2 MB',
        dateAjout: '2024-01-08',
        url: '#'
      },
      {
        id: 5,
        nom: 'Vocabulaire - Termes techniques IT',
        type: 'PDF',
        matiere: 'Anglais Technique',
        taille: '650 KB',
        dateAjout: '2024-01-14',
        url: '#'
      }
    ]

    setTimeout(() => {
      setUserData(mockUserData)
      setMatieres(mockMatieres)
      setNotes(mockNotes)
      setPlanning(mockPlanning)
      setRessources(mockRessources)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const calculerMoyenneMatiere = (matiereId) => {
    const notesMatiere = notes.filter(n => n.matiereId === matiereId)
    if (notesMatiere.length === 0) return null
    
    const sommeNotes = notesMatiere.reduce((acc, note) => acc + (note.note * note.coefficient), 0)
    const sommeCoefficients = notesMatiere.reduce((acc, note) => acc + note.coefficient, 0)
    
    return (sommeNotes / sommeCoefficients).toFixed(1)
  }

  const calculerMoyenneGenerale = () => {
    let sommeNotes = 0
    let sommeCoefficients = 0
    
    matieres.forEach(matiere => {
      const notesMatiere = notes.filter(n => n.matiereId === matiere.id)
      const coefficientMatiere = matiere.coefficient
      
      if (notesMatiere.length > 0) {
        const sommeNotesMatiere = notesMatiere.reduce((acc, note) => acc + (note.note * note.coefficient), 0)
        const sommeCoefficientsMatiere = notesMatiere.reduce((acc, note) => acc + note.coefficient, 0)
        const moyenneMatiere = sommeNotesMatiere / sommeCoefficientsMatiere
        
        sommeNotes += moyenneMatiere * coefficientMatiere
        sommeCoefficients += coefficientMatiere
      }
    })
    
    return sommeCoefficients > 0 ? (sommeNotes / sommeCoefficients).toFixed(1) : 0
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Devoir Surveillé': '📝',
      'Travaux Pratiques': '💻',
      'Projet': '🚀',
      'QCM': '✅',
      'Oral': '🎤',
      'Test': '📊'
    }
    return icons[type] || '📋'
  }

  const getTypeColor = (type) => {
    const colors = {
      'Devoir Surveillé': 'from-red-500 to-pink-600',
      'Travaux Pratiques': 'from-blue-500 to-indigo-600',
      'Projet': 'from-purple-500 to-violet-600',
      'QCM': 'from-emerald-500 to-teal-600',
      'Oral': 'from-orange-500 to-red-600',
      'Test': 'from-cyan-500 to-blue-600'
    }
    return colors[type] || 'from-gray-500 to-slate-600'
  }

  const getCoursIcon = (type) => {
    const icons = {
      'Cours': '📚',
      'TP': '💻',
      'DS': '📝',
      'Projet': '🚀',
      'TD': '✏️'
    }
    return icons[type] || '🎓'
  }

  const getFileIcon = (type) => {
    const icons = {
      'PDF': '📄',
      'ZIP': '📦',
      'PPTX': '📊',
      'DOCX': '📝',
      'XLSX': '📈'
    }
    return icons[type] || '📁'
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
          <h2 className="text-xl font-semibold text-gray-700">Chargement de votre espace...</h2>
        </div>
      </div>
    )
  }

  const StatCard = ({ title, value, icon, color, bgColor, subtitle = null }) => (
    <div className={`${bgColor} backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
          {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
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

  const moyenneGenerale = calculerMoyenneGenerale()
  const totalNotes = notes.length
  const prochainCours = planning.find(p => new Date(p.date) >= new Date())

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🎓</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                    Espace Étudiant
                  </h1>
                  <p className="text-indigo-200 text-lg">Bonjour {userData.prenom} !</p>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="text-right text-white/80">
                <p className="text-sm">{userData.niveau}</p>
                <p className="text-xs">N° étudiant : {userData.numeroEtudiant}</p>
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
            id="notes"
            label="Notes"
            icon="📝"
            active={activeTab === 'notes'}
            onClick={setActiveTab}
          />
          <TabButton
            id="planning"
            label="Planning"
            icon="📅"
            active={activeTab === 'planning'}
            onClick={setActiveTab}
          />
          <TabButton
            id="ressources"
            label="Ressources"
            icon="📚"
            active={activeTab === 'ressources'}
            onClick={setActiveTab}
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Moyenne générale"
                value={moyenneGenerale}
                icon="📊"
                color="text-emerald-400"
                bgColor="bg-gradient-to-br from-emerald-500/20 to-teal-600/20"
                subtitle="/20"
              />
              <StatCard
                title="Notes saisies"
                value={totalNotes}
                icon="📝"
                color="text-cyan-400"
                bgColor="bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
                subtitle="évaluations"
              />
              <StatCard
                title="Matières"
                value={matieres.length}
                icon="📚"
                color="text-purple-400"
                bgColor="bg-gradient-to-br from-purple-500/20 to-violet-600/20"
                subtitle="ce semestre"
              />
              <StatCard
                title="Promotion"
                value={userData.promotion}
                icon="🎯"
                color="text-orange-400"
                bgColor="bg-gradient-to-br from-orange-500/20 to-red-600/20"
              />
            </div>

            {/* Prochain cours */}
            {prochainCours && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Prochain cours</h2>
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur border border-indigo-300/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium flex items-center space-x-2">
                      <span>{getCoursIcon(prochainCours.type)}</span>
                      <span>{prochainCours.matiere}</span>
                    </h3>
                    <span className="text-indigo-300 text-sm">{prochainCours.type}</span>
                  </div>
                  <div className="text-white/80 text-sm mb-1">
                    📅 {new Date(prochainCours.date).toLocaleDateString('fr-FR')} • {prochainCours.heure}
                  </div>
                  <div className="text-indigo-200 text-sm">
                    📍 {prochainCours.salle} • 👨‍🏫 {prochainCours.professeur}
                  </div>
                </div>
              </div>
            )}

            {/* Aperçu des moyennes par matière */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Moyennes par matière</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matieres.map((matiere) => {
                  const moyenne = calculerMoyenneMatiere(matiere.id)
                  return (
                    <div key={matiere.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">{matiere.nom}</h3>
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${matiere.couleur}`}></div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">Ma moyenne</span>
                        <span className="text-white font-bold text-lg">
                          {moyenne ? `${moyenne}/20` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Moyenne classe</span>
                        <span className="text-white/80">{matiere.moyenneClasse}/20</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Résumé des moyennes */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Bulletin de notes</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {matieres.map((matiere) => {
                      const moyenne = calculerMoyenneMatiere(matiere.id)
                      const notesMatiere = notes.filter(n => n.matiereId === matiere.id)
                      
                      return (
                        <div key={matiere.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-white font-medium">{matiere.nom}</h3>
                              <p className="text-white/60 text-sm">{matiere.code} • Coeff. {matiere.coefficient}</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${moyenne ? (moyenne >= 10 ? 'text-emerald-400' : 'text-red-400') : 'text-gray-400'}`}>
                                {moyenne ? `${moyenne}/20` : 'N/A'}
                              </div>
                              <div className="text-white/60 text-sm">
                                {notesMatiere.length} note{notesMatiere.length > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                            {notesMatiere.slice(-3).map((note) => (
                              <div key={note.id} className={`bg-gradient-to-r ${getTypeColor(note.type)}/20 backdrop-blur border border-white/10 rounded-lg p-2`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-white/80 text-xs">{note.nom.substring(0, 20)}...</span>
                                  <span className="text-white font-bold">{note.note}/20</span>
                                </div>
                                <div className="text-white/60 text-xs mt-1">
                                  {getTypeIcon(note.type)} {note.type}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur border border-indigo-300/20 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Moyenne générale</h3>
                  <div className="text-center mb-6">
                    <div className={`text-5xl font-bold ${moyenneGenerale >= 10 ? 'text-emerald-400' : 'text-red-400'} mb-2`}>
                      {moyenneGenerale}
                    </div>
                    <div className="text-white/80 text-lg">/20</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Total évaluations</span>
                      <span className="text-white font-medium">{totalNotes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Matières suivies</span>
                      <span className="text-white font-medium">{matieres.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Mention</span>
                      <span className="text-white font-medium">
                        {moyenneGenerale >= 16 ? 'Très Bien' : 
                         moyenneGenerale >= 14 ? 'Bien' :
                         moyenneGenerale >= 12 ? 'Assez Bien' :
                         moyenneGenerale >= 10 ? 'Passable' : 'Insuffisant'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Planning Tab */}
        {activeTab === 'planning' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Planning des cours</h2>
              
              <div className="space-y-4">
                {planning.map((cours) => (
                  <div key={cours.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getCoursIcon(cours.type)}</span>
                          <div>
                            <h3 className="text-white font-medium">{cours.matiere}</h3>
                            <p className="text-white/60 text-sm">{cours.type} • {cours.professeur}</p>
                          </div>
                        </div>
                        <div className="text-white/80 text-sm">
                          📍 {cours.salle}
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:text-right">
                        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur border border-indigo-300/20 rounded-lg p-3">
                          <div className="text-white font-medium">
                            {new Date(cours.date).toLocaleDateString('fr-FR', { 
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </div>
                          <div className="text-indigo-300 text-sm mt-1">{cours.heure}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ressources Tab */}
        {activeTab === 'ressources' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Ressources pédagogiques</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ressources.map((ressource) => (
                  <div key={ressource.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl">{getFileIcon(ressource.type)}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium mb-1 truncate">{ressource.nom}</h3>
                        <p className="text-white/60 text-sm mb-2">{ressource.matiere}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-white/60 text-xs">
                            {ressource.taille} • {new Date(ressource.dateAjout).toLocaleDateString('fr-FR')}
                          </div>
                          <span className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-indigo-300 px-2 py-1 rounded-full text-xs">
                            {ressource.type}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => window.open(ressource.url, '_blank')}
                          className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm w-full"
                        >
                          📥 Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {ressources.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white/60 text-2xl">📚</span>
                  </div>
                  <p className="text-white/60">Aucune ressource disponible pour le moment</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}