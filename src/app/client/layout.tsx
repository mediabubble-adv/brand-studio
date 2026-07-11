import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/get-user'
import { createClient } from '@/lib/supabase/server'
import { ClientSidebar } from '@/components/layout/ClientSidebar'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const supabase = await createClient()
  const { data: memberships, error } = await supabase
    .from('brand_memberships')
    .select('brand_id')
    .eq('user_id', user.id)

  if (error || !memberships || memberships.length === 0) {
    redirect('/auth/login?error=unauthorized')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
