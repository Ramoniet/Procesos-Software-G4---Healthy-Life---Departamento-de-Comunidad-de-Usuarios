import type { JoinRequest, User } from '../types/index.ts';

interface JoinRequestsListProps {
  requests: JoinRequest[];
  users: User[];
  communityId: string;
  onAccept: (requestId: string, communityId: string, userId: string) => void;
  onReject: (requestId: string) => void;
}

export function JoinRequestsList({
  requests,
  users,
  communityId,
  onAccept,
  onReject,
}: JoinRequestsListProps) {
  if (requests.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-secondary">
          Solicitudes de unión pendientes ({requests.length})
        </h2>
      </div>

      <ul className="flex flex-col divide-y divide-gray-100">
        {requests.map((request) => {
          const applicant = users.find((u) => u.id === request.userId);
          const initials =
            applicant?.name
              .split(' ')
              .map((n) => n[0])
              .join('') ?? '??';

          return (
            <li
              key={request.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-secondary">
                    {applicant?.name ?? 'Usuario desconocido'}
                  </span>
                  <span className="text-xs text-gray-400">
                    Solicitó unirse el{' '}
                    {new Date(request.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onAccept(request.id, communityId, request.userId)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 active:scale-95 rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 active:scale-95 rounded-lg transition-all cursor-pointer"
                >
                  Rechazar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
