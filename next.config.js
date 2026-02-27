const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  disable: process.env.NODE_ENV === "development",
  customWorkerDir: "worker",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\/.*\.(png|jpg|jpeg|gif|svg|ico|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "news-images",
        expiration: {
          maxEntries: 1000,
          maxAgeSeconds: 2592000, // 30 days * 24 hours * 60 minutes * 60 seconds
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\/api\/.*$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 3600, // 1 hour
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.(json)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-json-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 3600, // 1 hour
        },
      },
    },
  ],
})

module.exports = withPWA({
  reactStrictMode: true,
})