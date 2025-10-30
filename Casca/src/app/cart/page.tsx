"use client"

import { useEffect, useState } from "react"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import LoginModal from "@/components/LoginModal"
import { ShoppingCart, Trash2, Edit, Eye } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"

export default function Page() {
  const [items, setItems] = useState<any[]>([])
  const router = useRouter()
  const { user } = useKindeBrowserClient()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
  // const { toast } = useToast()

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

  const totalPrice = items.length * 299 // Assuming ₹299 per case

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
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
            <Button onClick={() => router.push('/gallery')} className="bg-orange-600 hover:bg-orange-700">
              Browse Gallery
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((it, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                      <Image src={it.imageUrl} alt="img" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">Custom Phone Case</h3>
                      <p className="text-gray-600 text-sm mb-3">Premium quality, custom design</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-orange-600">₹299</span>
                        <span className="text-sm text-gray-500">each</span>
                      </div>
                      <div className="flex gap-2">
                        {!it.configId || it.configId.startsWith('temp-') ? (
                          <Button onClick={() => router.push(`/configure/upload?imageUrl=${encodeURIComponent(it.imageUrl)}`)} size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <Edit className="h-4 w-4 mr-2" />
                            Customize
                          </Button>
                        ) : (
                          <>
                            <Button onClick={() => router.push(`/configure/preview?id=${it.configId}`)} size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                            <Button onClick={() => router.push(`/configure/design?id=${it.configId}`)} size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </>
                        )}
                        <Button onClick={() => handleRemove(i)} size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
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
                    <span className="text-gray-600">Subtotal (₹299 × {items.length} item{items.length > 1 ? 's' : ''})</span>
                    <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-orange-600">₹{Math.round(totalPrice * 1.18).toLocaleString()}</span>
                  </div>
                </div>
                <Button onClick={() => {
                  if (user) {
                    if (items.length === 0) return
                    // Navigate to a multi-item checkout page
                    router.push('/thank-you')
                  } else {
                    setIsLoginModalOpen(true)
                  }
                }} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold" size="lg">
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  )
}
