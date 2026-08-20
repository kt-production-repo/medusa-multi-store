"use server"

import { getCacheTag, setAuthToken } from "./cookies"
import { transferCart } from "./customer"
import { revalidateTag } from "next/cache"
import { sdk } from "@lib/config"

export async function signup(userData: {
  email: string
  password: string
  first_name?: string
  last_name?: string
}) {
  try {
    const { token, customer } = await sdk.client.fetch<{
      token: string
      customer: any
    }>("/store/auth/register", {
      method: "POST",
      body: userData,
    })

    console.log("signup data", { token, customer })
  } catch (error) {
    return String(error)
  }
}

// client mutation handler, e.g. the Plasmic LoginForm's onLogin callback.
export async function loginWithCredentials(credentials: {
  email: string
  password: string
}) {
  try {
    const { token } = await sdk.client.fetch<{ token: string }>(
      "/store/auth/login",
      {
        method: "POST",
        body: credentials,
      }
    )

    await setAuthToken(token)
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
  } catch (error) {
    return String(error)
  }

  try {
    await transferCart()
  } catch (error) {
    return String(error)
  }
}
