import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Community, CommunityTopic, JoinRequest, Post, FriendRequest, Challenge, ChallengeParticipation, Training, NewTraining, NewChallenge } from '../types/index.ts';
import initialUsers from '../data/users.json';
import initialCommunities from '../data/communities.json';
import initialPosts from '../data/posts.json';
import initialChallenges from '../data/challenges.json';
import initialParticipations from '../data/challengeParticipations.json';
import initialTrainings from '../data/trainings.json';
import { getCountedTrainings } from '../utils/challengeProgress.ts';
import { usePersistentState } from '../hooks/usePersistentState.ts';

// ── Tipos del contexto ──────────────────────────────────────────────────────

interface AppContextValue {
  // HU-07 — Inscripción y sincronización de entrenamientos (datos simulados)
  challenges: Challenge[];
  challengeParticipations: ChallengeParticipation[];
  trainings: Training[];
  joinChallenge: (challengeId: string) => void;
  createChallenge: (communityId: string, details: NewChallenge) => boolean;
  syncTraining: (training: Training) => void;
  registerTraining: (training: NewTraining) => void;

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

  //HU-04 - Acceptar o rechazar solicitudes
  acceptJoinRequest: (requestId: string, communityId: string, userId: string) => void;
  rejectJoinRequest: (requestId: string) => void;


  // HU-12 y HU-13 — Publicaciones / Logros del feed
  posts: Post[];
  createPost: (communityId: string, title: string, content: string) => void;

  // HU-17 — Solicitudes de amistad entre miembros
  friendRequests: FriendRequest[];
  sendFriendRequest: (receiverId: string) => void;
  cancelFriendRequest: (requestId: string) => void;
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
  // Solicitudes de amistad
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // HU-07: persistencia LOCAL para la demo; NO es una base de datos compartida.
  const [challenges, setChallenges] = usePersistentState<Challenge[]>(
    'healthy-life:hu07:challenges:v1', initialChallenges as Challenge[],
  );
  const [challengeParticipations, setChallengeParticipations] = usePersistentState<ChallengeParticipation[]>(
    'healthy-life:hu07:participations:v1', initialParticipations as ChallengeParticipation[],
  );
  const [trainings, setTrainings] = usePersistentState<Training[]>(
    'healthy-life:hu07:trainings:v1', initialTrainings as Training[],
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
   * HU-04 - Acceptar o rechazar solicitudes en la communidad
   */
  /**Acceptar miembros y quitar la solicitud de JoinRequests */

  const acceptJoinRequest = (requestId: string, communityId: string, userId: string) => {
    const targetCommunity = communities.find((c) => c.id === communityId);
    
    // Prueba : la communidad existe y estamos el admin
    if (!targetCommunity || targetCommunity.adminId !== currentUser.id) return;

    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          return {
            ...c,
            members: c.members + 1,
            memberIds: [...c.memberIds, userId],
          };
        }
        return c;
      })
    );
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  /** Rechazar una solicitud ; simple quita la solicitud de JoinRequest */
  const rejectJoinRequest = (requestId: string) => {
    const request = joinRequests.find((r) => r.id === requestId);
    if (!request) return;

    const targetCommunity = communities.find((c) => c.id === request.communityId);

    // Prueba : la communidad existe y estamos el admin
    if (!targetCommunity || targetCommunity.adminId !== currentUser.id) return;

    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
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

  /**
   * HU-17 — Enviar solicitud de amistad a otro miembro de la comunidad
   */
  const sendFriendRequest = (receiverId: string) => {
    if (receiverId === currentUser.id) return;

    // Verificar si ya existe una solicitud en cualquier sentido
    const existing = friendRequests.some(
      (r) =>
        (r.senderId === currentUser.id && r.receiverId === receiverId) ||
        (r.senderId === receiverId && r.receiverId === currentUser.id),
    );
    if (existing) return;

    const newRequest: FriendRequest = {
      id: `fr${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      createdAt: new Date().toISOString(),
    };

    setFriendRequests((prev) => [...prev, newRequest]);
  };

  /**
   * Cancelar una solicitud de amistad enviada
   */
  const cancelFriendRequest = (requestId: string) => {
    setFriendRequests((prev) =>
      prev.filter((r) => !(r.id === requestId && r.senderId === currentUser.id))
    );
  };

  /** Crear un reto exclusivamente en una comunidad a la que pertenece el usuario. */
  const createChallenge = (communityId: string, details: NewChallenge): boolean => {
    const community = communities.find((item) => item.id === communityId);
    const title = details.title.trim();
    const description = details.description.trim();
    const activities: NewChallenge['activityTypes'] = ['running', 'cycling', 'walking', 'strength'];
    if (!community?.memberIds.includes(currentUser.id)) return false;
    if (title.length < 3 || title.length > 80 || description.length < 10 || description.length > 300) return false;
    if (!Number.isInteger(details.target) || details.target < 1 || details.target > 500) return false;
    if (details.activityTypes.length !== 1 || !activities.includes(details.activityTypes[0])) return false;

    const id = `ch-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newChallenge: Challenge = {
      id, communityId, title, description, status: 'active',
      activityTypes: [...details.activityTypes], target: details.target,
    };
    setChallenges((prev) => [newChallenge, ...prev]);
    // El creador participa desde el mismo momento de creación.
    setChallengeParticipations((prev) => [...prev, {
      challengeId: id, userId: currentUser.id, joinedAt: new Date().toISOString(),
    }]);
    return true;
  };

  /** CHLS-59 — Inscribir una sola vez al usuario en un reto activo. */
  const joinChallenge = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge || challenge.status !== 'active') return;
    const community = communities.find((item) => item.id === challenge.communityId);
    if (!community?.memberIds.includes(currentUser.id)) return;
    if (getCountedTrainings(challenge, challengeParticipations, trainings).length >= challenge.target) return;
    const joinedAt = new Date().toISOString();

    setChallengeParticipations((prev) => {
      if (prev.some((p) => p.challengeId === challengeId && p.userId === currentUser.id)) return prev;
      return [...prev, { challengeId, userId: currentUser.id, joinedAt }];
    });
  };

  /** CHLS-60 — Sincroniza entrenamientos por su ID estable (idempotente). */
  const syncTraining = (training: Training) => {
    if (!training.id.trim() || !users.some((user) => user.id === training.userId)) return;
    if (!Number.isFinite(Date.parse(training.activityDate))) return;
    if (!Number.isFinite(training.durationMinutes) || training.durationMinutes <= 0) return;

    setTrainings((prev) => {
      if (prev.some((activity) => activity.id === training.id)) return prev;
      return [...prev, training];
    });
  };

  /** Simulador local; el módulo de Rutinas llamará a syncTraining con su propio ID. */
  const registerTraining = (training: NewTraining) => {
    syncTraining({
      id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      userId: currentUser.id,
      ...training,
    });
  };

  return (
    <AppContext.Provider
      value={{
        users, currentUser, switchUser,
        challenges, challengeParticipations, trainings, createChallenge, joinChallenge, syncTraining, registerTraining,
        communities, createCommunity, joinCommunity, leaveCommunity, deleteCommunity,
        joinRequests, requestJoin,
        posts, createPost,
        acceptJoinRequest,rejectJoinRequest,
        friendRequests, sendFriendRequest, cancelFriendRequest,
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