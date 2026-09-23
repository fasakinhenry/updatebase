interface Place {
  city?: string
  country?: string
}

/**
 * turns coordinates into a place name using openstreetmap's nominatim, which
 * is free and needs no key. a failure here is not worth interrupting anyone
 * over, so it resolves to null and the coordinates alone still do the ranking.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<Place | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('zoom', '10')

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    clearTimeout(timer)

    if (!response.ok) return null

    const payload = (await response.json()) as {
      address?: { city?: string; town?: string; state?: string; country?: string }
    }

    const address = payload.address
    if (!address) return null

    return {
      city: address.city ?? address.town ?? address.state,
      country: address.country,
    }
  } catch {
    return null
  }
}
