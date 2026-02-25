import { useRouter } from "next/router"
import { useEffect, useState } from "react"

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
    </div>
  )
}