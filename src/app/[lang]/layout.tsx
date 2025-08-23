"use client"

import { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useLanguage } from '@/components/LanguageProvider'

interface LangLayoutProps {
  children: ReactNode
}

export default function LangLayout({ children }: LangLayoutProps) {
  const params = useParams()
  const { setLanguage } = useLanguage()
  const lang = params.lang as string

  useEffect(() => {
    if (lang) {
      setLanguage(lang)
    }
  }, [lang, setLanguage])

  return (
    <>
      {children}
    </>
  )
}