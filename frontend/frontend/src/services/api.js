const API_BASE_URL = 'http://localhost:5080/api';

/**
 * Helper to get stored auth token
 */
export function getAuthToken() {
  try {
    return localStorage.getItem('luxehaven_token') || '';
  } catch {
    return '';
  }
}

/**
 * Standard fetch wrapper with JSON headers and optional auth
 */
async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const err = await response.json();
      errorMsg = err.message || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Destinations
  getDestinations: () => request('/destinations'),

  // Rooms
  getRooms: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.destination && filters.destination !== 'all') params.append('destination', filters.destination);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (filters.guests) params.append('guests', filters.guests);
    if (filters.amenities && filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);

    const qs = params.toString();
    return request(`/rooms${qs ? `?${qs}` : ''}`);
  },

  getRoomById: (id) => request(`/rooms/${id}`),

  getFeaturedRooms: () => request('/rooms/featured'),

  // Bookings
  getBookings: (email) => {
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    return request(`/bookings${qs}`);
  },

  createBooking: (bookingPayload) => request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingPayload)
  }),

  cancelBooking: (bookingId) => request(`/bookings/${bookingId}`, {
    method: 'DELETE'
  }),

  // Auth
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('luxehaven_token', data.token);
    }
    return data;
  },

  register: async (name, email, password) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (data.token) {
      localStorage.setItem('luxehaven_token', data.token);
    }
    return data;
  },

  demoLogin: async () => {
    const data = await request('/auth/demo-login', {
      method: 'POST'
    });
    if (data.token) {
      localStorage.setItem('luxehaven_token', data.token);
    }
    return data;
  },

  getProfile: () => request('/auth/me'),

  logout: () => {
    localStorage.removeItem('luxehaven_token');
    localStorage.removeItem('luxehaven_user');
  },

  // Promo Codes & Addons
  validatePromo: (code) => request('/offers/validate', {
    method: 'POST',
    body: JSON.stringify({ code })
  }),

  getSpecialOffers: () => request('/offers'),

  getAddons: () => request('/offers/addons'),

  // Reviews
  getReviews: (roomId) => {
    const qs = roomId ? `?roomId=${encodeURIComponent(roomId)}` : '';
    return request(`/reviews${qs}`);
  },

  submitReview: (reviewData) => request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),

  // Newsletter
  subscribeNewsletter: (email) => request('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
};
