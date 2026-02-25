import { useEffect, useState } from "react"
import { getBookmarks, deleteBookmark } from "../lib/indexedDb"

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([])

  useEffect(() => {
    getBookmarks().then(setBookmarks)
  }, [])

  const handleDelete = async (url: string) => {
    await deleteBookmark(url)
    const updated = await getBookmarks()
    setBookmarks(updated)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>

      {bookmarks.length === 0 && <p>No bookmarks saved.</p>}

      {bookmarks.map((article) => (
        <div key={article.url} className="border p-4 mb-4 rounded">
          <h2 className="font-semibold">{article.title}</h2>

          <button
            onClick={() => handleDelete(article.url)}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}