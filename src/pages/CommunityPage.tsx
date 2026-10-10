import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../app/AppContext.tsx';
import { TOPICS } from '../utils/topics.ts';
// HU-12 y HU-13
import { PostList } from '../components/PostList.tsx';
import { CreatePostForm } from '../components/CreatePostForm.tsx';

export function CommunityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Se extraen posts y createPost del contexto (HU-12 y HU-13)
  const {
    communities,
    currentUser,
    users,
    joinRequests,
    requestJoin,
    leaveCommunity,
    deleteCommunity,
    posts,
    createPost,
  } = useApp();

  // HU-05: Estado para controlar la visibilidad del modal de confirmación
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // HU-13: Estado para controlar la visibilidad del modal de nueva publicación
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const community = communities.find((c) => c.id === id);

  // HU-12: Filtramos las publicaciones de esta comunidad desde el contexto global
  const communityPosts = posts.filter((post) => post.communityId === id);

  // Comunidad no encontrada (o eliminada)
  if (!community) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 py-24 text-center px-6">
        <span className="text-5xl">🏚️</span>
        <h1 className="text-2xl font-bold text-secondary">Comunidad no encontrada</h1>
        <p className="text-gray-400 text-sm">
          Es posible que haya sido eliminada o que el enlace no sea correcto.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/85 transition-colors cursor-pointer"
        >
          ← Volver a comunidades
        </button>
      </main>
    );
  }

  const isAdmin = community.adminId === currentUser.id;
  const isMember = community.memberIds.includes(currentUser.id);
  const adminUser = users.find((u) => u.id === community.adminId);
  const topicMeta = TOPICS[community.topic];

  // HU-03 — Solicitudes de unión registradas para esta comunidad
  const communityJoinRequests = joinRequests.filter((r) => r.communityId === community.id);
  const hasJoinRequest = communityJoinRequests.some((r) => r.userId === currentUser.id);

  // HU-03 — La solicitud solo se registra si el usuario NO es miembro todavía
  const handleJoin = () => {
    if (isMember || hasJoinRequest) return;
    requestJoin(community.id);
  };

  // HU-05: Función que ejecuta el abandono efectivo y cierra el modal
  const handleConfirmLeave = () => {
    leaveCommunity(community.id);
    setShowLeaveModal(false);
  };

  const handleDelete = () => {
    deleteCommunity(community.id);
    navigate('/');
  };

  // HU-13: Función que registra el nuevo logro y cierra el modal
  const handleCreatePost = (title: string, content: string) => {
    createPost(community.id, title, content);
    setShowCreatePostModal(false);
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

      {/* ── Breadcrumb ── */}
      <button
        onClick={() => navigate('/')}
        className="self-start flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Todas las comunidades
      </button>

      {/* ── Header de la comunidad ── */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 sm:p-8 flex flex-col gap-4 border border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            {/* Nombre + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-secondary">{community.name}</h1>
              {isAdmin && (
                <span className="text-xs font-bold bg-primary text-white rounded-full px-3 py-1">
                  Admin
                </span>
              )}
              {isMember && !isAdmin && (
                <span className="text-xs font-bold bg-green-100 text-green-700 rounded-full px-3 py-1">
                  Miembro
                </span>
              )}
            </div>

            {/* Temática + fecha */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-semibold rounded-full px-3 py-1 ${topicMeta.badgeCls}`}>
                {topicMeta.emoji} {topicMeta.label}
              </span>
              <span className="text-xs text-gray-400">
                Creada el {new Date(community.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-600 leading-relaxed mt-1 max-w-xl">
              {community.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 shrink-0">
            <div className="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-2 shadow-sm">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-bold text-primary">{community.members} miembros</span>
            </div>
            {adminUser && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                  {adminUser.name.split(' ').map((n) => n[0]).join('')}
                </div>
                Admin: <span className="font-semibold text-secondary">{adminUser.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Barra de acciones según rol ── */}
        <div className="border-t border-primary/10 pt-4 flex flex-wrap gap-3">
          {isAdmin ? (
            /* Vista: Admin */
            <>
              <button
                disabled
                title="Próximamente"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary border-2 border-primary/30 bg-white/60 rounded-xl opacity-60 cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Gestionar miembros
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 rounded-xl transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar comunidad
              </button>
            </>
          ) : isMember ? (
            /* HU-05: Vista: Miembro -> Abre el modal de confirmación */
            <button
              onClick={() => setShowLeaveModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 active:scale-95 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Abandonar comunidad
            </button>
          ) : (
            /* Vista: No miembro */
            hasJoinRequest ? (
              /* HU-03 — Solicitud ya registrada: estado pendiente */
              <button
                disabled
                title="Tu solicitud de unión está pendiente de aprobación por el administrador"
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-amber-700 border-2 border-amber-200 bg-amber-50 rounded-xl opacity-80 cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Solicitud enviada
              </button>
            ) : (
              /* HU-03 — Enviar solicitud de unión */
              <button
                onClick={handleJoin}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/85 active:scale-95 rounded-xl transition-all cursor-pointer shadow-sm shadow-primary/30"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Solicitar unirse
              </button>
            )
          )}
        </div>
      </div>

      {/* HU-03 — Solicitudes de unión pendientes (solo visibles para el admin) */}
      {isAdmin && communityJoinRequests.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-secondary">
              Solicitudes de unión pendientes ({communityJoinRequests.length})
            </h2>
          </div>

          <ul className="flex flex-col divide-y divide-gray-100">
            {communityJoinRequests.map((request) => {
              const applicant = users.find((u) => u.id === request.userId);
              return (
                <li key={request.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {applicant?.name.split(' ').map((n) => n[0]).join('') ?? '??'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-secondary">
                        {applicant?.name ?? 'Usuario desconocido'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Solicitó unirse el {new Date(request.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-3 py-1 shrink-0">
                    Pendiente
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Zona de publicaciones (HU-12 y HU-13) ── */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-secondary">Publicaciones</h2>

        {/* HU-13: Botón para publicar logro — solo visible si el usuario es miembro del foro */}
        {isMember && (
          <div
            onClick={() => setShowCreatePostModal(true)}
            className="flex items-center gap-3 bg-white border border-gray-200 hover:border-primary/40 rounded-xl p-4 shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 bg-gray-100 group-hover:bg-gray-200/70 rounded-lg px-4 py-2.5 text-sm text-gray-500 transition-colors">
              Comparte un logro con la comunidad…
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg group-hover:bg-primary/85 transition-colors cursor-pointer"
            >
              Publicar logro
            </button>
          </div>
        )}

        {/* HU-12 y HU-13: Listado dinámico de publicaciones del feed */}
        <PostList posts={communityPosts} users={users} />
      </div>

      {/* HU-13: Modal para crear una nueva publicación/logro */}
      {showCreatePostModal && (
        <CreatePostForm
          onSubmit={handleCreatePost}
          onClose={() => setShowCreatePostModal(false)}
        />
      )}

      {/* HU-05: Modal estilizado de confirmación para abandonar la comunidad */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 border border-gray-100">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-secondary">
                Abandonar comunidad
              </h2>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              ¿Estás seguro de que deseas salir de <span className="font-semibold text-secondary">{community.name}</span>? 
              Dejarás de tener acceso a las publicaciones exclusivas y funciones para miembros.
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg transition-all cursor-pointer shadow-sm shadow-red-200"
              >
                Sí, abandonar
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}