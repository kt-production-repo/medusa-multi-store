import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

type CartButtonProps = {
  isScrolled?: boolean
}

export default async function CartButton({ isScrolled = true }: CartButtonProps) {
  const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} isScrolled={isScrolled} />
}
