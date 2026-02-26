import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Head from "next/head"
import { addBookmark } from "../../lib/indexedDb"

export default function ArticleDetail() {
  const router = useRouter()
  const { id } = router.query

  const [article, setArticle] = useState<any>(null)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    if (!id) return

    const storedArticles = sessionStorage.getItem("articles")

    if (storedArticles) {
      const parsed = JSON.parse(storedArticles)
      setArticle(parsed[id as string])
    }
  }, [id])

  useEffect(() => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setCanShare(true)
    }
  }, [])

  const handleShare = async () => {
    if (!navigator.share) return

    try {
      await navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      })
      console.log("Shared successfully")
    } catch (error) {
      console.log("Share cancelled or failed", error)
    }
  }

  if (!article) return <p className="p-6">Loading...</p>

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.description || ""} />
      </Head>
      <div className="p-8">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <p className="mt-4">{article.content}</p>
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          onClick={async () => {
            await addBookmark(article)

            if ("serviceWorker" in navigator) {
              const reg = await navigator.serviceWorker.ready
              console.log("SW ready:", reg)

              if ("sync" in reg) {
                await (reg as any).sync.register("sync-new-bookmarks")
                console.log("Sync registered successfully")
              } else {
                console.log("Background sync NOT supported")
              }
            }

            alert("Article saved!")
          }}
        >
          Bookmark
        </button>
        
        {canShare && (
          <button
            data-testid="web-share-button"
            onClick={handleShare}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Share Article
          </button>
        )}
      </div>
    </>
  )
}