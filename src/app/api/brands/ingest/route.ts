import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import pdfParse from 'pdf-parse'
import { extractBrandFromPdf } from '@/lib/ai/extract-brand'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const brandName = formData.get('brand_name') as string
    const industry = formData.get('industry') as string | null
    const pdfFile = formData.get('pdf') as File | null
    const instagramHandle = formData.get('instagram_handle') as string | null

    if (!brandName) {
      return NextResponse.json({ data: null, error: 'brand_name is required' }, { status: 400 })
    }

    // Create slug
    const slug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Insert brand
    const { data: brand, error: brandError } = await supabaseAdmin
      .from('brands')
      .insert({ name: brandName, slug, industry })
      .select()
      .single()

    if (brandError) {
      return NextResponse.json({ data: null, error: brandError.message }, { status: 500 })
    }

    let extractedProfile = null

    if (pdfFile) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())
      const { text } = await pdfParse(pdfBuffer)
      extractedProfile = await extractBrandFromPdf(text)
    }

    // Insert brand profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('brand_profiles')
      .insert({
        brand_id: brand.id,
        instagram_handle: instagramHandle,
        primary_color: extractedProfile?.primary_color ?? null,
        secondary_color: extractedProfile?.secondary_color ?? null,
        accent_color: extractedProfile?.accent_color ?? null,
        bg_color: extractedProfile?.bg_color ?? null,
        font_header: extractedProfile?.font_header ?? null,
        font_body: extractedProfile?.font_body ?? null,
        font_accent: extractedProfile?.font_accent ?? null,
        languages: extractedProfile?.languages ?? [],
        dialects: extractedProfile?.dialects ?? [],
        tone_keywords: extractedProfile?.tone_keywords ?? [],
        grid_strategy: extractedProfile?.grid_strategy ?? null,
      })
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ data: null, error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ data: { brandId: brand.id, profile }, error: null })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
