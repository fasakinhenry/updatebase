import { useRef, useState } from 'react'
import { ArrowsClockwise, Camera, Trash } from '@phosphor-icons/react'
import { AVATAR_STYLES, avatarUrl, randomSeed, type AvatarStyle } from '@/lib/avatar'
import { toast } from '@/stores/toast'
import { cn } from '@/lib/cn'

export interface AvatarValue {
  seed: string
  style: AvatarStyle
  photoUrl?: string
  mode: 'avatar' | 'photo'
}

interface AvatarPickerProps {
  value: AvatarValue
  onChange: (value: AvatarValue) => void
  /** their google picture, offered as a one tap option when they have one */
  googlePhotoUrl?: string
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

export function AvatarPicker({ value, onChange, googlePhotoUrl }: AvatarPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)

  const shownPhoto = value.photoUrl ?? uploadPreview ?? googlePhotoUrl
  const showingPhoto = value.mode === 'photo' && Boolean(shownPhoto)

  const shuffle = () => {
    onChange({ ...value, seed: randomSeed(), mode: 'avatar' })
  }

  const pickStyle = (style: AvatarStyle) => {
    onChange({ ...value, style, mode: 'avatar' })
  }

  const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('that is not an image', 'pick a jpg, png or webp')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('that image is too large', 'keep it under 4mb')
      return
    }

    // a local preview until the real upload lands, so the ui responds instantly
    const objectUrl = URL.createObjectURL(file)
    setUploadPreview(objectUrl)
    onChange({ ...value, photoUrl: objectUrl, mode: 'photo' })
  }

  const clearPhoto = () => {
    if (uploadPreview) URL.revokeObjectURL(uploadPreview)
    setUploadPreview(null)
    onChange({ ...value, photoUrl: undefined, mode: 'avatar' })
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-5">
        <img
          src={showingPhoto ? shownPhoto : avatarUrl(value.seed, { style: value.style, size: 88 })}
          alt=""
          width={88}
          height={88}
          className="size-22 shrink-0 rounded-full border border-hairline bg-surface object-cover"
          style={{ width: 88, height: 88 }}
        />

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={shuffle}
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-caption text-ink transition-colors duration-fast hover:bg-surface"
            >
              <ArrowsClockwise size={13} weight="bold" aria-hidden="true" />
              shuffle avatar
            </button>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-caption text-ink transition-colors duration-fast hover:bg-surface"
            >
              <Camera size={13} weight="bold" aria-hidden="true" />
              upload a photo
            </button>

            {shownPhoto && (
              <button
                type="button"
                onClick={() =>
                  showingPhoto ? clearPhoto() : onChange({ ...value, mode: 'photo' })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-caption text-ink transition-colors duration-fast hover:bg-surface"
              >
                {showingPhoto ? (
                  <>
                    <Trash size={13} weight="bold" aria-hidden="true" />
                    use an avatar instead
                  </>
                ) : (
                  <>
                    <Camera size={13} weight="bold" aria-hidden="true" />
                    use my photo
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-caption text-ink-muted">
            {showingPhoto
              ? 'your photo is what people will see'
              : 'shuffle until one feels like you, or upload a photo'}
          </p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onFile}
          className="sr-only"
          aria-label="upload a profile photo"
        />
      </div>

      {!showingPhoto && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-caption text-ink-muted">avatar style</legend>
          <div className="flex flex-wrap gap-1.5">
            {AVATAR_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => pickStyle(style)}
                aria-pressed={value.style === style}
                title={style.replace(/-/g, ' ')}
                className={cn(
                  'overflow-hidden rounded-lg border p-0.5 transition-colors duration-fast',
                  value.style === style
                    ? 'border-primary bg-primary-soft'
                    : 'border-hairline hover:border-hairline-strong',
                )}
              >
                <img
                  src={avatarUrl(value.seed, { style, size: 36 })}
                  alt={style.replace(/-/g, ' ')}
                  width={36}
                  height={36}
                  loading="lazy"
                  className="rounded-md"
                  style={{ width: 36, height: 36 }}
                />
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  )
}
