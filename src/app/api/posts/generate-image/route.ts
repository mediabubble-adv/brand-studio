import { NextRequest, NextResponse } from 'next/server'
import { generateRawImage } from '@/lib/ai/generate-image'

export async function POST(req: NextRequest) {
  try {
    const { prompt, engine } = await req.json()

    if (!prompt) {
      return NextResponse.json({ data: null, error: 'Prompt is required' }, { status: 400 })
    }

    const base64Image = await generateRawImage(prompt, engine)
    return NextResponse.json({ data: { imageUrl: base64Image }, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
