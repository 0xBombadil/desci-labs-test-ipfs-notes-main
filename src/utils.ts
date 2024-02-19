import { Address } from "viem"

// avoiding ternary operators for classes
export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

export function prettyAddress(address: Address) {
  return address.slice(0, 6) + "..." + address.slice(-4)
}
