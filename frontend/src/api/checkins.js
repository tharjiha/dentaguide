const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

const get = async (path, token) => {
  const r = await fetch(`${BASE}${path}`, { headers: authHeaders(token) });
  const json = await r.json();
  if (!r.ok) throw new Error(json.detail ?? 'Request failed');
  return json;
};

export const getTodayCheckin = (token)             => get('/api/checkins/today', token);
export const getHistory      = (token, days = 30)  => get(`/api/checkins/history?days=${days}`, token);
export const getTrends       = (token, days = 30)  => get(`/api/checkins/trends?days=${days}`, token);