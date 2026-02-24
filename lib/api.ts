const BASE_URL = process.env.NEXT_PUBLIC_NEWS_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

export async function fetchTopHeadlines() {
  try {
    const res = await fetch(
      `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`
    )

    if (!res.ok) {
      throw new Error("Failed to fetch headlines")
    }

    return await res.json()
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}