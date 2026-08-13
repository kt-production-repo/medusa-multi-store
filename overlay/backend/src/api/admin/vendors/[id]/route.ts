import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import MarketplaceModuleService from "../../../../modules/marketplace/service"

export const AdminUpdateVendorSchema = z
  .object({
    name: z.string().optional(),
    handle: z.string().optional(),
    logo: z.string().nullable().optional(),
  })
  .strict()

export type AdminUpdateVendorBody = z.infer<typeof AdminUpdateVendorSchema>

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

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
      "products.title",
      "products.thumbnail",
      "orders.id",
      "orders.items.*",
    ],
    filters: {
      id: req.params.id,
    },
  })

  if (!data.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Vendor with id ${req.params.id} not found`
    )
  }

  res.json({
    vendor: data[0],
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateVendorBody>,
  res: MedusaResponse
) => {
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(
    MARKETPLACE_MODULE
  )

  const vendor = await marketplaceService
    .updateVendors({
      id: req.params.id,
      ...req.validatedBody,
    })
    .catch(() => null)

  if (!vendor) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Vendor with id ${req.params.id} not found`
    )
  }

  res.json({
    vendor,
  })
}