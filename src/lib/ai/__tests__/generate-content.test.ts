import { describe, it, expect, vi } from 'vitest'
import { generatePostContent } from '../generate-content'

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            caption_en: "Unleash your potential today!",
            caption_ar: "أطلق العنان لقدراتك اليوم!",
            hooks_en: ["Are you ready?", "Stop waiting!"],
            hooks_ar: ["هل أنت مستعد؟", "توقف عن الانتظار!"],
            image_prompt: "A motivational background of an athlete training during sunrise",
          }),
        },
      }),
    }),
  })),
}))

describe('generatePostContent', () => {
  it('returns structured english and arabic post details', async () => {
    const profile = {
      languages: ['en', 'ar-EG'],
      dialects: ['masri'],
      tone_keywords: ['bold', 'energetic'],
    }
    const result = await generatePostContent('Ramadan gym promotion', profile)
    expect(result.caption_en).toBe("Unleash your potential today!")
    expect(result.image_prompt).toContain("sunrise")
  })
})
