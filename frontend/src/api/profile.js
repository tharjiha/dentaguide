const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

const post = async (path, data, token) => {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json.detail ?? 'Request failed');
  return json;
};

const patchReq = async (path, data, token) => {
  const r = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json.detail ?? 'Request failed');
  return json;
};

export const saveStep1   = (data, token) => post('/api/profile/step1', data, token);
export const saveStep2   = (data, token) => post('/api/profile/step2', data, token);
export const saveStep3   = (data, token) => post('/api/profile/step3', data, token);
export const getMyProfile = (token) =>
  fetch(`${BASE}/api/profile/me`, { headers: authHeaders(token) })
    .then(async r => { const j = await r.json(); if (!r.ok) throw new Error(j.detail); return j; });
export const updateProfile = (data, token) => patchReq('/api/profile/me', data, token);
