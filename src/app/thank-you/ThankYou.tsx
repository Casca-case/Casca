"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import Phone from '@/components/Phone'
import { ArrowRight, Check, Shield, Truck, CreditCard, Star } from 'lucide-react'
import { createCartCheckoutSession } from './actions'
import { useMutation } from '@tanstack/react-query'

const ThankYou = () => {
    const router = useRouter()
    const [items, setItems] = useState<any[]>([])

    useEffect(() => {
        const raw = localStorage.getItem('cart')
        if (raw) {
            setItems(JSON.parse(raw))
        } else {
            router.push('/cart')
        }
    }, [router])

    const totalPrice = items.length * 299
    const tax = Math.round(totalPrice * 0.18)
    const finalTotal = totalPrice + tax

    const { mutate: createPaymentSession, isPending } = useMutation({
        mutationKey: ['get-cart-checkout-session'],
        mutationFn: createCartCheckoutSession,
        onSuccess: ({ url }) => {
            console.log('Payment session created:', url)
            if (url) {
                window.location.href = url
            } else {
                alert('Unable to retrieve payment URL.')
            }
        },
        onError: (error) => {
            console.error('Payment error:', error)
            alert(`Payment failed: ${error.message}`)
        },
    })

    const handleCompletePayment = () => {
        console.log('Starting payment with items:', items)
        if (items.length === 0) {
            alert('No items in cart')
            return
        }
        createPaymentSession({ cartItems: items })
    }

    if (items.length === 0) {
        return (
            <div className='min-h-screen py-16 bg-gradient-to-br from-orange-50 via-white to-slate-50'>
                <MaxWidthWrapper>
                    <div className='text-center py-20'>
                        <div className='w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <ArrowRight className='w-12 h-12 text-orange-600' />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900 mb-4'>No items to checkout</h1>
                        <p className='text-gray-600 mb-8'>Your cart is empty. Add some items to continue.</p>
                        <Button onClick={() => router.push('/cart')} className='bg-orange-600 hover:bg-orange-700 px-8 py-3'>
                            Return to Cart
                        </Button>
                    </div>
                </MaxWidthWrapper>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50'>
            <div className='bg-white border-b border-gray-100'>
                <MaxWidthWrapper>
                    <div className='py-8'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h1 className='text-4xl font-bold text-gray-900 mb-2'>Order Summary</h1>
                                <p className='text-gray-600'>Review your custom phone cases before completing payment</p>
                            </div>
                            <div className='hidden md:flex items-center gap-6 text-sm text-gray-600'>
                                <div className='flex items-center gap-2'>
                                    <Shield className='w-4 h-4 text-green-500' />
                                    <span>Secure Checkout</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Truck className='w-4 h-4 text-blue-500' />
                                    <span>Free Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </div>

            <MaxWidthWrapper>
                <div className='py-12'>
                    <div className='grid grid-cols-1 xl:grid-cols-3 gap-12'>
                        <div className='xl:col-span-2 space-y-8'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4'>
                                    <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                                        <Star className='w-5 h-5' />
                                        Your Custom Cases ({items.length})
                                    </h2>
                                </div>
                                <div className='p-6 space-y-6'>
                                    {items.map((item, i) => (
                                        <div key={i} className='group hover:bg-gray-50 p-4 rounded-xl transition-all duration-200'>
                                            <div className='flex items-center gap-8'>
                                                <div className='relative'>
                                                    <div className='w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 shadow-inner'>
                                                        <Phone className='w-full h-full' imgSrc={item.imageUrl} />
                                                    </div>
                                                    <div className='absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                                                        #{i + 1}
                                                    </div>
                                                </div>
                                                <div className='flex-1 space-y-3'>
                                                    <div>
                                                        <h3 className='text-xl font-bold text-gray-900'>Custom Phone Case</h3>
                                                        <p className='text-gray-600'>Premium quality • Custom design • Durable material</p>
                                                    </div>
                                                    <div className='flex items-center gap-3'>
                                                        <div className='flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full'>
                                                            <Check className='w-4 h-4 text-green-600' />
                                                            <span className='text-sm font-medium text-green-700'>In Stock</span>
                                                        </div>
                                                        <div className='flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full'>
                                                            <Truck className='w-4 h-4 text-blue-600' />
                                                            <span className='text-sm font-medium text-blue-700'>Ready to Ship</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-baseline gap-2'>
                                                        <span className='text-3xl font-bold text-orange-600'>₹299</span>
                                                        <span className='text-gray-500 line-through'>₹399</span>
                                                        <span className='bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded'>25% OFF</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200'>
                                <h3 className='font-bold text-gray-900 mb-3 flex items-center gap-2'>
                                    <Shield className='w-5 h-5 text-orange-600' />
                                    Why Choose Casca?
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                                    <div className='flex items-center gap-2'>
                                        <Check className='w-4 h-4 text-green-600' />
                                        <span>5-year print warranty</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check className='w-4 h-4 text-green-600' />
                                        <span>Wireless charging compatible</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check className='w-4 h-4 text-green-600' />
                                        <span>Scratch resistant coating</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='xl:col-span-1'>
                            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-8'>
                                <div className='bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4'>
                                    <h3 className='text-xl font-semibold text-white flex items-center gap-2'>
                                        <CreditCard className='w-5 h-5' />
                                        Payment Summary
                                    </h3>
                                </div>
                                <div className='p-6 space-y-4'>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between items-center py-2'>
                                            <span className='text-gray-600'>Subtotal ({items.length} items)</span>
                                            <span className='font-semibold'>₹{totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className='flex justify-between items-center py-2'>
                                            <span className='text-gray-600 flex items-center gap-2'>
                                                <Truck className='w-4 h-4' />
                                                Shipping
                                            </span>
                                            <span className='font-semibold text-green-600'>Free</span>
                                        </div>
                                        <div className='flex justify-between items-center py-2'>
                                            <span className='text-gray-600'>Tax (18%)</span>
                                            <span className='font-semibold'>₹{tax.toLocaleString()}</span>
                                        </div>
                                        <div className='border-t border-gray-200 pt-3'>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-lg font-bold text-gray-900'>Total</span>
                                                <span className='text-2xl font-bold text-orange-600'>₹{finalTotal.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className='pt-4'>
                                        <Button 
                                            onClick={handleCompletePayment}
                            disabled={isPending}
                                            className='w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
                                            size='lg'
                                        >
                                            <CreditCard className='w-5 h-5 mr-2' />
                                            Complete Payment
                                            <ArrowRight className='w-5 h-5 ml-2' />
                                        </Button>
                                        
                                        <div className='flex items-center justify-center gap-2 mt-4 text-xs text-gray-500'>
                                            <Shield className='w-4 h-4' />
                                            <span>Secure payment powered by Stripe</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    )
}

export default ThankYou