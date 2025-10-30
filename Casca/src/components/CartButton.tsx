"use client"

import React, { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"

export default function CartButton() {
  const [count, setCount] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    function readCount() {
      try {
        const raw = localStorage.getItem("cart")
        const items = raw ? JSON.parse(raw) : []
        setCount(Array.isArray(items) ? items.length : 0)
      } catch (e) {
        setCount(0)
      }
    }

    readCount()

    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") readCount()
    }

    const onCustom = () => readCount()

    window.addEventListener("storage", onStorage)
    window.addEventListener("cart:updated", onCustom)

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("cart:updated", onCustom)
    }
  }, [])

  return (
    <button
      onClick={() => router.push("/cart")}
      className={buttonVariants({ size: "sm", variant: "ghost" }) + " relative"}
      aria-label="View cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 ? (
        <span className="absolute -top-1 -right-2 inline-flex items-center justify-center rounded-full bg-orange-600 text-white text-xs w-5 h-5">
          {count}
        </span>
      ) : null}
    </button>
  )
}
