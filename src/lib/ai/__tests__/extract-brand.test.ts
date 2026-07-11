import { describe, it, expect, vi } from 'vitest'
import { extractBrandFromPdf } from '../extract-brand'

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            primary_color: '#FF0000',
            secondary_color: '#000000',
            accent_color: '#FFFFFF',
            bg_color: '#F5F5F5',
            font_header: 'Montserrat',
            font_body: 'Inter',
            font_accent: null,
            languages: ['ar-EG', 'en'],
            dialects: ['masri'],
            tone_keywords: ['bold', 'energetic'],
            grid_strategy: 'alternating',
          }),
        },
      }),
    }),
  })),
}))

describe('extractBrandFromPdf', () => {
  it('returns structured brand data from PDF text', async () => {
    const result = await extractBrandFromPdf('Brand guidelines text content here...')
    expect(result.primary_color).toBe('#FF0000')
    expect(result.languages).toContain('ar-EG')
    expect(result.tone_keywords).toContain('bold')
  })

  it('returns valid grid_strategy value', async () => {
    const result = await extractBrandFromPdf('...')
    const validStrategies = ['row-theme','alternating','checkerboard','color-block']
    expect(validStrategies).toContain(result.grid_strategy)
  })
})
