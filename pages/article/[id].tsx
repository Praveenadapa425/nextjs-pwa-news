import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { addBookmark } from "../../lib/indexedDb"

export default function ArticleDetail() {
  const router = useRouter()
  const { id } = router.query

  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    const storedArticles = sessionStorage.getItem("articles")

    if (storedArticles) {
      const parsed = JSON.parse(storedArticles)
      setArticle(parsed[id as string])
    }
  }, [id])

  if (!article) return <p className="p-6">Loading...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => {
          addBookmark(article)
          alert("Article saved!")
        }}
      >
        Bookmark
      </button>
    </div>
  )
}