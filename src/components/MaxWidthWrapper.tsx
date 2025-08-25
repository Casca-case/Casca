import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

export default function MaxWidthWrapper({className, children} : {
  className?:string,
  children: ReactNode
}) {
  return (
    <div className={cn("h-full max-w-screen-xl mx-auto px-4 md:px-20",className)} >{children}</div>
  )
}
