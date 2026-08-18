import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { retrieveCart } from "@lib/data/cart"
import { StoreRegion } from "@medusajs/types"
import NavUI from "./nav-ui"

export default async function Nav() {
  const [regions, locales, currentLocale, cart] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    retrieveCart().catch(() => null),
  ])

  return (
    <NavUI
      regions={regions}
      locales={locales}
      currentLocale={currentLocale}
      cart={cart}
    />
  )
}
