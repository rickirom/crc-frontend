'use client'

import React, { useEffect, useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'


const VISITOR_COUNTER_URL = 'https://vlt33ldw66.execute-api.eu-central-1.amazonaws.com/increment' // Replace with actual Lambda/API Gateway URL

const NAV_ITEMS = [
  { label: 'Resume', href: '#resume' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

interface VisitorCountResponse {
  views: number;
}

export default function Navbar() {
  const [visitors, setVisitors] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch(VISITOR_COUNTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed: ${r.status}`)
        return r.json() as Promise<VisitorCountResponse>
      })
      .then((data) => setVisitors(data.views))
      .catch(() => {})

    return () => controller.abort()
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
    <div>
      <header className="sticky top-2 z-50 bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-800 w-fit mx-auto" 
              style={{ transform: 'translateZ(0)' }}>
        <div className="px-6 h-10 flex items-center justify-center">

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
            {visitors !== null && (
              <span className="font-mono text-gray-600 border border-gray-800 px-2 py-1">
                {visitors.toLocaleString()} visits
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

          {visitors !== null && (
            <span className="font-mono text-sm text-gray-600 border border-gray-800 px-3 py-1.5">
              {visitors.toLocaleString()} visits
            </span>
          )}
        </nav>
      </div>
    </div>
  )
}
