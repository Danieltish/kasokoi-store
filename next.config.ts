import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async redirects() {
    const legacyCategories: Record<string, string> = {
      "phones-tablets": "phones-electronics",
      "computers-accessories": "phones-electronics",
      "tv-audio-cameras": "phones-electronics",
      laptops: "phones-electronics",
      "networking-equipment": "networking-security",
      "wifi-tools-testers": "networking-security",
      "voip-pbx-systems": "networking-security",
      "home-appliances": "home-kitchen",
      "home-furniture-decor": "home-kitchen",
      "groceries-household": "home-kitchen",
      "fashion-accessories": "fashion-beauty-health",
      "beauty-personal-care": "fashion-beauty-health",
      "health-wellness": "fashion-beauty-health",
      "beauty-electronics": "fashion-beauty-health",
      "agriculture-farm-produce": "farm-livestock",
      "livestock-animal-care": "farm-livestock",
      "building-tools-hardware": "building-auto",
      "automotive-motorbike": "building-auto",
    };

    return Object.entries(legacyCategories).map(([slug, target]) => ({
      source: `/category/${slug}`,
      destination: `/category/${target}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
