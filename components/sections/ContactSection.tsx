'use client'

import { useState } from 'react'
import { Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react'

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ricardorompar',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ricardorompar',
    icon: Github,
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com/ricardorompar',
    icon: Twitter,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/ricardorompar',
    icon: Instagram,
  },
]

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // TODO: wire up to your backend (Lambda / Formspree / etc.)
    await new Promise((r) => setTimeout(r, 800))
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-24 px-6 border-t border-gray-800">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-2">
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest">// contact</h2>
          <p className="font-mono text-sm text-gray-400">
            Have a question or want to work together? Get in touch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="font-mono text-xs text-gray-500">
                name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="font-mono text-xs text-gray-500">
                email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="font-mono text-xs text-gray-500">
                message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>

            {status === 'sent' ? (
              <p className="font-mono text-xs text-gray-400">
                &gt; Message received. I&apos;ll get back to you soon.
              </p>
            ) : (
              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex items-center gap-2 font-mono text-sm px-4 py-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {status === 'sending' ? 'sending...' : 'send message'}
              </button>
            )}
          </form>

          {/* Social links */}
          <div className="space-y-4">
            <p className="font-mono text-xs text-gray-500">or find me here</p>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-mono text-sm text-gray-400 hover:text-white transition-colors group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
