'use client'

import React, { useEffect, useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'

const LinkedIn = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GitHub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);


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
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/50 backdrop-blur-sm border-b border-gray-800" style={{ transform: 'translateZ(0)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

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
              <GitHub className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/ricardorompar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedIn className="w-4 h-4" />
            </a>
            {visitors !== null && (
              <span className="font-mono text-xs text-gray-600 border border-gray-800 px-2 py-1">
                {visitors.toLocaleString()} visitors
              </span>
            )}
          </div>

          {/* Mobile: hamburger button */}
          <button className="md:hidden flex flex-col justify-center items-center">
            <Hamburger color="oklch(70.7% 0.022 261.325)" onToggle={toggled => {
                if (toggled) {
                    // open a menu
                    setMenuOpen(true)
                } else {
                    // close a menu
                    setMenuOpen(false)
                }
            }} />
          </button>
          
          {/* <button
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
          </button> */}
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a]/60 backdrop-blur-sm flex flex-col transition-opacity duration-300 md:hidden ${
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
              <GitHub className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/ricardorompar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedIn className="w-5 h-5" />
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
