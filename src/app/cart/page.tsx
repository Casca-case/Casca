"use client"

import { useEffect, useState } from "react"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const [items, setItems] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    function readItems() {
      const raw = localStorage.getItem("cart")
      if (raw) setItems(JSON.parse(raw))
    }

    readItems()

    const onCustom = () => readItems()

    window.addEventListener("cart:updated", onCustom)

    return () => {
      window.removeEventListener("cart:updated", onCustom)
    }
  }, [])

  function handleRemove(index: number) {
    const next = [...items]
    next.splice(index, 1)
    setItems(next)
    localStorage.setItem("cart", JSON.stringify(next))
    window.dispatchEvent(new Event('cart:updated'))
  }

  const totalPrice = items.length * 299

  return (
    <div className="min-h-screen py-16 bg-slate-50">
      <MaxWidthWrapper>
        <div className="flex items-center gap-4 mb-8">
          <ShoppingCart className="h-8 w-8 text-orange-600" />
          <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some custom cases to get started!</p>
            <Link href="/configure/upload">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Create Case
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                      <Image src={item.imageUrl} alt="Case" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">Custom Phone Case</h3>
                      <p className="text-gray-600 text-sm mb-3">Premium quality, custom design</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-orange-600">₹299</span>
                        <span className="text-sm text-gray-500">each</span>
                      </div>
                      <Button onClick={() => handleRemove(i)} size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                    <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-orange-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <Button onClick={() => router.push('/thank-you')} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  )
}