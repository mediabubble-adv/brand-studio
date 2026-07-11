import { GoogleGenerativeAI } from '@google/generative-ai'
import { generateDialectCopy } from '../arabic-skill/client'

export async function generatePostContent(
  prompt: string,
  brandProfile: { languages: string[]; dialects: string[]; tone_keywords: string[] },
  brandMemory?: { successful_keywords: string[]; avoid_keywords: string[] }
) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'dummy_key')
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  let memoryContext = ''
  if (brandMemory) {
    if (brandMemory.successful_keywords?.length > 0) {
      memoryContext += `\nPrefer including these successful terms: ${brandMemory.successful_keywords.join(', ')}`
    }
    if (brandMemory.avoid_keywords?.length > 0) {
      memoryContext += `\nDo NOT use these terms: ${brandMemory.avoid_keywords.join(', ')}`
    }
  }

  const systemContext = `
    You are an expert social media strategist. Generate social media copy for a brand with the following attributes:
    Languages: ${brandProfile.languages.join(', ')}
    Tone: ${brandProfile.tone_keywords.join(', ')}${memoryContext}
    
    Format your response as a valid JSON object matching:
    {
      "caption_en": "English caption string or null",
      "caption_ar": "Standard Arabic caption string or null",
      "hooks_en": ["array of 3 english hook variations"],
      "hooks_ar": ["array of 3 standard arabic hook variations"],
      "image_prompt": "highly detailed descriptive prompt for text-to-image generator"
    }
    Return ONLY JSON. No explanation.
  `

  const result = await model.generateContent([systemContext, prompt])
  const text = result.response.text().trim()
  const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '')
  const data = JSON.parse(clean)

  // Route Arabic content through arabic-skill if dialects are configured
  if (brandProfile.dialects.length > 0 && data.caption_ar) {
    const dialect = brandProfile.dialects[0]
    data.caption_ar = await generateDialectCopy(data.caption_ar, dialect, brandProfile.tone_keywords)
  }

  return data
}
