import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  
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

  // Experimental features
  turbopack: {
    root: "/home/kuromatsu/Documents/ΛRΛMΛC/Websites/Store",
  },

  experimental: {
    // Turbopack for dev (already in package.json scripts)
    // Optimized package imports
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@tabler/icons-react",
      "lucide-react",
      "date-fns",
    ],
  },

  // Webpack optimizations (only for production builds, not turbopack)
  webpack: (config, { dev, isServer, turbopack }) => {
    // Skip webpack customizations when using turbopack
    if (turbopack) {
      return config;
    }

    // Production optimizations
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "react/jsx-runtime.js": "preact/compat/jsx-runtime",
      };
    }

    // Bundle size optimization
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/images/",
          outputPath: "static/images/",
        },
      },
    });

    return config;
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
