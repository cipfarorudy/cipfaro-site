import { Link } from 'react-router-dom'
import { useSEO, seoConfig } from '../utils/seo'
import { trackMoodleAccess } from '../utils/analytics'

export default function Home() {
  // SEO optimisé pour la page d'accueil
  useSEO(seoConfig.home)
  return (
    <div>
      {/* Hero Section - Modern Design */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
          <svg className="absolute bottom-0 left-0 right-0 text-white" viewBox="0 0 1440 120" fill="currentColor">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
        
        <div className="relative container mx-auto px-4 max-w-7xl py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  CIP FARO
                </h1>
                <p className="text-xl text-gray-600 font-medium">Centre de Formation Excellence</p>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                Centre de formation spécialisé dans l'<span className="font-semibold text-blue-600">insertion professionnelle</span> et 
                l'accompagnement des publics. Formations certifiantes, accompagnement individualisé et conseils pour le financement.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/inscription" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🎯 S'inscrire maintenant
                </Link>
                <Link 
                  to="/devis" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 font-semibold"
                >
                  💼 Demander un devis
                </Link>
                <a 
                  href="https://cipfaro.org" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => trackMoodleAccess()}
                >
                  🎓 Accéder à vos cours
                </a>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <a 
                  href="/assets/certificat-B04066-2025-03-30.pdf" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download="certificat-B04066-2025-03-30.pdf"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>📜 Télécharger le certificat</span>
                </a>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                <img 
                  src="/assets/Qualiopi Actions de formation.JPG" 
                  alt="Certificat Qualiopi Actions de formation" 
                  className="w-full h-auto rounded-xl shadow-lg"
                  loading="lazy" 
                  width="320" 
                  height="160" 
                />
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Certifié Qualiopi</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full blur-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Services Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos solutions complètes pour votre développement professionnel et votre réussite
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Formation Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Formations Certifiantes</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Découvrez nos formations reconnues par l'État et inscrites au RNCP, 
                  conçues pour répondre aux besoins du marché de l'emploi.
                </p>
                <Link 
                  to="/formations" 
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold group-hover:translate-x-1 transition-transform duration-200"
                >
                  <span>Voir nos formations</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Accompagnement Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Accompagnement Personnalisé</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Bénéficiez d'un accompagnement personnalisé tout au long de votre parcours 
                  de formation et d'insertion professionnelle.
                </p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800 font-semibold group-hover:translate-x-1 transition-transform duration-200"
                >
                  <span>Nous contacter</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Financement Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 transform hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Solutions de Financement</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Explorez les différentes solutions de financement disponibles 
                  pour votre projet de formation professionnelle.
                </p>
                <Link 
                  to="/financements" 
                  className="inline-flex items-center space-x-2 text-yellow-600 hover:text-yellow-800 font-semibold group-hover:translate-x-1 transition-transform duration-200"
                >
                  <span>Solutions de financement</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Commitments Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Engagements Qualité
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des garanties solides pour votre réussite et votre satisfaction
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Qualiopi */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 group">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Certification Qualiopi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Notre centre est certifié Qualiopi, gage de qualité 
                  de nos actions de formation et respect des standards nationaux.
                </p>
                <div className="mt-4 inline-flex items-center space-x-2 text-green-600 font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Certifié</span>
                </div>
              </div>
            </div>

            {/* Accessibilité */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibilité Universelle</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nos locaux sont accessibles aux personnes en situation de handicap 
                  et nous adaptons nos formations selon vos besoins spécifiques.
                </p>
                <div className="mt-4 inline-flex items-center space-x-2 text-blue-600 font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% Accessible</span>
                </div>
              </div>
            </div>

            {/* Suivi personnalisé */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Suivi Personnalisé</h3>
                <p className="text-gray-600 leading-relaxed">
                  Chaque apprenant bénéficie d'un accompagnement individualisé 
                  pour maximiser ses chances de réussite et d'insertion.
                </p>
                <div className="mt-4 inline-flex items-center space-x-2 text-purple-600 font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>Accompagnement 1:1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Témoignages de nos Apprenants
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les expériences de ceux qui ont transformé leur carrière avec nous
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Témoignage 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="relative">
                <div className="absolute -top-4 -left-4 text-indigo-200 opacity-50">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                <blockquote className="relative z-10">
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "Grâce à la formation CIP FARO, j'ai pu me reconvertir dans le numérique. 
                    L'équipe pédagogique est à l'écoute et les contenus sont très pratiques."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      S
                    </div>
                    <div>
                      <cite className="text-gray-900 font-semibold block">Sarah</cite>
                      <span className="text-indigo-600 text-sm font-medium">Développeuse Web</span>
                    </div>
                  </div>
                </blockquote>
                <div className="absolute bottom-0 right-0 text-indigo-100">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Témoignage 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="relative">
                <div className="absolute -top-4 -left-4 text-green-200 opacity-50">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                <blockquote className="relative z-10">
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "La formation m'a permis de créer ma propre entreprise. 
                    Les modules sur l'entrepreneuriat sont excellents !"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      M
                    </div>
                    <div>
                      <cite className="text-gray-900 font-semibold block">Mohamed</cite>
                      <span className="text-green-600 text-sm font-medium">Chef d'entreprise</span>
                    </div>
                  </div>
                </blockquote>
                <div className="absolute bottom-0 right-0 text-green-100">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Témoignage 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="relative">
                <div className="absolute -top-4 -left-4 text-rose-200 opacity-50">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                <blockquote className="relative z-10">
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "Un accompagnement de qualité du début à la fin. 
                    Je recommande vivement le CIP FARO."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      J
                    </div>
                    <div>
                      <cite className="text-gray-900 font-semibold block">Julie</cite>
                      <span className="text-rose-600 text-sm font-medium">Assistante de direction</span>
                    </div>
                  </div>
                </blockquote>
                <div className="absolute bottom-0 right-0 text-rose-100">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Rejoignez Notre Équipe !
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Vous êtes passionné par la formation et souhaitez transmettre vos compétences ? 
              Ou vous recherchez un emploi dans nos domaines d'expertise ? 
              Découvrez nos opportunités et déposez votre candidature.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <Link 
                to="/recrutement" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                <span>Déposer mon CV</span>
              </Link>
              
              <Link 
                to="/connexion" 
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-200 font-semibold flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Espace candidat</span>
              </Link>
            </div>
            
            <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Formateurs experts</h3>
                <p className="text-sm text-gray-600">Partagez votre expertise avec nos apprenants</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Opportunités carrière</h3>
                <p className="text-sm text-gray-600">Évoluez dans un environnement stimulant</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mission d'impact</h3>
                <p className="text-sm text-gray-600">Contribuez à l'insertion professionnelle</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}