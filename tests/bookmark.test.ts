import { addBookmark, getBookmarks, deleteBookmark, getDB } from "../lib/indexedDb"

describe("Bookmark Functionality", () => {
  // Clear database before each test
  beforeEach(async () => {
    const db = await getDB()
    await db.clear("bookmarks")
  })

  it("should add a bookmark to IndexedDB", async () => {
    const article = {
      url: "https://test.com/article1",
      title: "Test Article",
      description: "Test Description",
      content: "Test Content"
    }

    await addBookmark(article)
    const bookmarks = await getBookmarks()
    
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0]).toEqual(article)
    expect(bookmarks[0].url).toBe("https://test.com/article1")
    expect(bookmarks[0].title).toBe("Test Article")
  })

  it("should retrieve all bookmarks from IndexedDB", async () => {
    const articles = [
      {
        url: "https://test.com/article1",
        title: "Article 1",
        description: "Description 1"
      },
      {
        url: "https://test.com/article2", 
        title: "Article 2",
        description: "Description 2"
      }
    ]

    // Add multiple bookmarks
    await addBookmark(articles[0])
    await addBookmark(articles[1])
    
    const bookmarks = await getBookmarks()
    
    expect(bookmarks).toHaveLength(2)
    expect(bookmarks).toEqual(expect.arrayContaining(articles))
  })

  it("should delete a bookmark from IndexedDB", async () => {
    const article = {
      url: "https://test.com/article1",
      title: "Test Article",
      description: "Test Description"
    }

    await addBookmark(article)
    let bookmarks = await getBookmarks()
    expect(bookmarks).toHaveLength(1)
    
    await deleteBookmark("https://test.com/article1")
    bookmarks = await getBookmarks()
    
    expect(bookmarks).toHaveLength(0)
  })

  it("should handle duplicate bookmarks (same URL)", async () => {
    const article1 = {
      url: "https://test.com/article1",
      title: "Article 1",
      description: "Description 1"
    }
    
    const article2 = {
      url: "https://test.com/article1", // Same URL
      title: "Article 1 Updated",
      description: "Description 1 Updated"
    }

    await addBookmark(article1)
    await addBookmark(article2) // Should update existing
    
    const bookmarks = await getBookmarks()
    
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].title).toBe("Article 1 Updated")
  })

  it("should return empty array when no bookmarks exist", async () => {
    const bookmarks = await getBookmarks()
    expect(bookmarks).toEqual([])
  })
})