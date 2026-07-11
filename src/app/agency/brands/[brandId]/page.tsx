import { BrandProfileEditor } from '@/components/brands/BrandProfileEditor'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface BrandRow {
  name: string
}

interface ProfileRow {
  brand_id: string
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  bg_color: string | null
  font_header: string | null
  font_body: string | null
  languages: string[]
  dialects: string[]
  tone_keywords: string[]
  grid_strategy: string | null
  instagram_handle: string | null
  brands: BrandRow | null
}

export default async function BrandPage({ params }: { params: { brandId: string } }) {
  const { data, error } = await supabaseAdmin
    .from('brand_profiles')
    .select('*, brands(name)')
    .eq('brand_id', params.brandId)
    .single()

  if (error || !data) notFound()

  const profile = data as unknown as ProfileRow

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {profile.brands?.name || 'Brand'} — Brand Profile
      </h1>
      <BrandProfileEditor brandId={params.brandId} initialProfile={profile as any} />
    </div>
  )
}
