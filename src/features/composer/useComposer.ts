import { useCallback, useEffect, useRef, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import { toast } from '@/stores/toast'
import type { Category, Channel, FormatResult, RenderResult } from '@/types/api'

export interface Draft {
  raw: string
  header: string
  body: string
  category: Category
  link: string
  tags: string[]
  deadline: string
  footer: string
  number: number
  channels: Channel[]
  isRemote: boolean
}

const EMPTY: Draft = {
  raw: '',
  header: '',
  body: '',
  category: 'alpha',
  link: '',
  tags: [],
  deadline: '',
  footer: '',
  number: 1,
  channels: ['updatebase'],
  isRemote: false,
}

/**
 * a draft survives a refresh, a closed tab and a dead battery. losing a half
 * written update to a stray reload would be the single most annoying thing
 * this product could do.
 */
function storageKey(organizationId: string) {
  return `updatebase:draft:${organizationId}`
}

function loadDraft(organizationId: string): Draft {
  try {
    const raw = localStorage.getItem(storageKey(organizationId))
    if (!raw) return EMPTY
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Draft>) }
  } catch {
    return EMPTY
  }
}

export function useComposer(organizationId: string | undefined) {
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [formatting, setFormatting] = useState(false)
  const [rendering, setRendering] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [renderings, setRenderings] = useState<Record<string, string>>({})
  const [limits, setLimits] = useState<Record<string, number>>({})
  const [usedAi, setUsedAi] = useState(true)
  const [loadedFor, setLoadedFor] = useState<string | undefined>()

  // adopting the saved draft during render avoids a flash of an empty editor
  if (organizationId && loadedFor !== organizationId) {
    setLoadedFor(organizationId)
    setDraft(loadDraft(organizationId))
  }

  const saveTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!organizationId) return

    // debounced, so typing does not hit storage on every keystroke
    window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey(organizationId), JSON.stringify(draft))
      } catch {
        // storage full or blocked. the draft still lives in memory.
      }
    }, 600)

    return () => window.clearTimeout(saveTimer.current)
  }, [draft, organizationId])

  const patch = useCallback((changes: Partial<Draft>) => {
    setDraft((current) => ({ ...current, ...changes }))
  }, [])

  const clear = useCallback(() => {
    setDraft(EMPTY)
    setRenderings({})
    if (organizationId) {
      try {
        localStorage.removeItem(storageKey(organizationId))
      } catch {
        // nothing to do
      }
    }
  }, [organizationId])

  /** paste in, formatted update out. `instruction` refines what is already there. */
  const format = useCallback(
    async (instruction?: string) => {
      if (!organizationId) return
      if (!draft.raw.trim() && !instruction) {
        toast.info('paste something first', 'drop in the opportunity and we take it from there')
        return
      }

      setFormatting(true)
      try {
        const result = await api.post<FormatResult>(`/api/composer/${organizationId}/format`, {
          raw: draft.raw || draft.body,
          instruction,
          previous: instruction ? draft.body : undefined,
        })

        patch({
          header: result.header,
          body: result.body,
          category: result.category,
          link: result.link ?? '',
          tags: result.tags,
          deadline: result.deadline ? result.deadline.slice(0, 10) : '',
          footer: result.footer,
          number: result.number,
        })

        setUsedAi(result.usedAi)
        // the channel versions are now stale, so drop them rather than show a lie
        setRenderings({})

        if (!result.usedAi) {
          toast.warning(
            'formatted without ai',
            'the free quota is used up for now, so we did it the simple way. edit anything that reads wrong.',
          )
        }
      } catch (error) {
        const message =
          error instanceof ApiError ? error.friendlyMessage : 'could not format that'
        toast.error('formatting failed', message)
      } finally {
        setFormatting(false)
      }
    },
    [organizationId, draft.raw, draft.body, patch],
  )

  /** reshapes the update for every channel it is going to. */
  const render = useCallback(async () => {
    if (!organizationId || !draft.body) return

    setRendering(true)
    try {
      const result = await api.post<RenderResult>(`/api/composer/${organizationId}/render`, {
        header: draft.header,
        body: draft.body,
        category: draft.category,
        link: draft.link || null,
        tags: draft.tags,
        deadline: draft.deadline ? new Date(draft.deadline).toISOString() : null,
        footer: draft.footer,
        number: draft.number,
        channels: draft.channels,
      })

      setRenderings(result.renderings)
      setLimits(result.limits)
    } catch (error) {
      const message = error instanceof ApiError ? error.friendlyMessage : 'could not prepare those'
      toast.error('could not prepare the channel versions', message)
    } finally {
      setRendering(false)
    }
  }, [organizationId, draft])

  const publish = useCallback(async () => {
    if (!organizationId) return null

    setPublishing(true)
    try {
      const update = await api.post<{ _id: string }>(`/api/composer/${organizationId}/publish`, {
        header: draft.header,
        body: draft.body,
        category: draft.category,
        link: draft.link || null,
        tags: draft.tags,
        deadline: draft.deadline ? new Date(draft.deadline).toISOString() : null,
        footer: draft.footer,
        channels: draft.channels,
        isRemote: draft.isRemote,
        renderings: Object.keys(renderings).length > 0 ? renderings : undefined,
      })

      clear()
      return update
    } catch (error) {
      const message = error instanceof ApiError ? error.friendlyMessage : 'could not publish that'
      toast.error('publishing failed', message)
      return null
    } finally {
      setPublishing(false)
    }
  }, [organizationId, draft, renderings, clear])

  return {
    draft,
    patch,
    clear,
    format,
    render,
    publish,
    formatting,
    rendering,
    publishing,
    renderings,
    limits,
    usedAi,
    /** there is enough here to publish */
    ready: Boolean(draft.header.trim() && draft.body.trim() && draft.channels.length > 0),
  }
}
