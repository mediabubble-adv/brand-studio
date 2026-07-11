import { createClient } from '@/lib/supabase/server'

export async function getUserBrandRole(brandId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('user_brand_role', { p_brand_id: brandId })
  if (error) return null
  return data as string | null
}

export async function isMbTeam(): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('is_mb_team')
  if (error) return false
  return data === true
}
