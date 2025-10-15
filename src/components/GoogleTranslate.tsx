"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'casca-translator-hidden'

const GoogleTranslate = () => {
  const [isHidden, setIsHidden] = useState(true)
  const isInitialized = useRef(false)

  const initializeTranslator = useCallback(() => {
    if (typeof window === 'undefined') return

    const container = document.getElementById('google_translate_element')
    if (!container) return

    // Reset any previous translator markup before re-initializing
    container.innerHTML = ''

    const TranslateElement = window.google?.translate?.TranslateElement

    if (typeof TranslateElement === 'function' && !isInitialized.current) {
      new TranslateElement({ pageLanguage: 'en' }, 'google_translate_element')
      isInitialized.current = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const shouldHide = window.localStorage.getItem(STORAGE_KEY) === 'true'
    setIsHidden(shouldHide)

    window.googleTranslateElementInit = () => {
      isInitialized.current = false
      initializeTranslator()
    }

    if (!shouldHide) {
      initializeTranslator()
    }

    return () => {
      delete (window as any).googleTranslateElementInit
    }
  }, [initializeTranslator])

  useEffect(() => {
    if (!isHidden) {
      isInitialized.current = false
      initializeTranslator()
    }
  }, [isHidden, initializeTranslator])

  const handleHide = () => {
    setIsHidden(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true')
    }
  }

  const handleShow = () => {
    setIsHidden(false)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <div className='fixed bottom-4 left-4 z-[1000]'>
      {isHidden ? (
        <Button size='sm' variant='secondary' onClick={handleShow}>
          Show translator
        </Button>
      ) : (
        <div className='relative rounded-md bg-white shadow-lg ring-1 ring-zinc-200'>
          <button
            type='button'
            onClick={handleHide}
            className='absolute right-1 top-1 rounded-full px-2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-800'
            aria-label='Hide translator'
          >
            ×
          </button>
          <div id='google_translate_element' className='p-2' />
        </div>
      )}
    </div>
  )
}

export default GoogleTranslate
