'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, CheckSquare, FileText, Palette, Users } from 'lucide-react'

const navItems = [
  { href: '/client/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/client/calendar', label: 'Calendar', icon: Calendar },
  { href: '/client/approvals', label: 'Pending Approvals', icon: CheckSquare },
  { href: '/client/reports', label: 'Reports', icon: FileText },
  { href: '/client/assets', label: 'Brand Assets', icon: Palette },
  { href: '/client/team', label: 'My Team', icon: Users },
]

export function ClientSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-lg font-bold text-gray-900">Client Portal</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
