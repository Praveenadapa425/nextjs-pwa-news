import { fetchTopHeadlines } from "../lib/api"

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ articles: [{ title: "Test Article" }] }),
  })
) as jest.Mock

describe("API Service", () => {
  it("fetchTopHeadlines returns data", async () => {
    const data = await fetchTopHeadlines()
    expect(data.articles[0].title).toBe("Test Article")
  })
})