import {
  defineMiddlewares,
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { AdminCreateProduct } from "@medusajs/medusa/api/admin/products/validators"
import { PostVendorCreateSchema } from "./vendors/route"
import { PostStoreProductSearchSchema } from "./store/products/search/route"
import {
  AdminCreateVendorSchema,
} from "./admin/vendors/route"
import {
  AdminAddVendorAdminSchema,
} from "./admin/vendors/admins/route"
import {
  AdminUpdateVendorSchema,
} from "./admin/vendors/[id]/route"

const AdminVendorsParams = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  q: z.string().optional(),
})

const AdminVendorAdminsParams = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  q: z.string().optional(),
})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/vendors",
      method: ["POST"],
      middlewares: [
        authenticate("vendor", ["session", "bearer"], {
          allowUnregistered: true,
        }),
        validateAndTransformBody(PostVendorCreateSchema),
      ],
    },
    {
      matcher: "/vendors/*",
      middlewares: [
        authenticate("vendor", ["session", "bearer"]),
      ]
    },
    {
      matcher: "/vendors/products",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(AdminCreateProduct),
      ]
    },
    {
      matcher: "/store/products/search",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostStoreProductSearchSchema),
      ]
    },
    {
      matcher: "/admin/vendors",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(AdminVendorsParams, {
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/vendors/admins",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(AdminVendorAdminsParams, {
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/vendors",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(AdminCreateVendorSchema),
      ],
    },
    {
      matcher: "/admin/vendors/admins",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(AdminAddVendorAdminSchema),
      ],
    },
    {
      matcher: "/admin/vendors/:id",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(AdminUpdateVendorSchema),
      ],
    },
  ],
})
