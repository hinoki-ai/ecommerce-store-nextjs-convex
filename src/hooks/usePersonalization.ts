'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { PersonalizationService, UserBehaviorEvent, PersonalizationRecommendations, PersonalizationProfile } from '@/domain/services/personalization-service';

interface UsePersonalizationReturn {
  // State
  profile: PersonalizationProfile | null;
  recommendations: PersonalizationRecommendations | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  trackEvent: (event: Omit<UserBehaviorEvent, 'userId' | 'sessionId' | 'timestamp'>) => Promise<void>;
  refreshRecommendations: () => Promise<void>;
  updatePreferences: (preferences: Partial<PersonalizationProfile['preferences']>) => Promise<void>;
  
  // Utilities
  getSessionId: () => string;
  isPersonalized: boolean;
  confidenceLevel: 'low' | 'medium' | 'high';
}

// Session ID management
let sessionId: string | null = null;

function generateSessionId(): string {
  if (typeof window !== 'undefined') {
    // Check if session ID exists in sessionStorage
    const existingSessionId = sessionStorage.getItem('aramac-session-id');
    if (existingSessionId) {
      return existingSessionId;
    }
  }
  
  // Generate new session ID
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('aramac-session-id', newSessionId);
  }
  
  return newSessionId;
}

export function usePersonalization(): UsePersonalizationReturn {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizationRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get or generate session ID
  const getSessionId = useCallback(() => {
    if (!sessionId) {
      sessionId = generateSessionId();
    }
    return sessionId;
  }, []);

  // Initialize personalization on component mount
  useEffect(() => {
    if (isLoaded) {
      initializePersonalization();
    }
  }, [isLoaded, user?.id]);

  // Track page view on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackEvent({
        eventType: 'page_view',
        metadata: {
          path: window.location.pathname,
          referrer: document.referrer,
          timestamp: Date.now()
        }
      });
    }
  }, []);

  const initializePersonalization = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentSessionId = getSessionId();
      
      // Load existing profile
      const existingProfile = await loadPersonalizationProfile(user?.id, currentSessionId);
      setProfile(existingProfile);
      
      // Generate recommendations if we have a profile
      if (existingProfile) {
        const recs = await PersonalizationService.generatePersonalizedRecommendations(
          existingProfile,
          {
            currentPage: typeof window !== 'undefined' ? window.location.pathname : undefined,
            timeOfDay: getTimeOfDay(),
            dayOfWeek: getDayOfWeek(),
            season: getCurrentSeason()
          }
        );
        setRecommendations(recs);
      }
    } catch (err) {
      console.error('Personalization initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize personalization');
    } finally {
      setIsLoading(false);
    }
  };

  const trackEvent = useCallback(async (
    event: Omit<UserBehaviorEvent, 'userId' | 'sessionId' | 'timestamp'>
  ) => {
    try {
      const fullEvent: UserBehaviorEvent = {
        ...event,
        userId: user?.id,
        sessionId: getSessionId(),
        timestamp: Date.now(),
        deviceInfo: getDeviceInfo(),
        location: await getLocationInfo()
      };

      // Track the event
      await PersonalizationService.trackBehaviorEvent(fullEvent);
      
      // Update profile for high-impact events
      const highImpactEvents = ['purchase', 'add_to_cart', 'wishlist_add'];
      if (highImpactEvents.includes(event.eventType)) {
        await refreshProfile();
      }
    } catch (err) {
      console.error('Event tracking failed:', err);
      // Don't throw error to avoid disrupting user experience
    }
  }, [user?.id, getSessionId]);

  const refreshRecommendations = useCallback(async () => {
    if (!profile) return;
    
    try {
      setIsLoading(true);
      const recs = await PersonalizationService.generatePersonalizedRecommendations(
        profile,
        {
          currentPage: typeof window !== 'undefined' ? window.location.pathname : undefined,
          timeOfDay: getTimeOfDay(),
          dayOfWeek: getDayOfWeek(),
          season: getCurrentSeason()
        }
      );
      setRecommendations(recs);
    } catch (err) {
      console.error('Recommendation refresh failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const updatePreferences = useCallback(async (
    preferences: Partial<PersonalizationProfile['preferences']>
  ) => {
    if (!profile) return;
    
    try {
      const updatedProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          ...preferences
        },
        lastUpdated: Date.now()
      };
      
      setProfile(updatedProfile);
      
      // Save updated profile
      await savePersonalizationProfile(updatedProfile);
      
      // Refresh recommendations with new preferences
      await refreshRecommendations();
    } catch (err) {
      console.error('Preference update failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  }, [profile, refreshRecommendations]);

  const refreshProfile = useCallback(async () => {
    try {
      const currentSessionId = getSessionId();
      const updatedProfile = await loadPersonalizationProfile(user?.id, currentSessionId);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error('Profile refresh failed:', err);
    }
  }, [user?.id, getSessionId]);

  // Computed properties
  const isPersonalized = profile !== null && (
    profile.preferences.categories.length > 0 ||
    profile.preferences.tags.length > 0 ||
    profile.patterns.conversionRate > 0
  );

  const confidenceLevel: 'low' | 'medium' | 'high' = 
    !recommendations ? 'low' :
    recommendations.confidence < 0.3 ? 'low' :
    recommendations.confidence < 0.7 ? 'medium' : 'high';

  return {
    // State
    profile,
    recommendations,
    isLoading,
    error,
    
    // Actions
    trackEvent,
    refreshRecommendations,
    updatePreferences,
    
    // Utilities
    getSessionId,
    isPersonalized,
    confidenceLevel
  };
}

// Helper functions
async function loadPersonalizationProfile(
  userId: string | undefined,
  sessionId: string
): Promise<PersonalizationProfile | null> {
  try {
    const response = await fetch('/api/personalization/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, sessionId })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load profile: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.profile || null;
  } catch (error) {
    console.error('Profile loading failed:', error);
    return null;
  }
}

async function savePersonalizationProfile(profile: PersonalizationProfile): Promise<void> {
  try {
    const response = await fetch('/api/personalization/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save profile: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Profile saving failed:', error);
    throw error;
  }
}

function getDeviceInfo(): UserBehaviorEvent['deviceInfo'] {
  if (typeof window === 'undefined') return undefined;
  
  const userAgent = navigator.userAgent;
  
  let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
  }
  
  let os: string | undefined;
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';
  
  let browser: string | undefined;
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  const screenSize = `${window.screen.width}x${window.screen.height}`;
  
  return {
    type: deviceType,
    os,
    browser,
    screenSize
  };
}

async function getLocationInfo(): Promise<UserBehaviorEvent['location']> {
  // Default to Chile for this e-commerce store
  const defaultLocation = {
    country: 'Chile',
    region: 'Región Metropolitana',
    city: 'Santiago'
  };
  
  try {
    // Try to get more specific location if geolocation is available
    if ('geolocation' in navigator) {
      // For privacy reasons, we'll just use the default location
      // In a production app, you might want to ask for user permission
      return defaultLocation;
    }
    
    // Could also use IP-based geolocation service
    // const response = await fetch('https://ipapi.co/json/');
    // const data = await response.json();
    // return { country: data.country_name, region: data.region, city: data.city };
    
    return defaultLocation;
  } catch (error) {
    console.error('Location detection failed:', error);
    return defaultLocation;
  }
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'early_morning';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'night';
}

function getDayOfWeek(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-12
  
  // Southern hemisphere seasons (Chile)
  if (month >= 12 || month <= 2) return 'summer';
  if (month >= 3 && month <= 5) return 'autumn';
  if (month >= 6 && month <= 8) return 'winter';
  return 'spring';
}