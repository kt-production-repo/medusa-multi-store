import ScrollReveal from "@modules/common/components/scroll-reveal"

const testimonials = [
  {
    text: "The mattress arrived quickly and was very easy to set up. Very comfortable and supportive. It's exactly what I was looking for.",
    name: "Emily Johnson",
    rating: 5,
  },
  {
    text: "I've been sleeping on this mattress for two months now. It's been wonderful for my back pain and I haven't had a single issue. Highly recommend!",
    name: "Michael Chen",
    rating: 5,
  },
  {
    text: "I've been sleeping on this mattress for two months now. It's been wonderful for my back pain and I haven't had a single issue. Highly recommend!",
    name: "Sarah Williams",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-14 lg:py-32 bg-[#d3e4cd]">
      <div className="content-container">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark mb-16 text-center">
            Loved By Thousands
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 100}>
              <div className="bg-white rounded-3xl p-6 lg:p-8 h-full">
                <p className="text-grey-50 mb-8 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-grey-90">
                    {testimonial.name}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-brand-dark fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
