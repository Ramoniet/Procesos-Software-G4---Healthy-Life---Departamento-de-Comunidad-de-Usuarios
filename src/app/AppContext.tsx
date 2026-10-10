import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Community, CommunityTopic, JoinRequest, Post } from '../types/index.ts';
import initialUsers from '../data/users.json';
import initialCommunities from '../data/communities.json';
import initialPosts from '../data/posts.json';

// ── Tipos del contexto ──────────────────────────────────────────────────────

interface AppContextValue {
  // Usuarios
  users: User[];
  currentUser: User;
  switchUser: (userId: string) => void;

  // Comunidades
  communities: Community[];
  createCommunity: (name: string, description: string, topic: CommunityTopic) => void;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  deleteCommunity: (communityId: string) => void;

  // HU-03 — Solicitudes de unión a comunidades
  joinRequests: JoinRequest[];
  requestJoin: (communityId: string) => void;

  // HU-12 y HU-13 — Publicaciones / Logros del feed
  posts: Post[];
  createPost: (communityId: string, title: string, content: string) => void;
}

// ── Creación del contexto ──────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers as User[]);
  const [communities, setCommunities] = useState<Community[]>(
    initialCommunities as Community[],
  );
  // HU-03
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  // HU-12 y HU-13
  const [posts, setPosts] = useState<Post[]>(initialPosts as Post[]);

  // El usuario "logueado" — empieza siendo el primero del JSON
  const [currentUserId, setCurrentUserId] = useState<string>(initialUsers[0].id);
  const currentUser = users.find((u) => u.id === currentUserId)!;

  /** Cambia el usuario activo (solo para pruebas) */
  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  /**
   * Crea una nueva comunidad con temática y convierte al usuario actual en admin
   * si aún no tiene ese rol.
   */
  const createCommunity = (name: string, description: string, topic: CommunityTopic) => {
    const newCommunity: Community = {
      id: `c${Date.now()}`,
      name,
      description,
      topic,
      members: 1,
      adminId: currentUser.id,
      memberIds: [currentUser.id],
      createdAt: new Date().toISOString(),
    };

    setCommunities((prev) => [...prev, newCommunity]);

    if (currentUser.role !== 'admin') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id ? { ...u, role: 'admin' as const } : u,
        ),
      );
    }
  };

  /** Une al usuario actual a una comunidad existente. */
  const joinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id !== communityId || c.memberIds.includes(currentUser.id)) return c;
        return { ...c, members: c.members + 1, memberIds: [...c.memberIds, currentUser.id] };
      }),
    );
  };

  /** El usuario actual abandona una comunidad (no es admin). */
  const leaveCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id !== communityId || !c.memberIds.includes(currentUser.id)) return c;
        return {
          ...c,
          members: Math.max(0, c.members - 1),
          memberIds: c.memberIds.filter((id) => id !== currentUser.id),
        };
      }),
    );
  };

  /** El admin elimina la comunidad por completo. */
  const deleteCommunity = (communityId: string) => {
    setCommunities((prev) => prev.filter((c) => c.id !== communityId));
  };

  /**
   * HU-03 — Registra la solicitud de unión del usuario actual a una comunidad.
   */
  const requestJoin = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId);
    if (!community) return;

    if (community.memberIds.includes(currentUser.id)) return;

    const alreadyRequested = joinRequests.some(
      (r) => r.communityId === communityId && r.userId === currentUser.id,
    );
    if (alreadyRequested) return;

    const newRequest: JoinRequest = {
      id: `jr${Date.now()}`,
      communityId,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setJoinRequests((prev) => [...prev, newRequest]);
  };

  /**
   * HU-13 — Publicar logros propios en el feed.
   * Verifica que el usuario forme parte del foro/comunidad y añade la nueva
   * publicación al principio del feed para que se vea inmediatamente.
   */
  const createPost = (communityId: string, title: string, content: string) => {
    const community = communities.find((c) => c.id === communityId);
    if (!community) return;

    // Criterio de aceptación: Dado que el usuario forma parte del foro
    if (!community.memberIds.includes(currentUser.id)) return;

    const newPost: Post = {
      id: `p${Date.now()}`,
      communityId,
      authorId: currentUser.id,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Añadimos el nuevo logro al inicio para que aparezca el primero en el feed
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        users, currentUser, switchUser,
        communities, createCommunity, joinCommunity, leaveCommunity, deleteCommunity,
        joinRequests, requestJoin,
        posts, createPost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Hook de acceso ─────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}