import {
  filterMockItems,
  addMockItem,
  updateMockItemStatus,
  getMockMatches,
  getStoredItems
} from './mockData';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to check if backend is reachable
 */
async function fetchWithFallback(url, options = {}, mockFallbackFn) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for fast fallback
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const payloadData = json && (json.data !== undefined ? json.data : (json.items !== undefined ? json.items : json));
      return { success: true, data: payloadData, isMock: false };
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (err) {
    console.warn(`[API] Server unavailable at ${url}, using mock data fallback:`, err.message);
    const mockResult = mockFallbackFn();
    return { success: true, data: mockResult, isMock: true };
  }
}

export const api = {
  /**
   * Fetch all items with optional filters
   */
  async getItems(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.type && filters.type !== 'All') queryParams.append('type', filters.type);
    if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
    if (filters.location && filters.location !== 'All') queryParams.append('location', filters.location);
    if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);

    const url = `${API_BASE_URL}/items?${queryParams.toString()}`;
    return fetchWithFallback(url, { method: 'GET' }, () => filterMockItems(filters));
  },

  /**
   * Post a new Lost or Found item
   */
  async createItem(itemData) {
    const url = `${API_BASE_URL}/items`;
    return fetchWithFallback(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      },
      () => addMockItem(itemData)
    );
  },

  /**
   * Update item status (Open -> Resolved)
   */
  async updateStatus(id, status) {
    const url = `${API_BASE_URL}/items/${id}/status`;
    return fetchWithFallback(
      url,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      },
      () => updateMockItemStatus(id, status)
    );
  },

  /**
   * Fetch matching items for a given lost/found item
   */
  async getMatches(itemId) {
    const url = `${API_BASE_URL}/items/${itemId}/matches`;
    return fetchWithFallback(
      url,
      { method: 'GET' },
      () => getMockMatches(itemId)
    );
  },

  /**
   * Fetch overview stats
   */
  async getStats() {
    const url = `${API_BASE_URL}/items/stats`;
    return fetchWithFallback(
      url,
      { method: 'GET' },
      () => {
        const all = getStoredItems();
        const total = all.length;
        const lost = all.filter(i => i.type === 'Lost').length;
        const found = all.filter(i => i.type === 'Found').length;
        const resolved = all.filter(i => i.status === 'Resolved').length;
        const open = total - resolved;
        return { total, lost, found, resolved, open };
      }
    );
  }
};
