'use client'

import React, { useEffect, useState } from 'react'
import { Github, Linkedin } from 'lucide-react'

const VISITOR_COUNTER_URL = '#' // Replace with actual Lambda/API Gateway URL

const NAV_ITEMS = [
  { label: 'Resume', href: '#resume' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [visitors, setVisitors] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch(VISITOR_COUNTER_URL)
      .then((r) => r.json())
      .then((data) => setVisitors(data.count))
      .catch(() => {})
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Left: nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-sm">
            {NAV_ITEMS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => scrollTo(e, href)}
                className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right: icons + visitor counter (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/ricardorompar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/ricardorompar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            {visitors !== null && (
              <span className="font-mono text-xs text-gray-600 border border-gray-800 px-2 py-1">
                {visitors.toLocaleString()} visitors
              </span>
            )}
          </div>

          {/* Mobile: hamburger button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 relative"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className={`block h-px w-6 bg-gray-400 transition-all duration-300 origin-center ${
                menuOpen ? 'rotate-45 translate-y-[8px]' : ''
              }`}
            />
            <span
              className={`block h-px w-6 bg-gray-400 transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-px w-6 bg-gray-400 transition-all duration-300 origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[8px]' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-14" /> {/* spacer for the sticky header */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-8 font-mono">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => scrollTo(e, href)}
              className="text-2xl text-gray-400 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}

          <div className="flex items-center gap-6 mt-8">
            <a
              href="https://github.com/ricardorompar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/ricardorompar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {visitors !== null && (
            <span className="font-mono text-xs text-gray-600 border border-gray-800 px-3 py-1.5">
              {visitors.toLocaleString()} visitors
            </span>
          )}
        </nav>
      </div>
    </>
  )
}
