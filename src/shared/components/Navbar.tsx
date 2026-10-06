const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Comunidades', href: '/comunidades' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Foro', href: '/foro' },
  { label: 'Recursos', href: '/recursos' },
];

const ACTIVE_PATH = '/comunidades';

interface NavbarProps {
  className?: string;
  direction?: 'row' | 'col';
}

export function Navbar({ className = '', direction = 'row' }: NavbarProps) {
  return (
    <nav className={`flex gap-1 ${direction === 'col' ? 'flex-col' : ''} ${className}`}>
      {NAV_LINKS.map((link) => {
        const isActive = link.href === ACTIVE_PATH;
        return (
          <a
            key={link.href}
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
