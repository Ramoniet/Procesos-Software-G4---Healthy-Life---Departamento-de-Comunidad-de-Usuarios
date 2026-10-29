import { useApp } from '../app/AppContext.tsx';

/**
 * HU-20 — Sección "Solicitudes pendientes".
 * Muestra las solicitudes de amistad recibidas por el usuario actual y
 * permite aceptarlas (ambos perfiles pasan a "Amigos") o rechazarlas
 * (la solicitud se elimina de la lista sin notificar al emisor).
 */
export function PendingFriendRequests() {
  const {
    users,
    currentUser,
    friendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useApp();

  // Solo las solicitudes recibidas por el usuario actual están pendientes de respuesta
  const receivedRequests = friendRequests.filter(
    (r) => r.receiverId === currentUser.id,
  );

  if (receivedRequests.length === 0) return null;

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
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-secondary">
          Solicitudes pendientes ({receivedRequests.length})
        </h2>
      </div>

      <ul className="flex flex-col divide-y divide-gray-100">
        {receivedRequests.map((request) => {
          const sender = users.find((u) => u.id === request.senderId);
          return (
            <li key={request.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {sender?.name.split(' ').map((n) => n[0]).join('') ?? '??'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-secondary truncate">
                    {sender?.name ?? 'Usuario desconocido'}
                  </span>
                  <span className="text-xs text-gray-400">
                    Envió una solicitud el {new Date(request.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => acceptFriendRequest(request.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 active:scale-95 rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => rejectFriendRequest(request.id)}
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
