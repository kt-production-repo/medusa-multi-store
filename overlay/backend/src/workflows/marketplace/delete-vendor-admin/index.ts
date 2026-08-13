import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { 
  setAuthAppMetadataStep,
  useQueryGraphStep
} from "@medusajs/medusa/core-flows"
import deleteVendorAdminStep from "./steps/delete-vendor-admin"

export type DeleteVendorAdminWorkflow = {
  id: string
  vendor_id?: string
}

export const deleteVendorAdminWorkflow = createWorkflow(
  "delete-vendor-admin",
  (
    input: WorkflowData<DeleteVendorAdminWorkflow>
  ): WorkflowResponse<string> => {
    deleteVendorAdminStep(input)

    const { data: authIdentities } = useQueryGraphStep({
      entity: "auth_identity",
      fields: ["id"],
      filters: {
        // @ts-ignore
        app_metadata: {
          vendor_id: input.id,
        },
      },
    })

    const authIdentity = transform(
      { authIdentities },
      ({ authIdentities }) => {
        return authIdentities[0]
      }
    )

    // Admin-created vendor admins (via /admin/vendors or /admin/vendors/admins)
    // have no auth identity — only self-registered vendors do. Clearing the
    // auth metadata must not fail the delete for them.
    when(authIdentity, (identity) => !!identity).then(() => {
      setAuthAppMetadataStep({
        authIdentityId: authIdentity.id,
        actorType: "vendor",
        value: null,
      })
    })

    return new WorkflowResponse(input.id)
  }
)
