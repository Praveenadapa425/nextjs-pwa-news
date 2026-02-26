import { useEffect, useState } from "react"
import { fetchTopHeadlines } from "../lib/api"
import ArticleCard from "../components/ArticleCard"
import LazyImage from "../components/LazyImage"
import Head from "next/head"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

// Function to resize image URLs for common providers
function resizeImageUrl(url: string): string {
  if (!url) return url;
  
  // Check if it's a known provider that supports URL parameters
  if (url.includes('cnn.com') || url.includes('time.com') || url.includes('reuters.com')) {
    // For CNN and similar sites that support w parameter
    if (url.includes('?') && !url.includes('&w=')) {
      return `${url}&w=800`;
    } else if (!url.includes('?') && !url.includes('&w=')) {
      return `${url}?w=800`;
    }
  }
  
  // For images that already have width parameters, adjust them
  if (url.includes('resize') || url.includes('width') || url.includes('w=')) {
    return url.replace(/(w=|width=)\d+/g, '$1800');
  }
  
  // For general cases, append w=800 if not already present
  if (!url.includes('w=') && !url.includes('width=')) {
    if (url.includes('?')) {
      return `${url}&w=800`;
    } else {
      return `${url}?w=800`;
    }
  }
  
  return url;
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
    <>
      <Head>
        {articles[0]?.urlToImage && (
          <link
            rel="preload"
            as="image"
            href={resizeImageUrl(articles[0].urlToImage)}
          />
        )}
      </Head>
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

        {!loading && articles.length > 0 && (
          <>
            {/* First article with eager loading */}
            <div className="border p-4 mb-4 rounded shadow">
              {articles[0].urlToImage && (
                <img
                  key={articles[0].url}
                  src={resizeImageUrl(articles[0].urlToImage)}
                  alt={articles[0].title}
                  width={800}
                  height={450}
                  className="w-full h-48 object-cover mb-3"
                  loading="eager"
                />
              )}
              
              <h2 className="font-semibold text-lg">{articles[0].title}</h2>
              
              {articles[0].description && (
                <p className="text-sm text-gray-600 mt-2">
                  {articles[0].description}
                </p>
              )}

              <a href={`/article/0`}>
                <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded">
                  Read More
                </button>
              </a>
            </div>

            {/* Remaining articles with lazy loading */}
            {articles.slice(1).map((article, index) => (
              <ArticleCard
                key={index + 1}
                article={{...article, urlToImage: resizeImageUrl(article.urlToImage)}}
                index={index + 1}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}