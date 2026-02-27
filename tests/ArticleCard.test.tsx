import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ArticleCard from "../components/ArticleCard"

// Mock the IndexedDB functions
jest.mock("../lib/indexedDb", () => ({
  addBookmark: jest.fn().mockResolvedValue(undefined)
}))

describe("ArticleCard Component", () => {
  const mockArticle = {
    title: "Test Title",
    urlToImage: "https://test.com/image.jpg",
    description: "Test Description",
    url: "https://test.com/article"
  }

  it("renders article title", () => {
    render(
      <ArticleCard
        article={mockArticle}
        index={0}
      />
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
  })

  it("renders article description", () => {
    render(
      <ArticleCard
        article={mockArticle}
        index={0}
      />
    )

    expect(screen.getByText("Test Description")).toBeInTheDocument()
  })

  it("renders bookmark button with correct test id", () => {
    render(
      <ArticleCard
        article={mockArticle}
        index={0}
      />
    )

    const bookmarkButton = screen.getByTestId("bookmark-button")
    expect(bookmarkButton).toBeInTheDocument()
    expect(bookmarkButton).toHaveTextContent("Bookmark")
  })

  it("renders Read More button", () => {
    render(
      <ArticleCard
        article={mockArticle}
        index={0}
      />
    )

    const readMoreButton = screen.getByText("Read More")
    expect(readMoreButton).toBeInTheDocument()
    expect(readMoreButton.closest('a')).toHaveAttribute('href', '/article/0')
  })

  it("renders image when urlToImage is provided", () => {
    render(
      <ArticleCard
        article={mockArticle}
        index={0}
      />
    )

    const image = screen.getByAltText("Test Title")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('data-src', 'https://test.com/image.jpg')
  })

  it("does not render image when urlToImage is empty", () => {
    const articleWithoutImage = {
      ...mockArticle,
      urlToImage: ""
    }

    render(
      <ArticleCard
        article={articleWithoutImage}
        index={0}
      />
    )

    expect(screen.queryByAltText("Test Title")).not.toBeInTheDocument()
  })
})