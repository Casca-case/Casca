"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Image from "next/image"


interface Props {
  src: string
  title?: string
  popular?: boolean
  alt?: string
}

export default function GalleryItem({ src, title, popular, alt }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  async function createConfigAndNavigate(visitPreview = false) {
    try {
      const res = await fetch("/api/gallery/create-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: src }),
      })

      if (!res.ok) throw new Error("Failed to create configuration")

      const { configId } = await res.json()

      if (!configId) throw new Error("Invalid configId returned from API")

      if (visitPreview) {
        router.push(`/configure/preview?id=${configId}`)
      } else {
        router.push(`/configure/design?id=${configId}`)
      }
    } catch (err) {
      console.error("Error in createConfigAndNavigate:", err)
      toast({ title: "Unable to create product", description: "Please try again.", variant: "destructive" })
    }
  }

  async function handleAddToCart() {
    try {
      // Create a real configuration for the gallery item
      const res = await fetch("/api/gallery/create-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: src }),
      })

      if (!res.ok) throw new Error("Failed to create configuration")

      const { configId } = await res.json()

      if (!configId) throw new Error("Invalid configId returned from API")

      // Get existing cart from localStorage
      const existing = localStorage.getItem("cart")
      const cart = existing ? JSON.parse(existing) : []

      // Add new item to cart with real configId
      cart.push({ configId, imageUrl: src, addedAt: Date.now() })

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart))

      // Dispatch event to update cart button count
      window.dispatchEvent(new Event('cart:updated'))

      // Show success message
      toast({ title: "Item added to cart", description: "The item was added to your cart." })

      // Redirect to cart page
      router.push('/cart')
    } catch (err) {
      console.error("Error in handleAddToCart:", err)
      toast({ title: "Unable to add to cart", description: "Please try again.", variant: "destructive" })
    }
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
      <div className="relative w-full h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <Image 
          src={src} 
          alt={alt ?? title ?? "product image"} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        {popular && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
            Popular
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>

      <div className="p-5">
        {title && (
          <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-orange-600">₹299</div>
          <div className="text-sm text-gray-500">Premium Quality</div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => createConfigAndNavigate(false)} 
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg transition-colors"
            size="sm"
          >
            Buy Now
          </Button>
          <Button 
            onClick={handleAddToCart} 
            variant="outline" 
            className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50 font-medium py-2 rounded-lg transition-colors"
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
