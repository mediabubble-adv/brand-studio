import { GoogleGenerativeAI } from '@google/generative-ai'

export interface ExtractedBrand {
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  bg_color: string | null
  font_header: string | null
  font_body: string | null
  font_accent: string | null
  languages: string[]
  dialects: string[]
  tone_keywords: string[]
  grid_strategy: 'row-theme' | 'alternating' | 'checkerboard' | 'color-block' | null
}

const EXTRACTION_PROMPT = `
You are a brand analyst. Extract structured brand information from the provided brand guidelines text.
Return ONLY a valid JSON object with these exact fields:
{
  "primary_color": "#hexcode or null",
  "secondary_color": "#hexcode or null",
  "accent_color": "#hexcode or null",
  "bg_color": "#hexcode or null",
  "font_header": "font name or null",
  "font_body": "font name or null",
  "font_accent": "font name or null",
  "languages": ["ar-EG", "en", "ar-AE", etc — only languages explicitly mentioned],
  "dialects": ["masri", "khaliji", "levantine", "msa" — infer from languages/region],
  "tone_keywords": ["up to 5 tone/voice descriptors from the text"],
  "grid_strategy": one of: "row-theme", "alternating", "checkerboard", "color-block" — infer from visual description or null
}
Return only the JSON. No markdown. No explanation.
`

export async function extractBrandFromPdf(pdfText: string): Promise<ExtractedBrand> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'dummy_key')
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent([
    EXTRACTION_PROMPT,
    `\n\nBrand guidelines text:\n${pdfText.slice(0, 8000)}`,
  ])

  const raw = result.response.text().trim()
  const clean = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    return JSON.parse(clean) as ExtractedBrand
  } catch {
    throw new Error(`Failed to parse AI response: ${clean.slice(0, 200)}`)
  }
}
