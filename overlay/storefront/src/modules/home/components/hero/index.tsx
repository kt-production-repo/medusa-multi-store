import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="relative h-screen w-full bg-brand-dark flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 to-brand-dark" />

      {/* Content */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          Better Sleep,
          <br />
          <span className="text-brand-light">Better Life</span>
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
          Discover our collection of premium mattresses and bedding designed
          to transform your sleep experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LocalizedClientLink href="/store">
            <span className="btn-white px-8 py-4 text-lg">
              Shop Now
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/store">
            <span className="btn-outline !border-white/40 !text-white px-8 py-4 text-lg hover:!bg-white hover:!text-brand-dark">
              Explore Collection
            </span>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default Hero
