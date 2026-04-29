/**
 * api.js — Barcha HTML sahifalar uchun umumiy API konfiguratsiya
 * Bu faylni index.html, news.html, admin.html, contact.html ga ulang:
 * <script src="./api.js"></script>
 */

// ⚠️ Bu yerga o'z Django URL ni yozing
const API_BASE = 'https://assemblyuz.pythonanywhere.com/api';
// Local test uchun: const API_BASE = 'http://127.0.0.1:8000/api';

const Api = {
  // ─── Auth ──────────────────────────────────────────────────
  async login(login, password) {
    const res = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('ea_token', data.token);
    return data.token;
  },

  logout() {
    localStorage.removeItem('ea_token');
  },

  getToken() {
    return localStorage.getItem('ea_token');
  },

  authHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // ─── News ──────────────────────────────────────────────────
  async getNews() {
    const res = await fetch(`${API_BASE}/news/`);
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },

  async createNews(formData) {
    // formData — FormData object (multipart, with image)
    const res = await fetch(`${API_BASE}/news/`, {
      method: 'POST',
      headers: { ...this.authHeaders() },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    return data;
  },

  async deleteNews(id) {
    const res = await fetch(`${API_BASE}/news/${id}/`, {
      method: 'DELETE',
      headers: { ...this.authHeaders() },
    });
    if (!res.ok) throw new Error('Delete failed');
  },

  // ─── Contact Requests ──────────────────────────────────────
  async getRequests() {
    const res = await fetch(`${API_BASE}/requests/`, {
      headers: { ...this.authHeaders() },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async createRequest(payload) {
    const res = await fetch(`${API_BASE}/requests/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    return data;
  },

  async updateRequestStatus(id, newStatus) {
    const res = await fetch(`${API_BASE}/requests/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.authHeaders(),
      },
      body: JSON.stringify({ status: newStatus }),
    });
    return res.json();
  },

  async deleteRequest(id) {
    const res = await fetch(`${API_BASE}/requests/${id}/`, {
      method: 'DELETE',
      headers: { ...this.authHeaders() },
    });
    if (!res.ok) throw new Error('Delete failed');
  },
};