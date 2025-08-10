import React, { useState } from 'react';

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  }

  return (
    <div className="card p-5 sm:p-6 fade-in">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">Shortened URL</h2>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <a href={result.shortUrl} target="_blank" rel="noreferrer" className="flex-1 group">
          <div className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-600 text-primary-300 font-medium text-sm break-all group-hover:border-primary-500 transition">
            {result.shortUrl}
          </div>
        </a>
        <button onClick={handleCopy} className="btn-primary text-sm h-[46px] sm:w-32">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="mt-4 text-[11px] text-slate-500 break-all">Original: <span className="text-slate-400">{result.originalUrl}</span></p>
      {result.alias && (
        <p className="mt-1 text-[11px] text-slate-500 break-all">Alias: <span className="text-slate-400">{result.alias}</span></p>
      )}
      {result.expiresAt && (
        <p className="mt-1 text-[11px] text-amber-400">Expires: {new Date(result.expiresAt).toLocaleString()}</p>
      )}
    </div>
  );
}
