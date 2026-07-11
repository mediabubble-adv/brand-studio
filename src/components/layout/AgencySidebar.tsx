'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Palette, BarChart3, Calendar, CheckSquare, FileText, Users, Settings } from 'lucide-react'

const navItems = [
  { href: '/agency/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agency/brands', label: 'Brands', icon: Palette },
  { href: '/agency/campaigns', label: 'Campaigns', icon: BarChart3 },
  { href: '/agency/calendar', label: 'Calendar', icon: Calendar },
  { href: '/agency/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/agency/reports', label: 'Reports', icon: FileText },
  { href: '/agency/team', label: 'Team', icon: Users },
  { href: '/agency/settings', label: 'Settings', icon: Settings },
]

export function AgencySidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-lg font-bold text-gray-900">Brand Studio</span>
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
