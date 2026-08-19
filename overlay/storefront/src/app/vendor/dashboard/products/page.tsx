import { listVendorProducts } from "@lib/data/vendor"
import ProductList from "@modules/vendor/components/product-list"
import ProductForm from "@modules/vendor/components/product-form"

export default async function VendorProductsPage() {
  const products = await listVendorProducts()

  return (
    <div className="flex flex-col gap-8" data-testid="vendor-products-page">
      <h1 className="text-2xl-semi text-ui-fg-base">Products</h1>
      <ProductForm />
      <ProductList products={products} />
    </div>
  )
}