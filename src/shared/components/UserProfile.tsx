import { useApp } from '../../app/AppContext.tsx';

interface UserProfileProps {
  className?: string;
  reverse?: boolean;
}

export function UserProfile({ className = '', reverse = false }: UserProfileProps) {
  const { currentUser } = useApp();
  const initials = currentUser.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {reverse && (
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
      )}
      <div className={`flex flex-col ${reverse ? '' : 'items-end'}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-secondary">{currentUser.name}</span>
          {currentUser.role === 'admin' && (
            <span className="text-xs font-semibold bg-primary/15 text-primary rounded-full px-2 py-0.5">
              Admin
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{currentUser.email}</span>
      </div>
      {!reverse && (
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
      )}
    </div>
  );
}
