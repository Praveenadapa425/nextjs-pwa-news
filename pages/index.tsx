import { useEffect, useState } from "react"
import { fetchTopHeadlines } from "../lib/api"

export default function Home() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopHeadlines()
      .then((data) => {
        setArticles(data.articles || [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">PWA News</h1>

      {loading && <p>Loading...</p>}

      {!loading &&
        articles.map((article, index) => (
          <div key={index} className="border p-4 mb-4 rounded shadow">
            <h2 className="font-semibold">{article.title}</h2>
          </div>
        ))}
    </div>
  )
}