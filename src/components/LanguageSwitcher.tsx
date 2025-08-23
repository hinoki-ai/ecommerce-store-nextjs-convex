"use client"

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, Check } from "lucide-react";

export function LanguageSwitcher() {
  const { currentLanguage, supportedLanguages, setLanguage, isLoading } = useLanguage();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode !== currentLanguage && !isSwitching) {
      setIsSwitching(true);
      try {
        await setLanguage(languageCode);

        // Navigate to localized route if on a page that supports it
        const currentPath = window.location.pathname;
        const isOnLocalizedRoute = /^\/[a-z]{2}(\/|$)/.test(currentPath);

        if (isOnLocalizedRoute) {
          // Replace the current language in the URL
          const newPath = currentPath.replace(/^\/[a-z]{2}/, languageCode === 'en' ? '' : `/${languageCode}`);
          window.location.href = newPath;
        } else {
          // If not on a localized route, add language prefix for non-English languages
          const newPath = languageCode === 'en' ? currentPath : `/${languageCode}${currentPath}`;
          window.location.href = newPath;
        }
      } catch (error) {
        console.error('Error switching language:', error);
      } finally {
        setIsSwitching(false);
      }
    }
  };

  if (isLoading || isSwitching) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Languages className="h-4 w-4 animate-pulse" />
      </Button>
    );
  }

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang?.flag}</span>
          <span className="hidden md:inline">{currentLang?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel className="text-center">
          {currentLanguage === 'es' ? 'Idioma' :
           currentLanguage === 'en' ? 'Language' :
           currentLanguage === 'de' ? 'Sprache' :
           currentLanguage === 'fr' ? 'Langue' :
           currentLanguage === 'ar' ? 'اللغة' :
           currentLanguage === 'ru' ? 'Язык' : 'Language'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={isSwitching}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {language.code === currentLanguage && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}