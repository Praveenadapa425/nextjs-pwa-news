const BASE_URL = process.env.NEXT_PUBLIC_NEWS_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

export async function fetchTopHeadlines() {
  try {
    // Check if API credentials are provided
    if (!BASE_URL || !API_KEY || API_KEY === 'your_news_api_key_here') {
      // Return mock data if no API key is provided
      console.log("Using mock data - API key not configured");
      return {
        articles: [
          {
            title: "Welcome to PWA News App!",
            description: "This is a sample article. Configure your API key to see real news.",
            urlToImage: "https://placehold.co/800x450?text=News+Placeholder",
            content: "This is a demo article showing the PWA News App functionality. To see real news, please configure your API key in a .env.local file.",
            url: "#"
          },
          {
            title: "PWA Features Working",
            description: "Service worker, offline support, and push notifications are ready!",
            urlToImage: "https://placehold.co/800x450?text=PWA+Features",
            content: "Your PWA features are working correctly. The app has offline support, push notifications, and background sync capabilities.",
            url: "#"
          },
          {
            title: "Docker Deployment Successful",
            description: "App is running in Docker container on port 3000",
            urlToImage: "https://placehold.co/800x450?text=Docker+Success",
            content: "The Docker build was successful. Your app is containerized and running properly.",
            url: "#"
          }
        ]
      };
    }
    
    const res = await fetch(
      `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`
    )

    if (!res.ok) {
      throw new Error("Failed to fetch headlines")
    }

    return await res.json()
  } catch (error) {
    console.error("API Error:", error)
    // Return mock data in case of error
    return {
      articles: [
        {
          title: "API Connection Failed",
          description: "Check your API configuration in .env.local file",
          urlToImage: "https://placehold.co/800x450?text=API+Error",
          content: "Could not connect to news API. Please verify your API key and URL in the .env.local file.",
          url: "#"
        }
      ]
    };
  }
}