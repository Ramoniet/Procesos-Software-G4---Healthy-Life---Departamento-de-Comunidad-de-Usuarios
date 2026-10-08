import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../app/AppContext.tsx';
import { TOPICS } from '../utils/topics.ts';

export function CommunityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { communities, currentUser, users, joinCommunity, deleteCommunity } = useApp();

  const community = communities.find((c) => c.id === id);

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

  const isAdmin  = community.adminId === currentUser.id;
  const isMember = community.memberIds.includes(currentUser.id);
  const adminUser = users.find((u) => u.id === community.adminId);
  const topicMeta = TOPICS[community.topic];

  const handleJoin = () => {
    joinCommunity(community.id);
  };

  const handleDelete = () => {
    deleteCommunity(community.id);
    navigate('/');
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
            /* Vista: Miembro */
            <button
              disabled
              title="Próximamente"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 border-2 border-gray-200 bg-white/60 rounded-xl opacity-60 cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Abandonar comunidad
            </button>
          ) : (
            /* Vista: No miembro */
            <button
              onClick={handleJoin}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/85 active:scale-95 rounded-xl transition-all cursor-pointer shadow-sm shadow-primary/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Unirse a la comunidad
            </button>
          )}
        </div>
      </div>

      {/* ── Zona reservada para publicaciones ── */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-secondary">Publicaciones</h2>

        {/* Placeholder de "nueva publicación" — solo para miembros */}
        {isMember && (
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm opacity-60 cursor-not-allowed select-none">
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-400">
              Comparte algo con la comunidad… (próximamente)
            </div>
          </div>
        )}

        {/* Feed vacío */}
        <div className="flex flex-col items-center justify-center gap-3 py-16 border-2 border-dashed border-gray-200 rounded-2xl text-center">
          <span className="text-4xl">📝</span>
          <p className="text-gray-400 font-medium text-sm">
            Aún no hay publicaciones en esta comunidad.
          </p>
          <p className="text-gray-300 text-xs">
            Las publicaciones aparecerán aquí cuando se implementen.
          </p>
        </div>
      </div>

    </main>
  );
}
