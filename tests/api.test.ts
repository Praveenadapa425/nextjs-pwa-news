// We'll use manual imports to control when modules are loaded
let fetchTopHeadlines: any;

beforeAll(async () => {
  // Set environment variables before importing the module
  process.env.NEXT_PUBLIC_NEWS_API_BASE_URL = 'https://newsapi.org/v2';
  process.env.NEXT_PUBLIC_NEWS_API_KEY = 'test-api-key';
  
  // Dynamically import the function after setting environment variables
  const apiModule = await import('../lib/api');
  fetchTopHeadlines = apiModule.fetchTopHeadlines;
});

// Mock the global fetch function
global.fetch = jest.fn();

describe('API Service Functions', () => {
  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch top headlines successfully', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        articles: [
          {
            title: 'Test Article',
            description: 'Test Description',
            urlToImage: 'https://example.com/image.jpg'
          }
        ]
      })
    };

    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockResponse as any);

    const result = await fetchTopHeadlines();

    expect(fetch).toHaveBeenCalledWith(
      'https://newsapi.org/v2/top-headlines?country=us&apiKey=test-api-key'
    );
    expect(result).toEqual({
      articles: [
        {
          title: 'Test Article',
          description: 'Test Description',
          urlToImage: 'https://example.com/image.jpg'
        }
      ]
    });
  });

  it('should handle API errors gracefully', async () => {
    const mockResponse = {
      ok: false
    };

    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockResponse as any);

    await expect(fetchTopHeadlines()).rejects.toThrow('Failed to fetch headlines');
  });
});