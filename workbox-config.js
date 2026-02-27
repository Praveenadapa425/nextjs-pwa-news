module.exports = {
  // Define routes that should use StaleWhileRevalidate
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/newsapi\.org\/v2\/top-headlines/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'news-api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 60, // 30 minutes
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/newsapi\.org\/v2\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'news-api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 15 * 60, // 15 minutes
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
};