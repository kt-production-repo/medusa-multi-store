import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import Marquee from "@modules/home/components/marquee"
import ProductHighlights from "@modules/home/components/product-highlights"
import CategoryGrid from "@modules/home/components/category-grid"
import OurPromise from "@modules/home/components/our-promise"
import Testimonials from "@modules/home/components/testimonials"

export const metadata: Metadata = {
  title: "Medusa Store | Premium Mattresses & Bedding",
  description:
    "Discover our collection of premium mattresses and bedding designed to transform your sleep experience.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  return (
    <>
      <Hero />
      <Marquee />
      <ProductHighlights />
      <CategoryGrid />
      <OurPromise />
      <Testimonials />
    </>
  )
}
