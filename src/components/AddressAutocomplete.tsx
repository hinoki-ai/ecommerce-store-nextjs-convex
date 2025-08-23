"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface AddressSuggestion {
  id: string
  description: string
  address: Address
}

interface AddressAutocompleteProps {
  value: Partial<Address>
  onChange: (address: Partial<Address>) => void
  onValidationChange?: (isValid: boolean) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export function AddressAutocomplete({
  value,
  onChange,
  onValidationChange,
  placeholder = "Start typing your address...",
  required = false,
  className = ""
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isValidAddress, setIsValidAddress] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Initialize input value from props
  useEffect(() => {
    if (value.street && !inputValue) {
      const fullAddress = [
        value.street,
        value.city,
        value.state,
        value.zipCode
      ].filter(Boolean).join(", ")
      setInputValue(fullAddress)
    }
  }, [value, inputValue])

  // Validation effect
  useEffect(() => {
    const valid = !!(value.street && value.city && value.state && value.zipCode)
    setIsValidAddress(valid)
    onValidationChange?.(valid)
  }, [value, onValidationChange])

  const fetchAddressSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    
    try {
      // In a real implementation, you would use Google Places API, Mapbox, or similar
      // For demo purposes, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay
      
      const mockSuggestions: AddressSuggestion[] = [
        {
          id: '1',
          description: `${query} Main St, Anytown, NY 12345`,
          address: {
            street: `${query} Main St`,
            city: 'Anytown',
            state: 'NY',
            zipCode: '12345',
            country: 'US'
          }
        },
        {
          id: '2',
          description: `${query} Oak Ave, Springfield, CA 90210`,
          address: {
            street: `${query} Oak Ave`,
            city: 'Springfield',
            state: 'CA',
            zipCode: '90210',
            country: 'US'
          }
        },
        {
          id: '3',
          description: `${query} Pine Dr, Madison, WI 53703`,
          address: {
            street: `${query} Pine Dr`,
            city: 'Madison',
            state: 'WI',
            zipCode: '53703',
            country: 'US'
          }
        }
      ]
      
      setSuggestions(mockSuggestions)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Failed to fetch address suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // Clear existing address when user types
    if (newValue !== inputValue) {
      onChange({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      })
    }

    // Debounce API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchAddressSuggestions(newValue)
    }, 300)
  }

  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.description)
    onChange(suggestion.address)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    
    // Track address selection
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'address_autocomplete', {
        event_category: 'checkout',
        method: 'suggestion_select'
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 200)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="address-autocomplete">
          Street Address {required && <span className="text-destructive">*</span>}
        </Label>
        
        <div className="relative">
          <Input
            ref={inputRef}
            id="address-autocomplete"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            placeholder={placeholder}
            className={`pr-10 ${isValidAddress ? 'border-green-500' : ''}`}
            required={required}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : isValidAddress ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <MapPin className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Address Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1"
          >
            <Card>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={suggestion.id}
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto p-3 ${
                        index === selectedIndex ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-foreground">
                            {suggestion.address.street}
                          </div>
                          <div className="text-muted-foreground">
                            {suggestion.address.city}, {suggestion.address.state} {suggestion.address.zipCode}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Address Fields - Show when address is selected */}
      {value.street && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={value.city || ''}
                onChange={(e) => onChange({ ...value, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={value.state || ''}
                onChange={(e) => onChange({ ...value, state: e.target.value })}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={value.zipCode || ''}
                onChange={(e) => onChange({ ...value, zipCode: e.target.value })}
                placeholder="ZIP Code"
              />
            </div>
          </div>

          {/* Address Validation Status */}
          {isValidAddress && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-green-600"
            >
              <Check className="h-4 w-4" />
              <span>Address validated</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}