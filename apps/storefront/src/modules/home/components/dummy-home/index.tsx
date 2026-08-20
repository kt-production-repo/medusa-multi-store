import * as React from "react"

// A hand-written, fully responsive "dummy" home page, authored in code and
// exposed to Plasmic Studio via registerComponent() in src/lib/plasmic-init.ts.
// Layout is mobile-first: single column on phones, scaling up at sm/md/lg.
export interface DummyHomePageProps {
  title?: string
  subtitle?: string
  ctaLabel?: string
  className?: string
  onCtaClick?: () => void
}

const FEATURES = [
  {
    title: "Fast Delivery",
    body: "Get your order shipped within 24 hours, anywhere in the region.",
  },
  {
    title: "Secure Checkout",
    body: "Your payments are protected with industry-standard encryption.",
  },
  {
    title: "Easy Returns",
    body: "Changed your mind? Return any item within 30 days, no questions.",
  },
]

export function DummyHomePage({
  title = "Build something people love",
  subtitle = "A starter storefront powered by Medusa and Next.js. Responsive out of the box, ready for you to make it your own.",
  ctaLabel = "Shop now",
  className,
  onCtaClick,
}: DummyHomePageProps) {
  return (
    <div className={"w-full bg-neutral-950 text-neutral-100 " + (className ?? "")}>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <span className="mb-4 rounded-full border border-blue-900/60 bg-blue-950/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
          New collection
        </span>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-sm text-neutral-400 sm:mt-6 sm:text-base lg:text-lg">
          {subtitle}
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={onCtaClick}
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 sm:text-base"
          >
            {ctaLabel}
          </button>
          <button
            type="button"
            className="rounded-md border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 sm:text-base"
          >
            Learn more
          </button>
        </div>
      </section>

      {/* Feature grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 text-left transition hover:border-neutral-700"
            >
              <h3 className="text-lg font-bold text-white sm:text-xl">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-blue-900/60 to-neutral-900 px-6 py-10 text-center sm:gap-6 sm:px-12 sm:py-16">
          <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl lg:text-4xl">
            Ready to get started?
          </h2>
          <button
            type="button"
            onClick={onCtaClick}
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 sm:text-base"
          >
            {ctaLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default DummyHomePage
