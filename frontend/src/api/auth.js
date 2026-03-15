const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const post = async (path, data) => {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json.detail ?? 'Request failed');
  return json;
};

export const register = ({ firstName, lastName, email, password }) =>
  post('/api/auth/register', {
    first_name: firstName,
    last_name:  lastName,
    email,
    password,
  });

export const login = ({ email, password }) =>
  post('/api/auth/login', { email, password });

export const logout = (accessToken) =>
  post('/api/auth/logout', { access_token: accessToken });

export const getMe = (accessToken) =>
  post('/api/auth/me', { access_token: accessToken });
