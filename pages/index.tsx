import { useEffect, useState } from "react"
import { fetchTopHeadlines } from "../lib/api"
import ArticleCard from "../components/ArticleCard"

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