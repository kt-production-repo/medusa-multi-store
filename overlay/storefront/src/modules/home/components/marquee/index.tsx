const Marquee = () => {
  const items = [
    "Free Shipping on Orders Over $100",
    "100-Night Trial",
    "Free Returns",
    "Financing Available",
    "Premium Quality",
  ]

  return (
    <div className="bg-brand-dark border-t border-white/10 py-4 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span
            key={index}
            className="mx-8 text-sm font-medium text-white/70 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-brand-light rounded-full" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
