import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { SmartLink } from './SmartLink'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-body font-medium ' +
  'transition-[background-color,border-color,color,transform,opacity] duration-fast ease-standard ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'border border-hairline-strong bg-canvas text-ink hover:border-ink-muted hover:bg-surface',
  ghost: 'text-ink-soft hover:bg-surface hover:text-ink',
  inverse: 'bg-canvas text-ink hover:bg-surface-2',
  danger: 'bg-danger text-white hover:opacity-90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-body-sm',
  md: 'h-11 px-5 text-label',
  lg: 'h-13 px-6 text-body-lg',
}

interface Shared {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  /** stretch to the width of the parent, which is what we want on mobile */
  block?: boolean
  loading?: boolean
  children: ReactNode
  className?: string
}

type NativeButtonProps = Shared &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Shared> & { to?: undefined; href?: undefined }

type LinkButtonProps = Shared & {
  /** in-app route. prefetched on intent. */
  to: string
  href?: undefined
  target?: string
  rel?: string
  onClick?: () => void
}

type AnchorButtonProps = Shared & {
  /** external url or same page anchor */
  href: string
  to?: undefined
  target?: string
  rel?: string
  onClick?: () => void
}

export type ButtonProps = NativeButtonProps | LinkButtonProps | AnchorButtonProps

function Content({ icon, iconPosition, children, loading }: Shared) {
  return (
    <>
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        icon && iconPosition !== 'right' && <span aria-hidden="true" className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span aria-hidden="true" className="shrink-0">{icon}</span>
      )}
    </>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'right',
    block,
    loading = false,
    children,
    className,
    ...rest
  } = props

  const classes = cn(base, variants[variant], sizes[size], block && 'w-full', className)
  const shared = { variant, size, icon, iconPosition, loading, children }

  if ('to' in rest && rest.to) {
    const { to, ...linkRest } = rest as Omit<LinkButtonProps, keyof Shared>
    return (
      <SmartLink to={to} className={classes} {...linkRest}>
        <Content {...shared} />
      </SmartLink>
    )
  }

  if ('href' in rest && rest.href) {
    const { href, target, rel, ...anchorRest } = rest as Omit<AnchorButtonProps, keyof Shared>
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
        className={classes}
        {...anchorRest}
      >
        <Content {...shared} />
      </a>
    )
  }

  const buttonRest = rest as Omit<NativeButtonProps, keyof Shared>
  return (
    <button
      ref={ref}
      type={buttonRest.type ?? 'button'}
      className={classes}
      aria-busy={loading || undefined}
      {...buttonRest}
      disabled={buttonRest.disabled ?? loading}
    >
      <Content {...shared} />
    </button>
  )
})
