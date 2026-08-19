"use client"

import { createVendorProduct } from "@lib/data/vendor"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

const ProductForm = () => {
  const [message, formAction] = useActionState(createVendorProduct, null)

  const isError = message && typeof message === "object" && !message.success

  return (
    <div className="flex flex-col gap-4 rounded border border-ui-border-base p-4">
      <h2 className="text-large-semi text-ui-fg-base">Add a new product</h2>
      <form
        action={formAction}
        className="flex flex-col gap-y-2 w-full max-w-xl"
        data-testid="vendor-product-form"
      >
        <Input label="Title" name="title" type="text" required />
        <Input label="Handle" name="handle" type="text" />
        <Input label="Description" name="description" type="text" />
        <Input label="Thumbnail URL" name="thumbnail" type="url" />
        <Input label="Variant title" name="variant_title" type="text" />
        <div className="grid grid-cols-3 gap-2">
          <Input label="Price" name="price" type="number" required />
          <Input
            label="Currency"
            name="currency_code"
            type="text"
            defaultValue="usd"
            required
          />
          <Input
            label="Stock"
            name="stocked_quantity"
            type="number"
            defaultValue="100"
          />
        </div>
        <ErrorMessage
          error={isError ? (message as { error: string }).error : null}
          data-testid="vendor-product-form-error"
        />
        <SubmitButton data-testid="vendor-product-submit" className="w-full mt-4">
          Create product
        </SubmitButton>
      </form>
    </div>
  )
}

export default ProductForm