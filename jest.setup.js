// Mock IndexedDB for tests
const mockIndexedDB = {
  open: jest.fn().mockReturnValue({
    onsuccess: null,
    onerror: null,
    result: {
      transaction: jest.fn().mockReturnValue({
        objectStore: jest.fn().mockReturnValue({
          put: jest.fn().mockResolvedValue(undefined),
          get: jest.fn().mockResolvedValue(null),
          delete: jest.fn().mockResolvedValue(undefined),
          getAll: jest.fn().mockResolvedValue([]),
          clear: jest.fn().mockResolvedValue(undefined)
        })
      })
    }
  })
};

// Mock idb module with proper test data handling
const mockBookmarks = [];

jest.mock('idb', () => ({
  openDB: jest.fn().mockResolvedValue({
    put: jest.fn().mockImplementation((storeName, article) => {
      const existingIndex = mockBookmarks.findIndex(b => b.url === article.url);
      if (existingIndex >= 0) {
        mockBookmarks[existingIndex] = article;
      } else {
        mockBookmarks.push(article);
      }
      return Promise.resolve();
    }),
    get: jest.fn().mockImplementation((storeName, url) => {
      const bookmark = mockBookmarks.find(b => b.url === url);
      return Promise.resolve(bookmark || null);
    }),
    delete: jest.fn().mockImplementation((storeName, url) => {
      const index = mockBookmarks.findIndex(b => b.url === url);
      if (index >= 0) {
        mockBookmarks.splice(index, 1);
      }
      return Promise.resolve();
    }),
    getAll: jest.fn().mockImplementation(() => {
      return Promise.resolve([...mockBookmarks]);
    }),
    clear: jest.fn().mockImplementation(() => {
      mockBookmarks.length = 0;
      return Promise.resolve();
    }),
    objectStoreNames: {
      contains: jest.fn().mockReturnValue(true)
    },
    createObjectStore: jest.fn()
  })
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

global.indexedDB = mockIndexedDB;