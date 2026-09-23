import { avatarUrl, type AvatarStyle } from '@/lib/avatar'
import { cn } from '@/lib/cn'

interface AvatarProps {
  /** a dicebear seed, or pass `src` for an uploaded photo */
  seed?: string
  src?: string
  alt: string
  size?: number
  style?: AvatarStyle
  className?: string
  /** avatars below the fold should stay lazy, the one in the header should not */
  priority?: boolean
}

export function Avatar({
  seed,
  src,
  alt,
  size = 40,
  style = 'notionists',
  className,
  priority = false,
}: AvatarProps) {
  const source = src ?? avatarUrl(seed ?? 'updatebase', { style, size })

  return (
    <img
      src={source}
      alt={alt}
      // explicit dimensions on every image, so nothing reflows while it loads
      width={size}
      height={size}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('shrink-0 rounded-full bg-surface-2 object-cover', className)}
      style={{ width: size, height: size }}
    />
  )
}
