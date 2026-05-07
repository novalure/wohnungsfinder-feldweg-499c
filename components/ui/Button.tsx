import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type BaseProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

const variants = {
  primary:
    'bg-accent text-white hover:bg-[#263f31] focus-visible:ring-accent shadow-soft',
  secondary:
    'border border-accent/25 bg-surface text-accent hover:border-accent hover:bg-accent/5 focus-visible:ring-accent',
  ghost:
    'text-ink hover:bg-accent/5 focus-visible:ring-accent',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-60'

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  variant = 'primary',
  className = '',
  href,
  ...props
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  if (href.startsWith('/')) {
    return (
      <Link className={`${base} ${variants[variant]} ${className}`} href={href} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a className={`${base} ${variants[variant]} ${className}`} href={href} {...props}>
      {children}
    </a>
  )
}
