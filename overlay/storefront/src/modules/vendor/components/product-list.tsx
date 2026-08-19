"use client"

import { useState } from "react"
import {
  deleteVendorProduct,
  updateVendorProduct,
  VendorProduct,
} from "@lib/data/vendor"
import { useActionState } from "react"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"

type ProductListProps = {
  products: VendorProduct[]
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="flex flex-col gap-4" data-testid="vendor-product-list">
      {products.length === 0 && (
        <p className="text-small-regular text-ui-fg-muted">
          No products yet. Create your first product above.
        </p>
      )}
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </div>
  )
}

const ProductRow = ({ product }: { product: VendorProduct }) => {
  const [editing, setEditing] = useState(false)
  const variant = product.variants?.[0]
  const price = variant?.prices?.[0]

  const handleDelete = async () => {
    await deleteVendorProduct(product.id)
    window.location.reload()
  }

  return (
    <div className="rounded border border-ui-border-base p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-base-semi text-ui-fg-base">{product.title}</span>
          <span className="text-small-regular text-ui-fg-muted">
            {product.status}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-small-regular text-ui-fg-base underline"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="text-small-regular text-ui-fg-error underline"
          >
            Delete
          </button>
        </div>
      </div>
      {editing && (
        <ProductEditForm product={product} />
      )}
      {!editing && price && (
        <span className="text-small-regular text-ui-fg-muted">
          {price.currency_code?.toUpperCase()} {price.amount}
        </span>
      )}
    </div>
  )
}

const ProductEditForm = ({ product }: { product: VendorProduct }) => {
  const [message, formAction] = useActionState(updateVendorProduct, null)
  const variant = product.variants?.[0]
  const price = variant?.prices?.[0]

  const isError = message && typeof message === "object" && !message.success

  return (
    <form
      action={formAction}
      className="flex flex-col gap-y-2 w-full max-w-xl"
      data-testid="vendor-product-edit-form"
    >
      <input type="hidden" name="product_id" value={product.id} />
      <input type="hidden" name="variant_id" value={variant?.id ?? ""} />
      <Input label="Title" name="title" type="text" defaultValue={product.title} />
      <Input label="Handle" name="handle" type="text" defaultValue={product.handle} />
      <Input
        label="Description"
        name="description"
        type="text"
        defaultValue={product.description ?? ""}
      />
      <Input
        label="Thumbnail URL"
        name="thumbnail"
        type="url"
        defaultValue={product.thumbnail ?? ""}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Status"
          name="status"
          type="text"
          defaultValue={product.status}
        />
        <Input
          label="Price"
          name="price"
          type="number"
          defaultValue={String(price?.amount ?? "")}
        />
      </div>
      <Input
        label="Currency"
        name="currency_code"
        type="text"
        defaultValue={price?.currency_code ?? "usd"}
      />
      <ErrorMessage
        error={isError ? (message as { error: string }).error : null}
        data-testid="vendor-product-edit-error"
      />
      <SubmitButton data-testid="vendor-product-edit-submit" className="w-full mt-2">
        Save changes
      </SubmitButton>
    </form>
  )
}

export default ProductList