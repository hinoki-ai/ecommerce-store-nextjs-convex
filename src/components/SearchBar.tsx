"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Clock, TrendingUp, Package } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"

interface SearchResult {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  images: Array<{ url: string; alt: string }>
  categoryName?: string
  type: 'product' | 'category'
}

interface SearchBarProps {
  placeholder?: string
  className?: string
  showSuggestions?: boolean
}

export function SearchBar({
  placeholder,
  className = "",
  showSuggestions = true
}: SearchBarProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Use translation for placeholder if not provided
  const searchPlaceholder = placeholder || t('forms.placeholder.search');

  // Fetch search suggestions
  const suggestions = useQuery(api.search.getSearchSuggestions, {
    query: query.trim(),
    limit: 6
  }) || []

  // Popular searches (static for now)
  const popularSearches = [
    "arroz",
    "aceite",
    "azúcar",
    "café",
    "harina",
    "lácteos",
    "verduras",
    "frutas"
  ]

  // Recent searches (could be stored in localStorage)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  const saveRecentSearch = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery("")
    }
  }

  const handleSelectSuggestion = (suggestion: SearchResult) => {
    saveRecentSearch(suggestion.name)
    if (suggestion.type === 'product') {
      router.push(`/products/${suggestion.slug}`)
    } else {
      router.push(`/categories/${suggestion.slug}`)
    }
    setIsOpen(false)
    setQuery("")
  }

  const handlePopularSearch = (term: string) => {
    setQuery(term)
    saveRecentSearch(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
    setIsOpen(false)
  }

  const clearRecentSearch = (term: string) => {
    const updated = recentSearches.filter(s => s !== term)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearAllRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < suggestions.length + recentSearches.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0) {
            if (selectedIndex < recentSearches.length) {
              handlePopularSearch(recentSearches[selectedIndex])
            } else {
              const suggestionIndex = selectedIndex - recentSearches.length
              if (suggestions[suggestionIndex]) {
                handleSelectSuggestion(suggestions[suggestionIndex])
              }
            }
          } else {
            handleSubmit(e as any)
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, suggestions, recentSearches])

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={searchPlaceholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setQuery("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && showSuggestions && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            <div className="p-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Búsquedas recientes
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Limpiar
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, index) => (
                      <div
                        key={term}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                          selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handlePopularSearch(term)}
                      >
                        <span className="text-sm">{term}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            clearRecentSearch(term)
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Sugerencias</h4>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion._id}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${
                          selectedIndex === recentSearches.length + index ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            {suggestion.images?.[0] ? (
                              <img
                                src={suggestion.images[0].url}
                                alt={suggestion.images[0].alt}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {suggestion.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {suggestion.categoryName || suggestion.type}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            ${suggestion.price?.toFixed(2) || 'N/A'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {query.trim() === "" && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Búsquedas populares
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {popularSearches.map((term) => (
                      <Badge
                        key={term}
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100"
                        onClick={() => handlePopularSearch(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}