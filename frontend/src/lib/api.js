const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export async function shortenUrl(url, opts = {}) {
  const res = await fetch(`${API_BASE}/api/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, ...opts })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export async function checkAlias(alias) {
  if (!alias) return { alias: '', available: false };
  const res = await fetch(`${API_BASE}/api/shorten/check/${encodeURIComponent(alias)}`);
  if (!res.ok) throw new Error('Failed to check alias');
  return res.json();
}
