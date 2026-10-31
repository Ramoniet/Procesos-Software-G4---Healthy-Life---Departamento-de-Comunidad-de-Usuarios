import { useState } from 'react';
import type { Community, User } from '../types/index.ts';
import { useApp } from '../app/AppContext.tsx';

interface CommunityMemberListProps {
  community: Community;
  users: User[];
}

export function CommunityMemberList({ community, users }: CommunityMemberListProps) {
  const {
    currentUser,
    friendRequests,
    sendFriendRequest,
    cancelFriendRequest,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Obtenemos los usuarios que pertenecen a la comunidad según memberIds
  const members = community.memberIds
    .map((memberId) => users.find((u) => u.id === memberId))
    .filter((u): u is User => Boolean(u))
    .sort((a, b) => {
      // El admin de la comunidad primero, luego el usuario actual, luego alfabéticamente
      if (a.id === community.adminId) return -1;
      if (b.id === community.adminId) return 1;
      if (a.id === currentUser.id) return -1;
      if (b.id === currentUser.id) return 1;
      return a.name.localeCompare(b.name);
    });

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Cabecera y buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-secondary">
            Miembros de la comunidad ({members.length})
          </h2>
        </div>

        {/* Buscador de miembros */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar miembro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Lista de miembros */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map((member) => {
            const isCurrentUser = member.id === currentUser.id;
            const isCommunityAdmin = member.id === community.adminId;
            const initials = member.name
              .split(' ')
              .map((n) => n[0])
              .join('');

            // Solicitud enviada por el usuario actual a este miembro
            const sentRequest = friendRequests.find(
              (r) => r.senderId === currentUser.id && r.receiverId === member.id,
            );

            // Solicitud recibida del miembro hacia el usuario actual
            const receivedRequest = friendRequests.find(
              (r) => r.senderId === member.id && r.receiverId === currentUser.id,
            );

            // HU-20 — Amistad confirmada entre el usuario actual y este miembro
            const areFriends =
              currentUser.friendIds.includes(member.id) &&
              member.friendIds.includes(currentUser.id);

            return (
              <div
                key={member.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-3 hover:border-gray-300 transition-colors"
              >
                {/* Datos del miembro */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-secondary truncate">
                        {member.name}
                      </span>
                      {isCommunityAdmin && (
                        <span className="text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 shrink-0">
                          Admin
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 shrink-0">
                          Tú
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 truncate">
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Acciones de amistad */}
                <div className="shrink-0">
                  {isCurrentUser ? (
                    <span className="text-xs text-gray-400 italic px-2">
                      Tu perfil
                    </span>
                  ) : areFriends ? (
                    /* HU-20 — Amistad aceptada: ambos perfiles quedan como "Amigos" */
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg">
                      <svg
                        className="w-3.5 h-3.5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Amigos
                    </span>
                  ) : sentRequest ? (
                    /* Solicitud enviada por el usuario actual */
                    <div className="inline-flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
                        <svg
                          className="w-3.5 h-3.5 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Solicitud enviada
                      </span>
                      <button
                        onClick={() => cancelFriendRequest(sentRequest.id)}
                        title="Cancelar solicitud de amistad"
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : receivedRequest ? (
                    /* Solicitud pendiente recibida */
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
                      <svg
                        className="w-3.5 h-3.5 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Solicitud recibida
                    </span>
                  ) : (
                    /* Botón para mandar solicitud de amistad */
                    <button
                      onClick={() => sendFriendRequest(member.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/85 active:scale-95 rounded-lg transition-all cursor-pointer shadow-sm shadow-primary/20"
                    >
                      <svg
                        className="w-3.5 h-3.5"
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
                      Añadir amigo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
          <span className="text-4xl">👥</span>
          <p className="text-gray-500 mt-2 font-medium">
            No se encontraron miembros{searchTerm ? ` para "${searchTerm}"` : ''}.
          </p>
        </div>
      )}
    </div>
  );
}

