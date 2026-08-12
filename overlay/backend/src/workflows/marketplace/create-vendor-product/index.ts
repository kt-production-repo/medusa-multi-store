import { CreateProductWorkflowInputDTO } from "@medusajs/framework/types"
import { 
  createWorkflow, 
  transform, 
  WorkflowResponse
} from "@medusajs/framework/workflows-sdk"
import { 
  createInventoryLevelsWorkflow,
  createProductsWorkflow, 
  CreateProductsWorkflowInput, 
  createRemoteLinkStep, 
  useQueryGraphStep
} from "@medusajs/medusa/core-flows"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"
import { Modules } from "@medusajs/framework/utils"

type WorkflowInput = {
  vendor_admin_id: string
  product: CreateProductWorkflowInputDTO
}

const createVendorProductWorkflow = createWorkflow(
  "create-vendor-product",
  (input: WorkflowInput) => {
    // Retrieve default sales channel (product availability) and default stock
    // location (vendor variants need inventory levels there, or the sales
    // channel has no stock location for the variant and checkout fails).
    // Alternatively, you can link sales channels to vendors and allow vendors
    // to manage sales channels
    const { data: stores } = useQueryGraphStep({
      entity: "store",
      fields: ["default_sales_channel_id", "default_location_id"],
    })

    // Vendor products need the default shipping profile assigned explicitly,
    // exactly like the seed does — otherwise cart completion rejects their
    // line items for not matching the shipping method's profile.
    const { data: shippingProfiles } = useQueryGraphStep({
      entity: "shipping_profile",
      fields: ["id"],
      filters: {
        type: "default"
      }
    }).config({ name: "retrieve-default-shipping-profile" })

    const productData = transform({
      input,
      stores,
      shippingProfiles
    }, (data) => {
      return {
        products: [{
          ...data.input.product,
          sales_channels: [
            {
              id: data.stores[0].default_sales_channel_id
            }
          ],
          shipping_profile_id: data.shippingProfiles[0].id
        }]
      }
    })

    const createdProducts = createProductsWorkflow.runAsStep({
      input: productData as CreateProductsWorkflowInput
    })
    
    const { data: vendorAdmins } = useQueryGraphStep({
      entity: "vendor_admin",
      fields: ["vendor.id"],
      filters: {
        id: input.vendor_admin_id
      }
    }).config({ name: "retrieve-vendor-admins" })

    const linksToCreate = transform({
      input,
      createdProducts,
      vendorAdmins
    }, (data) => {
      return data.createdProducts.map((product) => {
        return {
          [MARKETPLACE_MODULE]: {
            vendor_id: data.vendorAdmins[0].vendor.id
          },
          [Modules.PRODUCT]: {
            product_id: product.id
          }
        }
      })
    })

    createRemoteLinkStep(linksToCreate)

    const { data: productVariants } = useQueryGraphStep({
      entity: "product",
      fields: ["variants.inventory_items.inventory_item_id"],
      filters: {
        id: createdProducts[0].id
      }
    }).config({ name: "retrieve-variant-inventory-items" })

    // Seed products are purchasable because the seed creates inventory levels
    // at the store's default stock location. Vendor variants get inventory
    // items but zero inventory levels, so the sales channel has no stock
    // location for them and adding to cart fails. Create one level per variant
    // here, honoring an optional per-variant stocked_quantity from the request.
    const inventoryLevelsInput = transform({
      stores,
      productVariants,
      input
    }, (data) => {
      const requestVariants = data.input.product.variants ?? []
      return {
        inventory_levels: data.productVariants[0].variants.map((variant, index) => ({
          inventory_item_id: variant.inventory_items![0]!.inventory_item_id,
          location_id: data.stores[0].default_location_id!,
          stocked_quantity:
            (requestVariants[index] as { stocked_quantity?: number } | undefined)
              ?.stocked_quantity ?? 100
        }))
      }
    })

    createInventoryLevelsWorkflow.runAsStep({
      input: inventoryLevelsInput
    })

    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: ["*", "variants.*"],
      filters: {
        id: createdProducts[0].id
      }
    }).config({ name: "retrieve-products" })

    return new WorkflowResponse({
      product: products[0]
    })
  }
)

export default createVendorProductWorkflow