'use client'

import { useEffect, useState } from 'react'
import LogoNew from '@/components/LogoNew'
import { ChevronDown } from 'lucide-react'

const ROLES = [
  'Solutions Engineer',
  'DevOps Practitioner',
  'Electronics Engineer',
]

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = ROLES[roleIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2500)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else {
      setIsDeleting(false)
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, roleIndex])

  return (
    <section
      id="home"
      className="relative min-h-[95dvh] flex flex-col items-center justify-center gap-6 px-4 pt-4 pb-24"
    >
      <LogoNew />

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-mono font-bold tracking-tight">Ricardo Romero</h1>
        <p className="font-mono text-sm text-gray-400 h-5">
          <span className="text-white">{displayed}</span>
          <span className="animate-pulse text-gray-500">_</span>
        </p>
        <p className="font-mono text-xs text-gray-500">
          Currently helping businesses <span className="text-gray-400">do cloud right <a href="https://www.hashicorp.com/" target="_blank" rel="noopener noreferrer">@HashiCorp</a></span>
        </p>
      </div>

      <button
        onClick={() => document.querySelector('#resume')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 text-gray-600 hover:text-gray-400 transition-colors animate-bounce"
        aria-label="Scroll to resume"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  )
}
