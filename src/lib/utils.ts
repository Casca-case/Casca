import { type ClassValue, clsx } from "clsx"
import { Currency } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price:number) => {
  const formatter = new Intl.NumberFormat('en-US',{
    style:'currency',
    currency:'INR'
  })

  return formatter.format(price)
}
