import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    // Force port 3000 for development
    port: 3000,
  }),

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Skip linting and type checking for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Bundle analysis (enable when needed)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },

  experimental: {
    // Optimized package imports
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@tabler/icons-react",
      "lucide-react",
      "date-fns",
    ],
  },

  // Output configuration
  output: "standalone",
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
