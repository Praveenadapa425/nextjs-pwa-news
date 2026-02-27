import Link from "next/link"
import LazyImage from "./LazyImage"
import { addBookmark } from "../lib/indexedDb"

interface ArticleCardProps {
  article: any
  index: number
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const handleBookmark = async () => {
    try {
      await addBookmark(article)
      
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready
        if ("sync" in reg) {
          await (reg as any).sync.register("sync-new-bookmarks")
        }
      }
      
      alert("Article bookmarked!")
    } catch (error) {
      console.error("Bookmark failed:", error)
      alert("Failed to bookmark article")
    }
  }

  return (
    <div className="border p-4 mb-4 rounded shadow">
      {article.urlToImage && (
        <LazyImage
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover mb-3"
        />
      )}
      
      <h2 className="font-semibold text-lg">{article.title}</h2>
      
      {article.description && (
        <p className="text-sm text-gray-600 mt-2">
          {article.description}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <Link href={`/article/${index}`}>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">
            Read More
          </button>
        </Link>
        
        <button
          data-testid="bookmark-button"
          onClick={handleBookmark}
          className="bg-green-500 text-white px-3 py-1 rounded"
          aria-label={`Bookmark article: ${article.title}`}
        >
          Bookmark
        </button>
      </div>
    </div>
  )
}