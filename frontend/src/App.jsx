import React from 'react';
import UrlForm from './components/UrlForm.jsx';

function LogoMark() {
  return (
    <a href="/" className="flex items-center gap-3 group select-none" aria-label="LinkSnap Home">
      <img src="/favicon.svg" alt="LinkSnap" className="h-10 w-10 rounded-xl shadow-lg shadow-primary-500/30 ring-1 ring-primary-300/40 group-hover:scale-105 transition-transform" />
      <div className="flex flex-col">
        <span className="text-xl font-bold text-slate-100 group-hover:text-primary-300 transition-colors">
          LinkSnap
        </span>
        <span className="text-xs text-slate-400 -mt-1">
          Snap. Share. Simple.
        </span>
      </div>
    </a>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.12),transparent_65%)]" />
      <header className="relative z-10 backdrop-blur-sm bg-slate-900/70 border-b border-slate-800/70 py-4 px-4 sm:px-8 flex items-center justify-between">
        <LogoMark />
        <nav className="flex items-center gap-4">
          <a href="https://github.com/VanshAgrawal52" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center text-slate-400 hover:text-primary-300 transition" aria-label="GitHub Profile">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.56 9.56 0 012.504.337c1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.523 2 12 2z" clipRule="evenodd" /></svg>
          </a>
        </nav>
      </header>
      <main className="relative z-10 flex-1 px-4 sm:px-0 flex flex-col items-center">
        <div className="w-full max-w-xl mt-4 sm:mt-10">
          <UrlForm />
        </div>
      </main>
      <footer className="relative z-10 bg-slate-900/80 border-t border-slate-800/70 py-6 mt-8">
        <div className="max-w-xl mx-auto px-4 text-center text-[12px] leading-relaxed text-slate-500">
          <p className="flex items-center justify-center gap-1 flex-wrap">
            Built with <span className="text-pink-400" aria-label="love">❤</span> by <span className="font-medium text-slate-300">Vansh Agrawal</span> · <span className="text-slate-400">© {new Date().getFullYear()} LinkSnap</span>
          </p>
          <p className="mt-2 text-slate-600 text-[11px]">Snap long URLs into tiny, shareable bites. Fun, fast & privacy‑light.</p>
        </div>
      </footer>
    </div>
  );
}
