import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ArticleCard from "../components/ArticleCard"

describe("ArticleCard Component", () => {
  it("renders article title", () => {
    render(
      <ArticleCard
        article={{
          title: "Test Title",
          urlToImage: "",
          description: "Test Description",
        }}
        index={0}
      />
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
  })
})