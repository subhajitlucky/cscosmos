'use client';
import { type ComponentPropsWithoutRef, type ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/components/visualizers/cssviz/utils/cn'

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 text-slate-900 shadow-sm hover:shadow-md hover:-translate-y-[1px]',
        secondary:
          'bg-white text-slate-900 border border-slate-200 shadow-sm hover:border-slate-300 hover:-translate-y-[1px] dark:bg-surface dark:text-body-text dark:border-glass dark:hover:border-white/30 dark:hover:shadow-glow/60',
        ghost: 'text-muted-text hover:text-body-text hover:bg-black/5 dark:hover:bg-white/5',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type PolymorphicProps<E extends ElementType> = {
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, 'as'> &
  VariantProps<typeof buttonStyles>

export const Button = <E extends ElementType = 'button'>({
  as,
  className,
  variant,
  size,
  ...props
}: PolymorphicProps<E>) => {
  const Component = (as ?? 'button') as ElementType
  return <Component className={cn(buttonStyles({ variant, size }), className)} {...props} />
}

