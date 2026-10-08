const CURRENT_USER = {
  name: 'Daniel Marcos',
  email: 'daniel.marcos@alumnos.urjc.es',
};

interface UserProfileProps {
  className?: string;
  reverse?: boolean;
}

export function UserProfile({ className = '', reverse = false }: UserProfileProps) {
  const initials = CURRENT_USER.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {reverse && (
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
      )}
      <div className={`flex flex-col ${reverse ? '' : 'items-end'}`}>
        <span className="text-sm font-medium text-secondary">{CURRENT_USER.name}</span>
        <span className="text-xs text-gray-400">{CURRENT_USER.email}</span>
      </div>
      {!reverse && (
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
      )}
    </div>
  );
}
