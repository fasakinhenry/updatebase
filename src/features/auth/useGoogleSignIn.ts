import { useEffect, useRef, useState } from 'react'
import { env } from '@/lib/env'

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleAccounts {
  id: {
    initialize(config: {
      client_id: string
      callback: (response: GoogleCredentialResponse) => void
      auto_select?: boolean
      cancel_on_tap_outside?: boolean
      use_fedcm_for_prompt?: boolean
    }): void
    renderButton(
      parent: HTMLElement,
      options: {
        type?: 'standard' | 'icon'
        theme?: 'outline' | 'filled_blue' | 'filled_black'
        size?: 'small' | 'medium' | 'large'
        text?: 'signin_with' | 'signup_with' | 'continue_with'
        shape?: 'rectangular' | 'pill'
        width?: number
        logo_alignment?: 'left' | 'center'
      },
    ): void
  }
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts }
  }
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

/** loads the google script once, no matter how many components ask for it. */
function loadScript(): Promise<void> {
  if (window.google?.accounts) return Promise.resolve()

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('google script failed')), {
        once: true,
      })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('google script failed')), { once: true })
    document.head.appendChild(script)
  })
}

interface Options {
  onCredential: (credential: string) => void
  text?: 'signin_with' | 'signup_with' | 'continue_with'
}

/**
 * renders google's own button, which is what google requires rather than a
 * lookalike. returns the ref to attach and whether it is ready.
 */
export function useGoogleSignIn({ onCredential, text = 'continue_with' }: Options) {
  const containerRef = useRef<HTMLDivElement>(null)

  // whether google is even configured is known before the first render, so it
  // is the initial state rather than something an effect discovers
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>(
    env.VITE_GOOGLE_CLIENT_ID ? 'loading' : 'unavailable',
  )

  // keeps the latest callback without re-initialising google every render
  const handler = useRef(onCredential)
  useEffect(() => {
    handler.current = onCredential
  }, [onCredential])

  useEffect(() => {
    if (!env.VITE_GOOGLE_CLIENT_ID) return

    let cancelled = false

    void loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return

        window.google.accounts.id.initialize({
          client_id: env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => handler.current(response.credential),
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        })

        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          logo_alignment: 'center',
          width: containerRef.current.offsetWidth || 360,
        })

        setState('ready')
      })
      .catch(() => {
        if (!cancelled) setState('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [text])

  return { containerRef, state }
}
