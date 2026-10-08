import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../app/AppContext.tsx';

/**
 * Dropdown de cambio rápido de usuario — solo para pruebas/desarrollo.
 * Muestra un badge "DEV" para que quede claro que es una herramienta temporal.
 */
export function UserSwitcher() {
  const { users, currentUser, switchUser } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Cambiar usuario (modo dev)"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors cursor-pointer"
      >
        {/* Icono personas */}
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
        <span className="bg-amber-400 text-white rounded px-1 py-0.5 text-[10px] leading-none font-bold">DEV</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Cambiar usuario
          </p>
          {users.map((u) => {
            const initials = u.name.split(' ').map((n) => n[0]).join('');
            const isActive = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => { switchUser(u.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary/8 text-primary'
                    : 'hover:bg-gray-50 text-secondary'
                }`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {initials}
                </div>
                {/* Info */}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{u.name}</span>
                  <span className="text-[11px] text-gray-400 truncate">{u.email}</span>
                </div>
                {/* Badges */}
                <div className="flex flex-col items-end gap-1 ml-auto shrink-0">
                  {isActive && (
                    <span className="text-[10px] text-primary font-bold">● activo</span>
                  )}
                  {u.role === 'admin' && (
                    <span className="text-[10px] bg-primary/15 text-primary font-semibold rounded-full px-1.5">
                      admin
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
