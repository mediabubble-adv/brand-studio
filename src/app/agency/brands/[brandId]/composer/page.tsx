import { CanvasComposer } from '@/components/canvas/CanvasComposer'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface AssetRow {
  name: string
  url: string
}

export default async function ComposerPage({ params }: { params: { brandId: string } }) {
  const { data: assets } = await supabaseAdmin
    .from('brand_assets')
    .select('name, url')
    .eq('brand_id', params.brandId)
    .eq('type', 'logo')

  const sampleImage = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop'
  const logos = (assets || []) as unknown as AssetRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Canvas Composer</h1>
        <p className="text-sm text-gray-500">Design your social feed card visual</p>
      </div>
      <CanvasComposer
        imageUrl={sampleImage}
        logos={logos}
        onSave={(json) => console.log('Saved Canvas:', json)}
      />
    </div>
  )
}
