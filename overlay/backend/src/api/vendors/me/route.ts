import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import updateVendorWorkflow from "../../../workflows/marketplace/update-vendor"

export const PostVendorMeUpdateSchema = z.strictObject({
  name: z.string().optional(),
  handle: z.string().optional(),
  logo: z.string().nullable().optional(),
})

type RequestBody = z.infer<typeof PostVendorMeUpdateSchema>

const getCallerVendor = async (req: AuthenticatedMedusaRequest) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [vendorAdmin] } = await query.graph({
    entity: "vendor_admin",
    fields: ["vendor_id"],
    filters: {
      id: [req.auth_context.actor_id],
    },
  })

  return vendorAdmin?.vendor_id
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const vendorId = await getCallerVendor(req)

  const { data } = await query.graph({
    entity: "vendor",
    fields: [
      "id",
      "name",
      "handle",
      "logo",
      "created_at",
      "updated_at",
      "admins.*",
      "products.id",
      "orders.id",
    ],
    filters: {
      id: vendorId,
    },
  })

  const [vendor] = data

  res.json({
    vendor: {
      ...vendor,
      stats: {
        product_count: vendor.products?.length ?? 0,
        order_count: vendor.orders?.length ?? 0,
      },
    },
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  const vendorId = await getCallerVendor(req)

  const { result } = await updateVendorWorkflow(req.scope).run({
    input: {
      id: vendorId,
      ...req.validatedBody,
    },
  })

  res.json({
    vendor: result.vendor,
  })
}