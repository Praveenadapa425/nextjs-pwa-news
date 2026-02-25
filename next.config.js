const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  disable: process.env.NODE_ENV === "development",
  customWorkerDir: "worker",
})

module.exports = withPWA({
  reactStrictMode: true,
})