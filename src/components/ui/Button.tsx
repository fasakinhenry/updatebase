import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variant = "cta" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-xs font-body text-button-lg rounded-lg cursor-pointer transition-[background-color,color,border-color,transform,box-shadow] duration-base ease-standard disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  cta: "bg-cta text-on-cta shadow-button hover:bg-cta-deep hover:-translate-y-px hover:shadow-soft-lift",
  secondary:
    "bg-paper text-ink border border-hairline shadow-soft-lift hover:bg-cloud hover:-translate-y-px",
  ghost: "bg-transparent text-ink hover:bg-cloud",
};

const sizes: Record<Size, string> = {
  md: "px-lg py-[10px]",
  lg: "px-xl py-[14px] text-body-md",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  variant = "cta",
  size = "md",
  icon,
  iconPosition = "right",
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {icon && iconPosition === "left" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {icon && iconPosition === "left" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </button>
  );
}
