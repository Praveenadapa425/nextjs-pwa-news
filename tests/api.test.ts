import { fetchTopHeadlines } from "../lib/api"

describe("API Service", () => {
  it("fetchTopHeadlines returns data structure", async () => {
    const data = await fetchTopHeadlines()
    expect(data).toHaveProperty('articles')
    expect(Array.isArray(data.articles)).toBe(true)
    expect(data.articles.length).toBeGreaterThan(0)
    expect(data.articles[0]).toHaveProperty('title')
    expect(data.articles[0]).toHaveProperty('description')
  })
  
  it("returns mock data when no API configured", async () => {
    const data = await fetchTopHeadlines()
    expect(data.articles[0].title).toContain("PWA News App")
  })
})