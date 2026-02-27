import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import Bookmarks from "../pages/bookmarks"

// Mock the IndexedDB functions
jest.mock("../lib/indexedDb", () => ({
  getBookmarks: jest.fn(),
  deleteBookmark: jest.fn().mockResolvedValue(undefined)
}))

describe("Bookmarks Page", () => {
  const mockBookmarks = [
    {
      url: "https://test.com/article1",
      title: "Test Article 1",
      description: "Test Description 1"
    },
    {
      url: "https://test.com/article2",
      title: "Test Article 2", 
      description: "Test Description 2"
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("displays bookmarked articles", async () => {
    const { getBookmarks } = require("../lib/indexedDb")
    getBookmarks.mockResolvedValue(mockBookmarks)

    render(<Bookmarks />)

    await waitFor(() => {
      expect(screen.getByText("Test Article 1")).toBeInTheDocument()
      expect(screen.getByText("Test Article 2")).toBeInTheDocument()
    })
  })

  it("displays 'No bookmarks saved' when no bookmarks exist", async () => {
    const { getBookmarks } = require("../lib/indexedDb")
    getBookmarks.mockResolvedValue([])

    render(<Bookmarks />)

    await waitFor(() => {
      expect(screen.getByText("No bookmarks saved.")).toBeInTheDocument()
    })
  })

  it("renders remove button for each bookmark", async () => {
    const { getBookmarks } = require("../lib/indexedDb")
    getBookmarks.mockResolvedValue([mockBookmarks[0]])

    render(<Bookmarks />)

    await waitFor(() => {
      const removeButton = screen.getByText("Remove")
      expect(removeButton).toBeInTheDocument()
      expect(removeButton).toHaveClass("bg-red-500")
    })
  })

  it("displays page title", () => {
    const { getBookmarks } = require("../lib/indexedDb")
    getBookmarks.mockResolvedValue([])

    render(<Bookmarks />)
    
    expect(screen.getByText("Bookmarks")).toBeInTheDocument()
    expect(screen.getByText("Bookmarks")).toHaveClass("text-2xl", "font-bold")
  })
})