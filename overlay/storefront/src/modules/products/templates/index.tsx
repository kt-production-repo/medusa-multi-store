import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollReveal from "@modules/common/components/scroll-reveal"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    notFound()
  }

  return (
    <>
      <div className="py-6 content-container">
        {/* Breadcrumbs */}
        <ScrollReveal>
          <div className="flex items-center gap-2 text-sm text-grey-50 mb-8">
            <LocalizedClientLink href="/" className="hover:text-brand-dark transition-colors">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-brand-dark transition-colors">
              Store
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-grey-90 font-medium">{product.title}</span>
          </div>
        </ScrollReveal>

        {/* Product layout */}
        <div
          className="flex flex-col small:flex-row small:items-start gap-8 lg:gap-16 relative"
          data-testid="product-container"
        >
          {/* Image gallery - left side */}
          <div className="w-full small:w-1/2 relative">
            <ImageGallery images={images} />
          </div>

          {/* Product info and actions - right side */}
          <div className="w-full small:w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <ProductInfo product={product} />
            </div>

            <ProductOnboardingCta />

            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            <div className="mt-4">
              <ProductTabs product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
