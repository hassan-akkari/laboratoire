"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { setStyle } from "@/app/actions/setStyle";
import {
  STYLE_LABELS,
  STYLE_VARIANTS,
  type StyleVariant,
} from "@/lib/style-shared";
import { cn } from "@/lib/utils";

// Floating, top-right segmented control to flip between the three live designs.
// Flow: click a segment → optimistic local highlight → server action writes the
// `bs_style` cookie + revalidatePath("/","layout") → router.refresh() re-renders
// the tree with the new variant. The sliding active pill uses framer-motion's
// `layoutId` so the highlight glides between segments (static when reduced
// motion is requested).
//
// Accessibility: a labelled group of real <button>s with aria-pressed; native
// keyboard/focus behaviour; visible focus-visible rings; the control is always
// rendered with the shadcn tokens so it reads clearly over any variant.
export function StyleSwitcher({ active }: { active: StyleVariant }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  // The admin is a single clean internal UI — the marketing variant switcher
  // has no place there. Hide it on every /admin route (it still renders on the
  // public catalogue/booking pages).
  if (pathname?.startsWith("/admin")) return null;

  function choose(variant: StyleVariant) {
    if (variant === active) return;
    startTransition(async () => {
      await setStyle(variant);
      router.refresh();
    });
  }

  return (
    <div
      className="fixed right-4 top-4 z-50 print:hidden"
      // Keep the control above page content but out of the reading flow.
    >
      <div
        role="group"
        aria-label="Choose a visual design"
        aria-busy={isPending}
        className="flex items-center gap-0.5 rounded-full border border-border bg-background/80 p-1 shadow-lg ring-1 ring-foreground/5 backdrop-blur-md supports-backdrop-filter:bg-background/60"
      >
        {STYLE_VARIANTS.map((variant) => {
          const selected = variant === active;
          return (
            <button
              key={variant}
              type="button"
              onClick={() => choose(variant)}
              disabled={isPending}
              aria-pressed={selected}
              className={cn(
                "relative inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:cursor-not-allowed",
                selected
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {selected ? (
                reduce ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                ) : (
                  <motion.span
                    aria-hidden="true"
                    layoutId="style-switcher-active"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )
              ) : null}
              <span className="relative">{STYLE_LABELS[variant]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
