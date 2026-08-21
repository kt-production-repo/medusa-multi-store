// Upstream middleware.ts has its region-redirect logic commented out, so "/"
// 404s. This overlay page restores the intended behaviour by sending visitors
// to the default-region store route.
import { redirect } from "next/navigation"

export default function RootPage() {
  const region = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
  redirect(`/${region}`)
}
