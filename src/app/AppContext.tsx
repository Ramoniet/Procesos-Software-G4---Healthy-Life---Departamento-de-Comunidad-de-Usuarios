import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Community, CommunityTopic } from '../types/index.ts';
import initialUsers from '../data/users.json';
import initialCommunities from '../data/communities.json';

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
}

// ── Creación del contexto ──────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers as User[]);
  const [communities, setCommunities] = useState<Community[]>(
    initialCommunities as Community[],
  );

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

  return (
    <AppContext.Provider
      value={{
        users, currentUser, switchUser,
        communities, createCommunity, joinCommunity, leaveCommunity, deleteCommunity,
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
