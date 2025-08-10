import React, { useEffect } from 'react';

export default function Toast({ id, type='info', message, onClose, duration=3000 }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onClose]);
  const color = type === 'error' ? 'bg-red-500/90 border-red-400' : type === 'success' ? 'bg-emerald-500/90 border-emerald-400' : 'bg-slate-800/90 border-slate-600';
  return (
    <div className={`toast fade-in card border ${color} px-4 py-2 text-sm font-medium shadow-lg flex items-center gap-2`}> 
      <span>{message}</span>
      <button onClick={() => onClose(id)} className="ml-2 text-xs opacity-70 hover:opacity-100 transition">×</button>
    </div>
  );
}
