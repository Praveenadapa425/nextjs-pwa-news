import { useEffect, useState } from "react"
import { fetchTopHeadlines } from "../lib/api"
import ArticleCard from "../components/ArticleCard"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

async function subscribeToPush() {
  if (!("serviceWorker" in navigator)) return

  const permission = await Notification.requestPermission()

  if (permission !== "granted") {
    alert("Permission denied")
    return
  }

  const reg = await navigator.serviceWorker.ready

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    ),
  })

  console.log("Push Subscription:", subscription)
}

export default function Home() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopHeadlines()
      .then((data) => {
        setArticles(data.articles || [])
        sessionStorage.setItem("articles", JSON.stringify(data.articles))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">PWA News</h1>
      
      <button
        data-testid="subscribe-push-button"
        className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
        onClick={subscribeToPush}
      >
        Subscribe to Push Notifications
      </button>

      {loading && <p>Loading...</p>}

      {!loading &&
        articles.map((article, index) => (
          <ArticleCard
            key={index}
            article={article}
            index={index}
          />
        ))}
    </div>
  )
}