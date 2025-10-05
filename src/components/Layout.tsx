import React from 'react'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {children}
    </div>
  )
}

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const containerSizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl', 
  lg: 'max-w-7xl',
  xl: 'max-w-screen-xl',
  full: 'max-w-none'
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6 lg:px-8",
      containerSizes[size],
      className
    )}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const sectionPadding = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16', 
  xl: 'py-24'
}

export function Section({ children, className, padding = 'lg' }: SectionProps) {
  return (
    <section className={cn(sectionPadding[padding], className)}>
      {children}
    </section>
  )
}