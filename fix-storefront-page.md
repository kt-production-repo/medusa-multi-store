# Fix: Storefront Page Runtime Errors

## Problem
`https://shop.nokor24.com/us` shows "Application error: a client-side exception has occurred."

Two server-side errors in Dokploy logs:

1. `Error: Server Functions cannot be called during initial render. This would create a fetch waterfall.`
2. `Error: Event handlers cannot be passed to Client Component props. {onSubmit: function onSubmit, className: ..., children: ...}`

## Root Cause

**Error 2 is the definitive root cause.** In `overlay/storefront/src/modules/layout/templates/footer/index.tsx:30-31`:

```tsx
<form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
```

The Footer is a **Server Component** (`export default async function Footer()` — no `"use client"` directive). Server Components cannot have event handlers. The `onSubmit` function is not serializable and causes React to throw.

**Error 1 is a cascading error** from Error 2 — when the Footer fails to serialize, Next.js error handling produces this secondary error.

The upstream footer has no event handlers — it is purely server-rendered HTML with links.

## Fix Plan

### Step 1: Create NewsletterForm Client Component
Create `overlay/storefront/src/modules/layout/components/newsletter-form/index.tsx`:
- Add `"use client"` directive
- Move the `<form>` with `onSubmit`, `<input>`, and `<button>` into this component
- The current `onSubmit` is a no-op (`e.preventDefault()`), so it's purely presentational

### Step 2: Update Footer
In `overlay/storefront/src/modules/layout/templates/footer/index.tsx`:
- Replace the inline `<form onSubmit={...}>` block with `<NewsletterForm />`
- Import from `@modules/layout/components/newsletter-form`
- Footer stays as async Server Component (preserving `listCollections`/`listCategories` data fetching)

### Step 3: Push and Deploy
- Commit and push to both remotes (`origin` and `gitea`)
- Dokploy auto-deploys from `origin/improve-v2`
