import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

export const Textarea = forwardRef(function Textarea(
  {
    className,
    resizable = true,
    ...props
  }: { className?: string; resizable?: boolean } & Omit<Headless.TextareaProps, 'as' | 'className'>,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        // Basic layout
        'relative block w-full',
        // Background color + shadow applied to inset pseudo element
        'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-[var(--app-card)] before:shadow-sm',
        // Focus ring
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-[var(--app-accent)]',
        // Disabled state
        'has-data-disabled:opacity-60 has-data-disabled:before:shadow-none',
      ])}
    >
      <Headless.Textarea
        ref={ref}
        {...props}
        className={clsx([
          // Basic layout
          'relative block h-full w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
          // Typography
          'text-base/6 text-[color:var(--app-fg)] placeholder:text-[color:var(--app-muted)] sm:text-sm/6',
          // Border
          'border border-[color:var(--app-border)] data-hover:border-[color:var(--app-accent)]',
          // Background color
          'bg-transparent',
          // Hide default focus styles
          'focus:outline-hidden',
          // Invalid state
          'data-invalid:border-[#e06c75] data-invalid:data-hover:border-[#e06c75]',
          // Disabled state
          'disabled:border-[color:var(--app-border)] disabled:bg-transparent data-hover:disabled:border-[color:var(--app-border)]',
          // Resizable
          resizable ? 'resize-y' : 'resize-none',
        ])}
      />
    </span>
  )
})
