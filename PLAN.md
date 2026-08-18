# Storefront Redesign Plan

Visual redesign of the Medusa storefront inspired by mattsleeps.com — clean, modern DTC aesthetic with generous whitespace, rounded components, and smooth transitions.

All changes go under `overlay/storefront/src/` (additive only). Upstream `apps/storefront/` stays untouched.

---

## Phase 1: Design Foundation ✅

**Goal:** Establish the new design system — colors, typography, spacing, and global styles.

- [x] **1.1** Define Tailwind color tokens in `tailwind.config.js` overlay: `brand-dark`, `brand`, `brand-light`, `brand-lighter`, `surface`, `border` (blue-based palette matching mattsleeps)
- [x] **1.2** Configure Tailwind font families: heading font (Inter or system sans-serif as proxy for Hurme Geometric Sans) + body font (Inter/system)
- [x] **1.3** Update `overlay/storefront/src/styles/globals.css` with new CSS custom properties, base typography overrides, and smooth scroll behavior
- [x] **1.4** Add Tailwind keyframe animations: `fade-in-up`, `slide-in-right`, `marquee`, `accordion-open/close` (reuse existing where possible)
- [x] **1.5** Define reusable component classes: `.btn-primary`, `.btn-outline`, `.btn-white`, `.card`, `.section-dark`, `.section-light`, `.nav-link`, `.reveal`, `.icon-circle`

**Verify:** `check-overlay.sh` passes, Tailwind build succeeds, colors render correctly.

---

## Phase 2: Navigation Redesign ✅

**Goal:** Replace the current utilitarian nav with a polished sticky header matching mattsleeps patterns.

- [x] **2.1** Redesign nav layout: 80px height, transparent-on-hero -> white-on-scroll transition via scroll listener
- [x] **2.2** Style logo: bold text, centered on mobile, left-aligned on desktop, color transitions on scroll
- [x] **2.3** Add hover underline animation on nav links (`.nav-link` class with `after:` pseudo-element sweep)
- [x] **2.4** Redesign cart icon: 40px rounded-full circle with border, badge count overlay
- [x] **2.5** Redesign mobile hamburger: 40px circle with animated 3-span bars morphing to X
- [x] **2.6** Redesign mobile slide-in menu: full-height panel sliding from right, `duration-500` transitions, white background
- [x] **2.7** Language/country selector: kept from upstream in side-menu footer, styled with transitions

**Verify:** Desktop nav matches reference. Mobile menu slides in with smooth animation. Scroll transition works.

---

## Phase 3: Footer Redesign ✅

**Goal:** Replace the minimal footer with a rich, dark-themed footer matching mattsleeps.

- [x] **3.1** Redesign footer layout: dark navy (`bg-brand-dark`) background, 2-column (left: logo + newsletter, right: link columns)
- [x] **3.2** Add newsletter subscribe form: rounded-full input with `bg-white/10`, blue submit button
- [x] **3.3** Style link columns: section headings (`text-white/50`, bold, uppercase), links with `nav-link` hover underline animation
- [x] **3.4** Add payment method row: pills with `bg-white/5`, border, rounded-full
- [x] **3.5** Add brand tagline at bottom (`text-4xl lg:text-5xl font-bold text-white/10`)

**Verify:** Footer matches reference layout. Newsletter form validates. Links work.

---

## Phase 4: Homepage Redesign ✅

**Goal:** Transform the default homepage into a modern DTC landing page.

- [x] **4.1** Redesign Hero section: full-viewport height, large heading text overlay, CTA button (white rounded-full on dark)
- [x] **4.2** Add marquee/scrolling text banner below hero (CSS-only infinite scroll animation)
- [x] **4.3** Build product highlight cards section: 2-column grid, rounded-[40px] cards with gradient backgrounds
- [x] **4.4** Build bundle/collection cards section: 2-3 column grid of `rounded-2xl` cards with border, hover state
- [x] **4.5** Build category image grid: asymmetric 2-column (desktop 4-column) with `rounded-3xl`/`rounded-[40px]` images
- [x] **4.6** Build "Our Promise" section: dark navy background, 4-column icon+text grid
- [x] **4.7** Build testimonials section: light blue (`#d3e4cd`) background, testimonial cards
- [x] **4.8** Add scroll-triggered reveal animations on all sections (IntersectionObserver -> add visible class)

**Verify:** Homepage loads with all sections. Animations trigger on scroll. Responsive on mobile/tablet/desktop.

---

## Phase 5: Product & Category Pages ✅

**Goal:** Polish product cards and category pages to match the new design system.

- [x] **5.1** Redesign product card component: card class, rounded overflow, hover scale, square aspect ratio, price formatting
- [x] **5.2** Redesign category page: breadcrumbs, large title, description, subcategory pills, scroll reveal
- [x] **5.3** Redesign collection page: breadcrumbs, large title, description, scroll reveal
- [x] **5.4** Update product detail page: 50/50 layout, breadcrumbs, reorganized info+actions+tabs
- [x] **5.5** Ensure all price displays use correct Medusa format (display directly, no division)

**Verify:** Product cards render with new style. Prices display correctly. Responsive grid works.

---

## Phase 6: Search UX Enhancement ✅

**Goal:** Upgrade the search experience from a basic icon+page to a polished pattern.

- [x] **6.1** Redesign search page: centered layout, larger search bar, better results grid spacing
- [x] **6.2** Style search bar: rounded-full input with left-aligned icon, focus ring animation
- [x] **6.3** Add search results count and "results for: {query}" header
- [x] **6.4** Improve no-results state: friendly message with suggestion to browse categories
- [x] **6.5** Add search icon in nav for quick access

**Verify:** Search page matches design. Results render correctly. No-results state is helpful.

---

## Phase 7: Checkout & Account Polish ✅

**Goal:** Ensure checkout and account pages follow the new design tokens.

- [x] **7.1** Apply new button styles to checkout steps (primary, outline, disabled states with loading spinner)
- [x] **7.2** Apply new typography and spacing to account pages (bold headings, proper spacing)
- [x] **7.3** Style account nav with new link hover animations (active state with brand-dark bg, rounded-lg)
- [x] **7.4** Ensure mobile responsiveness across all account/checkout flows

**Verify:** Checkout flow works end-to-end. Account pages render correctly.

---

## Phase 8: Final Integration & Testing

**Goal:** End-to-end verification, performance check, and cleanup.

- [ ] **8.1** Run `check-overlay.sh` — confirm no collisions
- [ ] **8.2** Full responsive audit: mobile (375px), tablet (768px), desktop (1280px+)
- [ ] **8.3** Performance check: no layout shift, images optimized, animations use `transform`/`opacity` only
- [ ] **8.4** Verify all internal links work (nav, footer, product cards, category cards)
- [ ] **8.5** Verify search flow end-to-end: icon -> search page -> results -> product detail
- [ ] **8.6** Verify cart flow: add to cart -> cart dropdown -> checkout
- [ ] **8.7** Final commit and push to both remotes

**Verify:** All pages render correctly. No console errors. Build succeeds. Deploy succeeds.

---

## Design Tokens Reference (from mattsleeps.com analysis)

| Token | Value | Usage |
|-------|-------|-------|
| `brand-dark` | `#1A478A` | Footer bg, primary headings, hamburger bars |
| `brand` | Medium blue | Primary CTA buttons, hover underlines |
| `brand-light` | Lighter blue | Card hover bg, outline button borders |
| `brand-lighter` | Lightest blue | Testimonial section bg |
| `surface` | `#F5F5F5` | Alternating section bg, mobile menu bg |
| `border` | `#E3E3E3` | Card borders, input borders |

### Key Patterns

- **Buttons:** `rounded-full`, `px-6 py-3`, transitions `duration-300`
- **Cards:** `rounded-2xl` to `rounded-[40px]`, `border-[1px]`, hover state with brand-light
- **Sections:** `py-14 lg:py-32`, alternating dark/light backgrounds
- **Nav links:** `after:` underline sweep on hover, `duration-300`
- **Scroll reveals:** `opacity-0 translate-y-[40px]` -> visible via IntersectionObserver
- **Mobile menu:** Right-sliding panel, accordion categories, `duration-500` slide transition

### Prices

**CRITICAL:** Medusa prices are stored as-is (e.g., 49.99 NOT 4999). Display directly — NEVER divide by 100.
