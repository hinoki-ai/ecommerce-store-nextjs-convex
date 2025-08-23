"use client"

import { useLanguage } from './LanguageProvider';
import { useEffect } from 'react';

export function LanguageAttributes() {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Update document language and direction
    document.documentElement.lang = currentLanguage;

    // Set direction for RTL languages
    const isRTL = currentLanguage === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    // Add RTL class for styling
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [currentLanguage]);

  return null; // This component doesn't render anything
}