interface TokenResponse {
  access_token: string
  error?: string
}

interface GoogleAdsResponse {
  results?: Array<{ resourceName: string }>
  error?: {
    message: string
  }
}

export async function refreshGoogleAccessToken(
  refreshToken: string
): Promise<string> {
  const url = 'https://oauth2.googleapis.com/token'
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  const data = (await res.json()) as TokenResponse

  if (data.error || !data.access_token) {
    throw new Error(data.error ?? 'OAuth token refresh failed')
  }

  return data.access_token
}

export async function uploadGoogleAdsAsset(
  imageBase64: string,
  assetName: string,
  customerId: string,
  accessToken: string
): Promise<{ resourceName: string } | { error: string }> {
  try {
    const url = `https://googleads.googleapis.com/v17/customers/${customerId}/assets:mutate`

    // Remove base64 data url header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || 'dummy_dev_token',
      },
      body: JSON.stringify({
        operations: [
          {
            create: {
              name: assetName,
              type: 'IMAGE',
              imageAsset: {
                data: cleanBase64,
              },
            },
          },
        ],
      }),
    })

    const data = (await res.json()) as GoogleAdsResponse

    if (data.error) {
      return { error: data.error.message }
    }

    const resourceName = data.results?.[0]?.resourceName

    if (!resourceName) {
      return { error: 'Asset upload succeeded but returned no resource name' }
    }

    return { resourceName }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Unknown Google Ads network error' }
  }
}
