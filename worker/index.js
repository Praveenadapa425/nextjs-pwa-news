self.addEventListener("push", function (event) {
  console.log("Push event received:", event)

  const data = event.data
    ? event.data.text()
    : "Default push message"

  event.waitUntil(
    self.registration.showNotification("PWA News", {
      body: data,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      vibrate: [100, 50, 100],
    })
  )
})