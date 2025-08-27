'use client';

import React, { useState, useEffect } from 'react';
import { useLanguageSwitcher, useCommonUITranslations } from '@/lib/hooks/i18n-hooks';
import { useBrowserLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe, Check, ArrowRightLeft, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'flag-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCurrentLanguage?: boolean;
  showFlags?: boolean;
  showNames?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'default',
  size = 'md',
  className,
  showCurrentLanguage = true,
  showFlags = true,
  showNames = true
}) => {
  const { currentLanguage, supportedLanguages, setLanguage, isLoading } = useLanguageSwitcher();
  const common = useCommonUITranslations();
  const { browserLanguage, confidence, regionInfo } = useBrowserLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Translation helper function
  const t = (key: string, fallback?: string) => {
    // Use the common translations first, then fallback to key
    const commonKeys: Record<string, string> = {
      currentLanguage: 'Current Language',
      availableLanguages: 'Available Languages',
      browserDefault: 'Browser',
      browserSuggestion: 'Suggested for you',
      region: 'Region'
    };
    return commonKeys[key] || fallback || key;
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await setLanguage(languageCode);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const currentLangData = supportedLanguages.find(lang => lang.code === currentLanguage);

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  const getFlagEmoji = (flag: string) => {
    // Convert flag emoji to a more consistent format if needed
    return flag;
  };

  const renderLanguageOption = (lang: typeof supportedLanguages[0]) => (
    <DropdownMenuItem
      key={lang.code}
      onClick={() => handleLanguageChange(lang.code)}
      className={cn(
        'flex items-center gap-2 cursor-pointer',
        currentLanguage === lang.code && 'bg-accent'
      )}
    >
      {showFlags && <span className="text-base">{getFlagEmoji(lang.flag)}</span>}
      {showNames && <span>{lang.name}</span>}
      {currentLanguage === lang.code && <Check className="ml-auto h-4 w-4" />}
    </DropdownMenuItem>
  );

  if (variant === 'minimal') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn('flex items-center gap-1', className)}
            disabled={isLoading}
          >
            {currentLangData && showFlags && (
              <span className="text-base">{getFlagEmoji(currentLangData.flag)}</span>
            )}
            {showCurrentLanguage && currentLangData && showNames && (
              <span className="text-xs font-medium">{currentLangData.code.toUpperCase()}</span>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {supportedLanguages.map(renderLanguageOption)}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'flag-only') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn('p-1', className)}
            disabled={isLoading}
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>{common.select} {common.language?.toLowerCase()}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {supportedLanguages.map(renderLanguageOption)}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'flex items-center gap-2',
            sizeClasses[size],
            className
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          ) : (
            <>
              {currentLangData && showFlags && (
                <span className="text-base">{getFlagEmoji(currentLangData.flag)}</span>
              )}
              {showCurrentLanguage && currentLangData && showNames && (
                <span className="font-medium">{currentLangData.name}</span>
              )}
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {common.language || 'Language'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Current language section */}
        <div className="px-2 py-1.5">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {t('common.currentLanguage', 'Current Language')}:
          </div>
          {supportedLanguages
            .filter(lang => lang.code === currentLanguage)
            .map(lang => (
              <div key={lang.code} className="flex items-center justify-between p-2 bg-accent/50 rounded">
                <span className="flex items-center gap-2">
                  {showFlags && <span className="text-base">{getFlagEmoji(lang.flag)}</span>}
                  {showNames && <span className="font-medium">{lang.name}</span>}
                </span>
                <Check className="h-4 w-4 text-primary" />
              </div>
            ))}
        </div>

        <DropdownMenuSeparator />

        {/* Available languages */}
        <div className="px-2 py-1.5">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {t('common.availableLanguages', 'Available Languages')}:
          </div>
          <div className="space-y-1">
            {supportedLanguages
              .filter(lang => lang.code !== currentLanguage)
              .map(lang => (
                <div
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    'flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent',
                    'transition-colors duration-150'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {showFlags && <span className="text-base">{getFlagEmoji(lang.flag)}</span>}
                    {showNames && <span>{lang.name}</span>}
                  </span>
                  {browserLanguage === lang.code && confidence > 0.5 && (
                    <span className="ml-2 text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {t('common.browserDefault', 'Browser')}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Browser language suggestion */}
        {browserLanguage && browserLanguage !== currentLanguage && confidence > 0.6 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <ArrowRightLeft className="h-3 w-3" />
                {t('common.browserSuggestion', 'Suggested for you')}:
              </div>
              <div
                onClick={() => handleLanguageChange(browserLanguage)}
                className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent/80 bg-accent/30 border border-dashed"
              >
                <span className="flex items-center gap-2">
                  {(() => {
                    const browserLangData = supportedLanguages.find(l => l.code === browserLanguage);
                    return (
                      <>
                        {showFlags && browserLangData && <span className="text-base">{getFlagEmoji(browserLangData.flag)}</span>}
                        {showNames && browserLangData && <span className="font-medium">{browserLangData.name}</span>}
                      </>
                    );
                  })()}
                </span>
                <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            </div>
          </>
        )}

        {/* Region info for Spanish */}
        {currentLanguage === 'es' && regionInfo.region && regionInfo.isSpanishSpeaking && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {t('common.region', 'Region')}: {regionInfo.region.toUpperCase()}
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Enhanced Language Switcher with Search
export const LanguageSwitcherWithSearch: React.FC<LanguageSwitcherProps> = (props) => {
  const { supportedLanguages, setLanguage, isLoading } = useLanguageSwitcher();
  const common = useCommonUITranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredLanguages = supportedLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await setLanguage(languageCode);
      setIsOpen(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('flex items-center gap-2', props.className)}
          disabled={isLoading}
        >
          <Globe className="h-4 w-4" />
          {common.language || 'Language'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <input
            type="text"
            placeholder={`${common.search || 'Search'} ${common.language?.toLowerCase() || 'language'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-48 overflow-y-auto">
          {filteredLanguages.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">
              {common.noResults || 'No languages found'}
            </div>
          ) : (
            filteredLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {lang.code.toUpperCase()}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Compact Language Switcher for Mobile
export const MobileLanguageSwitcher: React.FC<Omit<LanguageSwitcherProps, 'variant'>> = (props) => {
  const { currentLanguage, supportedLanguages, setLanguage, isLoading } = useLanguageSwitcher();
  const common = useCommonUITranslations();

  const currentLangData = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className={cn('flex flex-col gap-2', props.className)}>
      <label className="text-sm font-medium">
        {common.language || 'Language'}
      </label>
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value)}
        disabled={isLoading}
        className={cn(
          'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name} ({lang.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
};

// Hook for easy language switcher integration
export const useLanguageSwitcherIntegration = () => {
  const { currentLanguage, supportedLanguages, setLanguage, isLoading } = useLanguageSwitcher();
  const common = useCommonUITranslations();

  return {
    currentLanguage,
    supportedLanguages,
    setLanguage,
    isLoading,
    common,
    // Helper functions
    getCurrentLanguageData: () => supportedLanguages.find(lang => lang.code === currentLanguage),
    isRTL: () => {
      const current = supportedLanguages.find(lang => lang.code === currentLanguage);
      return current?.direction === 'rtl';
    },
    getLanguageByCode: (code: string) => supportedLanguages.find(lang => lang.code === code),
    getLanguageByName: (name: string) => supportedLanguages.find(lang => lang.name === name)
  };
};

export default LanguageSwitcher;