interface MetaResponse {
  id: string
  error?: {
    message: string
  }
}

interface StatusResponse {
  status_code: 'FINISHED' | 'IN_PROGRESS' | 'ERROR'
  error?: string
}

export async function publishToFacebook(
  imageUrl: string,
  message: string,
  facebookPageId: string,
  pageAccessToken: string
): Promise<{ id: string } | { error: string }> {
  try {
    const url = `https://graph.facebook.com/v19.0/${facebookPageId}/photos`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        message,
        access_token: pageAccessToken,
      }),
    })

    const data = (await res.json()) as MetaResponse

    if (data.error) {
      return { error: data.error.message }
    }

    return { id: data.id }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown Meta network error' }
  }
}

export async function publishToInstagram(
  imageUrl: string,
  caption: string,
  instagramBusinessId: string,
  pageAccessToken: string
): Promise<{ id: string } | { error: string }> {
  try {
    // 1. Create Media Container
    const containerUrl = `https://graph.facebook.com/v19.0/${instagramBusinessId}/media`
    const containerRes = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: pageAccessToken,
      }),
    })

    const containerData = (await containerRes.json()) as MetaResponse

    if (containerData.error) {
      return { error: containerData.error.message }
    }

    const containerId = containerData.id

    // 2. Poll Container Status
    let status: 'FINISHED' | 'IN_PROGRESS' | 'ERROR' = 'IN_PROGRESS'
    let retries = 5

    while (status === 'IN_PROGRESS' && retries > 0) {
      await new Promise(r => setTimeout(r, 3000))
      const statusUrl = `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${pageAccessToken}`
      const statusRes = await fetch(statusUrl)
      const statusData = (await statusRes.json()) as StatusResponse

      status = statusData.status_code
      retries--

      if (status === 'ERROR') {
        return { error: statusData.error ?? 'Media container preparation failed' }
      }
    }

    if (status !== 'FINISHED') {
      return { error: 'Media container preparation timed out' }
    }

    // 3. Publish Media Container
    const publishUrl = `https://graph.facebook.com/v19.0/${instagramBusinessId}/media_publish`
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: pageAccessToken,
      }),
    })

    const publishData = (await publishRes.json()) as MetaResponse

    if (publishData.error) {
      return { error: publishData.error.message }
    }

    return { id: publishData.id }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown Instagram network error' }
  }
}
