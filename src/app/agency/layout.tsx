import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/get-user'
import { isMbTeam } from '@/lib/auth/get-user-role'
import { AgencySidebar } from '@/components/layout/AgencySidebar'

export default async function AgencyLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const mbTeam = await isMbTeam()
  if (!mbTeam) redirect('/client/overview')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AgencySidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
