import Link from "next/link"
import LazyImage from "./LazyImage"

interface ArticleCardProps {
  article: any
  index: number
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
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

      <Link href={`/article/${index}`}>
        <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded">
          Read More
        </button>
      </Link>
    </div>
  )
}