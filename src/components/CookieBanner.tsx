'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const COOKIE_STORAGE_KEY = 'casca-cookie-consent'

const CookieBanner = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasConsent =
      typeof window !== 'undefined' &&
      (window.localStorage.getItem(COOKIE_STORAGE_KEY) ||
        document.cookie.includes(`${COOKIE_STORAGE_KEY}=true`))

    if (!hasConsent) {
      setIsOpen(true)
    }
  }, [])

  const handleAccept = () => {
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    document.cookie = `${COOKIE_STORAGE_KEY}=true; expires=${oneYearFromNow.toUTCString()}; path=/`
    window.localStorage.setItem(COOKIE_STORAGE_KEY, 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-x-0 bottom-4 z-[100] px-4 sm:px-6'>
      <div className='mx-auto max-w-3xl rounded-xl border border-zinc-200 bg-white/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/75 sm:p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-sm text-zinc-700'>
            We use cookies to personalize content, improve your experience, and
            analyze our traffic. By clicking Accept, you agree to our use of
            cookies.
          </div>
          <div className='flex shrink-0 justify-end gap-2'>
            <Button size='sm' onClick={handleAccept}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
