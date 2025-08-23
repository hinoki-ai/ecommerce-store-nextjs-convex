'use client';

import React, { useState } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Send, Mail, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface SocialShareButtonsProps {
  entityId: string;
  entityType: 'product' | 'collection' | 'blog' | 'wishlist' | 'review';
  title: string;
  description: string;
  imageUrl?: string;
  price?: string;
  discount?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'floating';
}

interface SharePlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  generateUrl: (content: ShareContent) => string;
  trackingParams?: Record<string, string>;
}

interface ShareContent {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  hashtags?: string[];
}

const sharePlatforms: SharePlatform[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook size={20} />,
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    generateUrl: (content) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}&quote=${encodeURIComponent(content.title)}`
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter size={20} />,
    color: 'bg-sky-500 hover:bg-sky-600 text-white',
    generateUrl: (content) => {
      const hashtags = content.hashtags?.join(',') || 'ecommerce,chile';
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(content.title)}&hashtags=${hashtags}`;
    }
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <MessageCircle size={20} />,
    color: 'bg-green-600 hover:bg-green-700 text-white',
    generateUrl: (content) => {
      const message = `${content.title} - ${content.description}`;
      return `https://wa.me/?text=${encodeURIComponent(message)}%20${encodeURIComponent(content.url)}`;
    }
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: <Send size={20} />,
    color: 'bg-blue-500 hover:bg-blue-600 text-white',
    generateUrl: (content) => {
      const message = `${content.title} - ${content.description}`;
      return `https://t.me/share/url?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(message)}`;
    }
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail size={20} />,
    color: 'bg-gray-600 hover:bg-gray-700 text-white',
    generateUrl: (content) => {
      const subject = encodeURIComponent(content.title);
      const body = encodeURIComponent(`${content.description}\n\n${content.url}`);
      return `mailto:?subject=${subject}&body=${body}`;
    }
  }
];

export function SocialShareButtons({
  entityId,
  entityType,
  title,
  description,
  imageUrl,
  price,
  discount,
  className,
  variant = 'default'
}: SocialShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?ref=social_share`
    : '';

  const shareContent: ShareContent = {
    title: discount ? `¡${discount} OFF! ${title}` : title,
    description: price ? `${description} Solo ${price}` : description,
    url: currentUrl,
    imageUrl,
    hashtags: ['chile', 'ecommerce', 'oferta']
  };

  const handleShare = async (platform: SharePlatform) => {
    try {
      // Track social share event
      await trackSocialShare({
        entityId,
        entityType,
        platform: platform.id as any,
        shareType: 'direct_share',
        metadata: {
          title,
          description,
          price,
          discount,
          url: currentUrl
        }
      });

      // Open share URL
      const shareUrl = platform.generateUrl(shareContent);
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Close dropdown on mobile
      if (variant === 'floating') {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      
      // Track copy event
      await trackSocialShare({
        entityId,
        entityType,
        platform: 'email', // Use email as fallback for copy
        shareType: 'direct_share',
        metadata: { action: 'copy_url', url: currentUrl }
      });

      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareContent.title,
          text: shareContent.description,
          url: shareContent.url
        });
        
        // Track native share
        await trackSocialShare({
          entityId,
          entityType,
          platform: 'email', // Fallback platform for native share
          shareType: 'direct_share',
          metadata: { action: 'native_share' }
        });
      } catch (error) {
        console.error('Native share failed:', error);
      }
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          <span className="hidden sm:inline">Compartir</span>
        </Button>
        
        {isOpen && (
          <div className="flex items-center gap-1">
            {sharePlatforms.slice(0, 3).map((platform) => (
              <Button
                key={platform.id}
                variant="outline"
                size="sm"
                onClick={() => handleShare(platform)}
                className={cn('p-2', platform.color)}
                title={`Compartir en ${platform.name}`}
              >
                {platform.icon}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={cn('relative', className)}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90"
          title="Compartir"
        >
          <Share2 size={20} />
        </Button>
        
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 min-w-[200px] z-50">
            <div className="grid grid-cols-2 gap-2">
              {sharePlatforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant="outline"
                  onClick={() => handleShare(platform)}
                  className={cn('flex items-center gap-2 justify-start', platform.color)}
                >
                  {platform.icon}
                  <span className="text-xs">{platform.name}</span>
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={handleCopyUrl}
                className="flex items-center gap-2 justify-start col-span-2"
              >
                {copiedUrl ? <Check size={20} /> : <Copy size={20} />}
                <span className="text-xs">
                  {copiedUrl ? 'Copiado' : 'Copiar enlace'}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Share2 size={16} />
        Compartir este {entityType === 'product' ? 'producto' : 'contenido'}:
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {sharePlatforms.map((platform) => (
          <Button
            key={platform.id}
            variant="outline"
            onClick={() => handleShare(platform)}
            className={cn(
              'flex flex-col items-center gap-2 h-auto py-3 px-2',
              platform.color
            )}
          >
            {platform.icon}
            <span className="text-xs font-medium">{platform.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 pt-2 border-t">
        {navigator.share && (
          <Button
            variant="outline"
            onClick={handleNativeShare}
            className="flex items-center gap-2 flex-1"
          >
            <Share2 size={16} />
            Compartir nativamente
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={handleCopyUrl}
          className="flex items-center gap-2 flex-1"
        >
          {copiedUrl ? <Check size={16} /> : <Copy size={16} />}
          {copiedUrl ? 'Enlace copiado' : 'Copiar enlace'}
        </Button>
      </div>
    </div>
  );
}

// Utility function to track social shares
async function trackSocialShare(data: {
  entityId: string;
  entityType: string;
  platform: string;
  shareType: string;
  metadata?: any;
}) {
  try {
    // This would call your Convex mutation or API endpoint
    const response = await fetch('/api/social/track-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        createdAt: Date.now()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to track share');
    }

    // Track with Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: data.platform,
        content_type: data.entityType,
        content_id: data.entityId
      });
    }
  } catch (error) {
    console.error('Share tracking failed:', error);
  }
}

export default SocialShareButtons;