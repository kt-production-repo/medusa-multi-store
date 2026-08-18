import { clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {price.price_type === "sale" && (
        <span
          className="text-sm line-through text-grey-50"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clx("text-sm font-bold", {
          "text-rose-600": price.price_type === "sale",
          "text-grey-90": price.price_type !== "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </div>
  )
}
