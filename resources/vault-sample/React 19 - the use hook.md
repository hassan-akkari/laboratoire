---
publish: true
title: "React 19: use() is not a hook"
stage: budding
tags: [react, frontend]
created: 2026-06-21
updated: 2026-07-02
---

# React 19: use() is not a hook

`use()` looks like a hook but deliberately breaks the rules of hooks: you can call it **inside conditionals and loops**. It does two unrelated-looking things with one API:

**1. Reads context conditionally** — something `useContext` never allowed:

```tsx
function StatusBadge({ compact }: { compact: boolean }) {
  if (compact) return <Dot />;
  const theme = use(ThemeContext); // legal: after an early return
  return <Badge theme={theme} />;
}
```

**2. Unwraps promises**, suspending the component until they settle:

```tsx
function Comments({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  const comments = use(commentsPromise); // suspends; nearest <Suspense> shows the fallback
  return comments.map((c) => <p key={c.id}>{c.text}</p>);
}
```

The pattern that finally clicked for me: **start the fetch in a Server Component, pass the promise down, `use()` it in a Client Component**. The request begins on the server, and the client component stays synchronous-looking without `useEffect` plumbing.

Caveat: the promise must come from a Suspense-compatible source (or be cached) — creating it during render re-triggers the fetch on every render.
