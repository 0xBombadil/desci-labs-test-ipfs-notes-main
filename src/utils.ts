// avoiding ternary operators for classes
export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}
