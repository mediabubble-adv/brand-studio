import { GoogleGenerativeAI } from '@google/generative-ai'

interface CompetitorPost {
  id: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
  postedAt: string
}

interface CompetitorStyleSummary {
  predominant_colors: string[]
  visual_style: string
  layout_strategy: 'row-theme' | 'alternating' | 'checkerboard' | 'color-block' | 'mixed'
  key_themes: string[]
}

export async function analyzeCompetitorFeed(
  competitorHandle: string
): Promise<CompetitorStyleSummary> {
  // Simulate scraping competitor posts from Instagram Business profile
  const mockPosts: CompetitorPost[] = [
    {
      id: 'c1',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400',
      caption: 'Unleash your power! Join our weekend functional fitness class today.',
      likes: 124,
      comments: 18,
      postedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'c2',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      caption: 'Success is built at 5 AM. Our coaches are ready for you.',
      likes: 310,
      comments: 42,
      postedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'dummy_key')
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
    Analyze these competitor social media posts (captions and layout themes):
    ${JSON.stringify(mockPosts)}
    
    Extract visual styling and layout strategies.
    Return ONLY a valid JSON object matching:
    {
      "predominant_colors": ["list of hex codes or color names"],
      "visual_style": "description of the imagery style",
      "layout_strategy": "one of: 'row-theme', 'alternating', 'checkerboard', 'color-block', 'mixed'",
      "key_themes": ["up to 3 main topics/themes discussed"]
    }
  `

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    return JSON.parse(clean) as CompetitorStyleSummary
  } catch {
    return {
      predominant_colors: ['#000000', '#ffffff'],
      visual_style: 'High-contrast athletic focus',
      layout_strategy: 'alternating',
      key_themes: ['motivation', 'morning training'],
    }
  }
}
