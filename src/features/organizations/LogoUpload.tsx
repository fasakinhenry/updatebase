import { useRef } from 'react'
import { Camera, TrashSimple } from '@phosphor-icons/react'
import { toast } from '@/stores/toast'

const MAX_BYTES = 2 * 1024 * 1024

/** the first two letters of the first two words, which is what a logo falls back to. */
function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase()
  return `${words[0]![0]}${words[1]![0]}`.toUpperCase()
}

export function LogoUpload({
  value,
  onChange,
  name,
}: {
  value?: string
  onChange: (url: string | undefined) => void
  name: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('that is not an image', 'pick a png, jpg or svg')
      return
    }
    if (file.size > MAX_BYTES) {
      toast.error('that image is too large', 'keep it under 2mb')
      return
    }

    onChange(URL.createObjectURL(file))
  }

  const clear = () => {
    if (value?.startsWith('blob:')) URL.revokeObjectURL(value)
    onChange(undefined)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex items-center gap-5">
      {value ? (
        <img
          src={value}
          alt=""
          width={76}
          height={76}
          className="shrink-0 rounded-2xl border border-hairline bg-surface object-cover"
          style={{ width: 76, height: 76 }}
        />
      ) : (
        <span
          aria-hidden="true"
          style={{ width: 76, height: 76 }}
          className="flex shrink-0 items-center justify-center rounded-2xl bg-primary-soft font-display text-display-sm font-semibold text-primary"
        >
          {initials(name || 'ub')}
        </span>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-caption text-ink transition-colors duration-fast hover:bg-surface"
          >
            <Camera size={13} weight="bold" aria-hidden="true" />
            {value ? 'change logo' : 'add a logo'}
          </button>

          {value && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-caption text-ink transition-colors duration-fast hover:bg-surface"
            >
              <TrashSimple size={13} weight="bold" aria-hidden="true" />
              remove
            </button>
          )}
        </div>

        <p className="text-caption text-ink-muted">
          a square png works best. until you add one we use your initials.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={onFile}
        className="sr-only"
        aria-label="upload an organization logo"
      />
    </div>
  )
}
