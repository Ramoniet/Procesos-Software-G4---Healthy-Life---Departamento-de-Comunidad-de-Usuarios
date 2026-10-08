import { useState } from 'react';
import { Logo } from './Logo.tsx';
import { Navbar } from './Navbar.tsx';
import { UserProfile } from './UserProfile.tsx';
import { MobileMenu } from './MobileMenu.tsx';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b-2 border-gray-300">
      <div className="flex items-center justify-between p-3 gap-4">
        <Logo />
        <Navbar className="hidden md:flex flex-1" />
        <UserProfile className="hidden md:flex shrink-0" />

        {/* Botón hamburguesa mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú mobile desplegable — fuera del div flex para no romper el layout */}
      {menuOpen && <MobileMenu />}
    </header>
  );
}
