import { openDB } from "idb"

const DB_NAME = "news-db"
const STORE_NAME = "bookmarks"

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "url" })
      }
    },
  })
}

export async function addBookmark(article: any) {
  const db = await getDB()
  await db.put(STORE_NAME, article)
}

export async function getBookmarks() {
  const db = await getDB()
  return db.getAll(STORE_NAME)
}

export async function deleteBookmark(url: string) {
  const db = await getDB()
  await db.delete(STORE_NAME, url)
}