import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon?: React.ReactNode
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { name: 'Accueil', href: '/' },
  { 
    name: 'Formations', 
    href: '/formations',
    children: [
      { name: 'Toutes les formations', href: '/formations' },
      { name: 'Insertion professionnelle', href: '/formations?categorie=insertion' },
      { name: 'Numérique', href: '/formations?categorie=numerique' },
      { name: 'Entrepreneuriat', href: '/formations?categorie=entrepreneuriat' },
    ]
  },
  { 
    name: 'Services', 
    href: '#',
    children: [
      { name: 'Préinscription', href: '/preinscription' },
      { name: 'Devis personnalisé', href: '/devis' },
      { name: 'Financements', href: '/financements' },
      { name: 'Recrutement', href: '/recrutement' },
    ]
  },
  { 
    name: 'À propos', 
    href: '#',
    children: [
      { name: 'Indicateurs', href: '/indicateurs' },
      { name: 'Accessibilité', href: '/accessibilite' },
      { name: 'Contact', href: '/contact' },
    ]
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()

  const isActive = (href: string) => {
    return location.pathname === href
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/assets/logo-cipfaro.png"
                alt="CIP FARO"
              />
              <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
                CIP FARO
              </span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1",
                        "hover:text-primary-600",
                        isActive(item.href) 
                          ? "text-primary-600 border-b-2 border-primary-600" 
                          : "text-gray-700"
                      )}
                    >
                      <span>{item.name}</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {openDropdown === item.name && (
                      <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors",
                      "hover:text-primary-600",
                      isActive(item.href) 
                        ? "text-primary-600 border-b-2 border-primary-600" 
                        : "text-gray-700"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/connexion">
              <Button variant="ghost" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link to="/preinscription">
              <Button size="sm">
                S'inscrire
              </Button>
            </Link>
          </div>

          {/* Menu mobile button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium transition-colors",
                      isActive(item.href) 
                        ? "text-primary-600 bg-primary-50" 
                        : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link to="/connexion" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Se connecter
                </Button>
              </Link>
              <Link to="/preinscription" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}