export async function generateRawImage(
  prompt: string,
  engine: 'imagen' | 'sdxl' = 'sdxl'
): Promise<string> {
  if (engine === 'imagen') {
    // Placeholder Vertex AI call structure
    // Requires GCP access token/auth
    throw new Error('Imagen 3 Vertex AI integration deferred to local setup')
  }

  // Stability AI SDXL API call
  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.STABILITY_API_KEY || ''}`,
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Stability AI error: ${errorBody}`)
  }

  const result = await response.json()
  const base64 = result.artifacts[0].base64
  return `data:image/png;base64,${base64}`
}
