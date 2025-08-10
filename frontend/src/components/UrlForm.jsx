import React, { useState, useCallback, useEffect, useRef } from 'react';
import ResultCard from './ResultCard.jsx';
import { shortenUrl } from '../lib/api.js';
import Toast from './Toast.jsx';
import { checkAlias } from '../lib/api.js';

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
}

export default function UrlForm() {
  const [input, setInput] = useState('');
  const [alias, setAlias] = useState('');
  const [expireIn, setExpireIn] = useState('');
  const [loading, setLoading] = useState(false);
  const [aliasState, setAliasState] = useState({ status: 'idle', available: null }); // idle|checking|done
  const [toasts, setToasts] = useState([]);
  const aliasDebounce = useRef();
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a URL.');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError('Enter a valid http(s) URL.');
      return;
    }
    if (alias.trim() && aliasState.available === false) {
      pushToast('Alias already in use. Pick another.', 'error');
      return;
    }
    setLoading(true);
    try {
  const payload = {};
  if (alias.trim()) payload.alias = alias.trim();
  if (expireIn.trim()) payload.expireIn = expireIn.trim();
  const data = await shortenUrl(trimmed, payload);
      setResult(data);
      if (alias.trim()) pushToast('Custom short link created!', 'success');
      else pushToast('Short link created!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to shorten URL.');
      pushToast(err.message || 'Failed to shorten URL.', 'error');
    } finally {
      setLoading(false);
    }
  }, [input, alias, aliasState.available, expireIn]);

  function pushToast(message, type='info') {
    setToasts(t => [...t, { id: Date.now() + Math.random(), message, type }]);
  }
  function dismissToast(id) { setToasts(t => t.filter(x => x.id !== id)); }

  // Debounce alias availability check
  useEffect(() => {
    if (!alias.trim()) {
      setAliasState({ status: 'idle', available: null });
      return;
    }
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(alias.trim())) {
      setAliasState({ status: 'done', available: false });
      return;
    }
    setAliasState(s => ({ ...s, status: 'checking' }));
    clearTimeout(aliasDebounce.current);
    aliasDebounce.current = setTimeout(async () => {
      try {
        const data = await checkAlias(alias.trim());
        setAliasState({ status: 'done', available: data.available });
        if (!data.available) pushToast('Alias not available, choose another.', 'error');
      } catch {
        setAliasState({ status: 'idle', available: null });
      }
    }, 450);
    return () => clearTimeout(aliasDebounce.current);
  }, [alias]);

  return (
  <div className="space-y-6">
      <form onSubmit={handleSubmit} className="card p-5 sm:p-7 fade-in">
        <label htmlFor="url" className="block text-sm font-medium mb-2 text-slate-300">Paste a long URL</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="url"
            type="text"
            placeholder="https://example.com/super/long/link"
            className="w-full rounded-lg bg-slate-800/70 border border-slate-600 px-4 py-3 text-sm placeholder:text-slate-500 focus-ring focus:border-primary-500 transition"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoComplete="off"
            disabled={loading}
          />
          <button type="submit" className="btn-primary text-sm h-[46px] sm:w-40" disabled={loading || (alias && aliasState.status==='checking') || (alias && aliasState.available===false)}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Shortening
              </span>
            ) : 'Shorten'}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="alias" className="block text-xs font-medium mb-1 text-slate-400">Custom alias (optional)</label>
            <input
              id="alias"
              type="text"
              placeholder="my-brand"
              className="w-full rounded-lg bg-slate-800/70 border border-slate-600 px-3 py-2 text-xs placeholder:text-slate-500 focus-ring focus:border-primary-500 transition"
              value={alias}
              onChange={e => setAlias(e.target.value)}
              disabled={loading}
              maxLength={30}
            />
            {alias && (
              <p className="mt-1 text-[10px] font-medium">
                {aliasState.status === 'checking' && <span className="text-slate-400">Checking...</span>}
                {aliasState.status === 'done' && aliasState.available && <span className="text-emerald-400">Available ✓</span>}
                {aliasState.status === 'done' && aliasState.available === false && <span className="text-red-400">Unavailable ✕</span>}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="expireIn" className="block text-xs font-medium mb-1 text-slate-400">Expire (minutes)</label>
            <input
              id="expireIn"
              type="number"
              min="1"
              max="43200"
              placeholder="e.g. 60"
              className="w-full rounded-lg bg-slate-800/70 border border-slate-600 px-3 py-2 text-xs placeholder:text-slate-500 focus-ring focus:border-primary-500 transition"
              value={expireIn}
              onChange={e => setExpireIn(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}
        <p className="mt-4 text-xs text-slate-500 leading-relaxed">We only store the URL and a generated code. No tracking beyond a click counter. Avoid sensitive data in query strings.</p>
      </form>
      {result && <ResultCard key={result.code} result={result} onReset={() => setResult(null)} />}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={dismissToast} />
        ))}
      </div>
    </div>
  );
}
