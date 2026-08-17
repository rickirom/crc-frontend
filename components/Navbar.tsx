'use client'

import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'


const VISITOR_COUNTER_URL = 'https://vlt33ldw66.execute-api.eu-central-1.amazonaws.com/increment' // Replace with actual Lambda/API Gateway URL

const NAV_ITEMS = [
  { id: 'home', label: 'home', href: '#' },
  { id: 'work', label: 'work', href: '#' },
  { id: 'projects', label: 'projects', href: '#' },
  { id: 'contact', label: 'contact', href: '#' },
]

interface VisitorCountResponse {
  views: number | null;
}

interface VisitsBadgeProps extends VisitorCountResponse {
  isExpanded: boolean
}

type NavId = typeof NAV_ITEMS[number]['id']

// Visits badge:
function VisitsBadge({views, isExpanded}: VisitsBadgeProps){
  return (
    <div className="ml-5 items-center gap-4">
      <span className="font-mono text-foreground bg-secondary  rounded-md px-2 py-1 flex flex-row">
        {views === null ? (<LoaderCircle className="animate-spin"/>) : (views.toLocaleString())}
          <span className={`${isExpanded ? "block":"hidden"} group-hover:block`}>&nbsp;visits</span>
      </span>
    </div>
  )
}

function NavList({ items, onSelect, className, selected }: {
  items: typeof NAV_ITEMS
  onSelect: (id: string) => void
  className?: string
  selected: NavId
}) {
  items = items.filter(i => i.id !== selected)

  return (
    <nav className={className}>
      {items.map(({ id, label, href }) => (
        <a key={id} 
           href={href} 
           onClick={() => onSelect(id)} 
           aria-current={id === selected ? 'page' : undefined}
           className="px-3 py-1.5 text-gray-400 alink"
        >
          {label}
        </a>
      ))}
    </nav>
  )
}


export default function Navbar() {
  const [visitors, setVisitors] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedId, setSelectedId] = useState<NavId>('home')  //which item is showing in the "collapsed" state

  function selectAndCollapse(item: string){
    setSelectedId(item);
    setIsExpanded(false);
  }

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

  return (
    <>
      <header className="group sticky top-7 z-50 bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-800 rounded-md w-fit mx-auto py-2" 
        style={{ transform: 'translateZ(0)' }}>

        <div className="flex px-6 h-10 items-center justify-center">
          {/* Collapsed trigger. Always visible*/}
          <nav className="items-center gap-1 font-mono text-sm">
            {NAV_ITEMS.filter(i => i.id === selectedId).map(({ id, label }) => (
              <div key={id} className="flex flex-row px-3 py-1.5">
                {label} |
              </div>
            ))}
          </nav>

          {/* DOTS */}
          <button className='text-accent group-hover:hidden'
            onClick={() => setIsExpanded(prev => !prev)}
            aria-expanded={isExpanded}
            aria-label="Toggle navigation menu">
              [...]
          </button>

          {/* Invisible links. AKA ExpandedPanel (ON DESKTOP)*/}
          <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
            <div className="overflow-hidden">
              <NavList items={NAV_ITEMS} onSelect={selectAndCollapse} selected={selectedId}
                className="flex items-center gap-1 font-mono text-sm opacity-0 group-hover:opacity-100 group-hover:delay-100 transition-opacity duration-200"/>
            </div>
          </div>

          {/* Right: visitor counter (desktop) */}
          <VisitsBadge views={ visitors } isExpanded={isExpanded}/>
        </div>

        {/* Invisible links. AKA ExpandedPanel (ON MOBILE)*/}
        <div className={`grid ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-[grid-template-rows] duration-300 ease-out`}>
          <div className="overflow-hidden">
            <NavList items={NAV_ITEMS} onSelect={selectAndCollapse} selected={selectedId}
              className={`flex justify-center mt-5 items-center gap-1 font-mono text-sm ${isExpanded ? "opacity-100 delay-100" : "opacity-0"} transition-opacity duration-200`}/>
          </div>
        </div>
      </header>
    </>
  )
}
