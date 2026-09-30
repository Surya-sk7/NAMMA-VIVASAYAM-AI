// ============================================================
// 🌾 NammaVivasayam AI — API Service Layer
// Central HTTP client for all backend communication
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('nv_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Request failed', status: response.status };
    }

    return { data, status: response.status };
  } catch {
    return { error: 'Network error. Please check your connection.', status: 0 };
  }
}

// === Auth ===
export const authApi = {
  register: (body: { name: string; phone: string; password: string; preferredLanguage: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { phone: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  demoLogin: () =>
    request('/auth/demo', { method: 'POST' }),
  me: () =>
    request('/auth/me'),
};

// === Farms ===
export const farmApi = {
  list: () => request('/farms'),
  get: (id: string) => request(`/farms/${id}`),
  getDigitalTwin: (id: string) => request(`/farms/${id}/digital-twin`),
  create: (body: any) => request('/farms', { method: 'POST', body: JSON.stringify(body) }),
};

// === Crops ===
export const cropApi = {
  list: () => request('/crops'),
  get: (id: string) => request(`/crops/${id}`),
  create: (body: any) => request('/crops', { method: 'POST', body: JSON.stringify(body) }),
};

// === Recommendations ===
export const recommendationApi = {
  list: (farmId: string) => request(`/recommendations?farmId=${farmId}`),
  getWhy: (id: string) => request(`/recommendations/${id}/why`),
  getWhatIf: (id: string) => request(`/recommendations/${id}/what-if`),
};

// === Risks ===
export const riskApi = {
  list: (farmId?: string) => request(`/risks${farmId ? `?farmId=${farmId}` : ''}`),
};

// === Pesu ===
export const pesuApi = {
  chat: (body: { message: string; language: string; farmId?: string }) =>
    request('/pesu/chat', { method: 'POST', body: JSON.stringify(body) }),
  voice: (body: { language: string }) =>
    request('/pesu/voice', { method: 'POST', body: JSON.stringify(body) }),
};

// === Services ===
export const serviceApi = {
  list: () => request('/services'),
  createRequest: (body: any) => request('/services/request', { method: 'POST', body: JSON.stringify(body) }),
  book: (body: any) => request('/services/book', { method: 'POST', body: JSON.stringify(body) }),
  listBookings: () => request('/services/bookings'),
};

// === Feedback ===
export const feedbackApi = {
  submit: (body: any) => request('/feedback', { method: 'POST', body: JSON.stringify(body) }),
  list: () => request('/feedback'),
};

// === Organizations ===
export const organizationApi = {
  getDashboard: (id: string) => request(`/organizations/${id}/dashboard`),
  listFarms: (id: string) => request(`/organizations/${id}/farms`),
  create: (body: any) => request('/organizations', { method: 'POST', body: JSON.stringify(body) }),
};

// === Admin ===
export const adminApi = {
  getConfig: () => request('/admin/config'),
  updateCommission: (percentage: number) =>
    request('/admin/config/commission', { method: 'PUT', body: JSON.stringify({ percentage }) }),
  getStats: () => request('/admin/stats'),
  getFeatureFlags: () => request('/admin/feature-flags'),
};
