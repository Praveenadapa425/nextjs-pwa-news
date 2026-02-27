import Link from "next/link"
import LazyImage from "./LazyImage"
import { addBookmark } from "../lib/indexedDb"

interface ArticleCardProps {
  article: any
  index: number
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const handleBookmark = async () => {
    await addBookmark(article)
    
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready
      if ("sync" in reg) {
        await (reg as any).sync.register("sync-new-bookmarks")
      }
    }
    
    alert("Article bookmarked!")
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

      <div className="flex gap-2">
        <button
          data-testid="bookmark-button"
          className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
          aria-label={`Bookmark article: ${article.title}`}
          onClick={handleBookmark}
        >
          Bookmark
        </button>
        
        <Link href={`/article/${index}`}>
          <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded">
            Read More
          </button>
        </Link>
      </div>
    </div>
  )
}