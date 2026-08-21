// Standalone mock data service for independent frontend development
const LOCAL_STORAGE_KEY = 'campus_lost_found_items_v1';

export const CATEGORIES = [
  'Electronics',
  'Books',
  'ID Cards',
  'Bags',
  'Accessories',
  'Keys',
  'Other'
];

export const LOCATIONS = [
  'Library 2nd Floor',
  'Canteen / Food Court',
  'Block B - Room 102',
  'Sports Complex & Gym',
  'Main Auditorium',
  'Hostel Block 3 Lounge',
  'Science Lab Block A',
  'Campus Lawn / Amphitheatre'
];

export const INITIAL_MOCK_ITEMS = [
  {
    _id: 'item_101',
    title: 'Black Leather Wallet with Student ID',
    type: 'Lost',
    category: 'ID Cards',
    location: 'Library 2nd Floor',
    description: 'Lost a slim black leather wallet containing Student ID card (A. Pal), ATM card, and room keys. Reward offered!',
    date: '2026-08-20',
    contactInfo: 'ashish.student@campus.edu | +91-9876543210',
    status: 'Open',
    createdAt: '2026-08-20T14:30:00.000Z'
  },
  {
    _id: 'item_102',
    title: 'Found Black Leather Wallet (Library)',
    type: 'Found',
    category: 'ID Cards',
    location: 'Library 2nd Floor',
    description: 'Found a black leather wallet near study desks on 2nd floor. Deposited at Library reception desk.',
    date: '2026-08-20',
    contactInfo: 'library.desk@campus.edu | Ext: 402',
    status: 'Open',
    createdAt: '2026-08-20T16:15:00.000Z'
  },
  {
    _id: 'item_103',
    title: 'Boat Airdopes Wireless Earbuds (Case)',
    type: 'Lost',
    category: 'Electronics',
    location: 'Canteen / Food Court',
    description: 'White charging case for Boat Airdopes left on table near juice counter around lunch time.',
    date: '2026-08-21',
    contactInfo: 'rohit.k@campus.edu | +91-9123456789',
    status: 'Open',
    createdAt: '2026-08-21T09:10:00.000Z'
  },
  {
    _id: 'item_104',
    title: 'Silver Mechanical Pencil & Notebook',
    type: 'Found',
    category: 'Books',
    location: 'Block B - Room 102',
    description: 'Found a black spiral notebook along with a Rotring silver mechanical pencil after CS lecture.',
    date: '2026-08-21',
    contactInfo: 'priya.m@campus.edu | +91-9988776655',
    status: 'Open',
    createdAt: '2026-08-21T11:00:00.000Z'
  },
  {
    _id: 'item_105',
    title: 'Navy Blue Nike Backpack',
    type: 'Lost',
    category: 'Bags',
    location: 'Sports Complex & Gym',
    description: 'Navy blue Nike backpack with laptop sleeve. Left near badminton court 2.',
    date: '2026-08-19',
    contactInfo: 'rahul.s@campus.edu | +91-9811223344',
    status: 'Resolved',
    createdAt: '2026-08-19T18:00:00.000Z'
  },
  {
    _id: 'item_106',
    title: 'Silver Honda Bike Key Chain',
    type: 'Found',
    category: 'Keys',
    location: 'Campus Lawn / Amphitheatre',
    description: 'Bike keys with a marvel Captain America shield keychain found on grass near tree bench.',
    date: '2026-08-21',
    contactInfo: 'security.gate1@campus.edu | Ext: 101',
    status: 'Open',
    createdAt: '2026-08-21T12:00:00.000Z'
  }
];

// Helper to seed localStorage
export const getStoredItems = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ITEMS));
      return INITIAL_MOCK_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ITEMS));
      return INITIAL_MOCK_ITEMS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return INITIAL_MOCK_ITEMS;
  }
};

export const saveStoredItems = (items) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error writing to localStorage:', err);
  }
};

// Filter mock items safely
export const filterMockItems = ({ type, category, location, search, status } = {}) => {
  let items = getStoredItems();
  if (!Array.isArray(items)) items = [];

  if (type && type !== 'All') {
    items = items.filter(item => item && item.type && item.type.toLowerCase() === type.toLowerCase());
  }

  if (category && category !== 'All') {
    items = items.filter(item => item && item.category === category);
  }

  if (location && location !== 'All') {
    items = items.filter(item => item && item.location === location);
  }

  if (status && status !== 'All') {
    items = items.filter(item => item && item.status === status);
  }

  if (search && search.trim() !== '') {
    const term = search.toLowerCase().trim();
    items = items.filter(item => {
      if (!item) return false;
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const loc = (item.location || '').toLowerCase();
      const contact = (item.contactInfo || '').toLowerCase();
      return title.includes(term) || desc.includes(term) || loc.includes(term) || contact.includes(term);
    });
  }

  return items;
};

// Add new mock item
export const addMockItem = (newItemData) => {
  const items = getStoredItems();
  const safeItems = Array.isArray(items) ? items : [];
  const newItem = {
    _id: 'item_' + Date.now(),
    title: newItemData.title || 'Untitled Report',
    type: newItemData.type || 'Lost',
    category: newItemData.category || 'Other',
    location: newItemData.location || 'Campus',
    description: newItemData.description || '',
    date: newItemData.date || new Date().toISOString().split('T')[0],
    contactInfo: newItemData.contactInfo || 'N/A',
    status: 'Open',
    createdAt: new Date().toISOString()
  };
  const updated = [newItem, ...safeItems];
  saveStoredItems(updated);
  return newItem;
};

// Update item status
export const updateMockItemStatus = (id, newStatus) => {
  const items = getStoredItems();
  const safeItems = Array.isArray(items) ? items : [];
  const updated = safeItems.map(item => {
    if (item && item._id === id) {
      return { ...item, status: newStatus };
    }
    return item;
  });
  saveStoredItems(updated);
  return updated.find(item => item && item._id === id);
};

// Matcher Algorithm in Mock Data
export const getMockMatches = (targetItemId) => {
  const items = getStoredItems();
  if (!Array.isArray(items)) return [];
  const target = items.find(i => i && i._id === targetItemId);
  if (!target) return [];

  const oppositeType = target.type === 'Lost' ? 'Found' : 'Lost';
  const candidates = items.filter(i => i && i.type === oppositeType && i.status === 'Open');

  return candidates.map(candidate => {
    let score = 0;
    let reasons = [];

    // Category match: +50 points
    if (candidate.category && target.category && candidate.category === target.category) {
      score += 50;
      reasons.push('Same Category (' + target.category + ')');
    }

    // Location match: +30 points
    if (candidate.location && target.location) {
      if (candidate.location === target.location) {
        score += 30;
        reasons.push('Same Location (' + target.location + ')');
      } else {
        const firstWord = (target.location.split(' ')[0] || '').toLowerCase();
        if (firstWord && candidate.location.toLowerCase().includes(firstWord)) {
          score += 15;
          reasons.push('Nearby Location');
        }
      }
    }

    // Title / Description word overlap: up to +20 points
    const targetWords = ((target.title || '') + ' ' + (target.description || '')).toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const candidateWords = ((candidate.title || '') + ' ' + (candidate.description || '')).toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const overlaps = targetWords.filter(w => candidateWords.includes(w));
    
    if (overlaps.length > 0) {
      const keywordScore = Math.min(20, overlaps.length * 10);
      score += keywordScore;
      reasons.push('Matching Keywords: ' + Array.from(new Set(overlaps)).slice(0, 3).join(', '));
    }

    return {
      item: candidate,
      score: Math.min(99, score),
      reasons
    };
  })
  .filter(match => match.score >= 40)
  .sort((a, b) => b.score - a.score);
};

