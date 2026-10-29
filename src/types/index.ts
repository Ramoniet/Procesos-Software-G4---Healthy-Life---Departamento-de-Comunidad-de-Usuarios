// Tipos base del dominio

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  friendIds: string[]; // HU-20 — IDs de los usuarios con los que tiene amistad ("Amigos")
}

// Temáticas de salud y bienestar disponibles en el prototipo
export type CommunityTopic = 'nutricion' | 'ejercicio' | 'bienestar-mental';

export interface Community {
  id: string;
  name: string;
  description: string;
  topic: CommunityTopic;
  members: number;
  adminId: string;     // ID del usuario que creó/administra la comunidad
  memberIds: string[]; // IDs de todos los miembros (incluido el admin)
  createdAt: string;   // ISO date string
}
//HU-12
export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
}
//HU-03
export interface JoinRequest {
  id: string;
  communityId: string;
  userId: string;   // Usuario que solicita unirse a la comunidad
  createdAt: string; // ISO date string
}

// HU-17 — Solicitudes de amistad entre miembros de la comunidad
export interface FriendRequest {
  id: string;
  senderId: string;    // ID del usuario que envía la solicitud
  receiverId: string;  // ID del usuario destinatario
  createdAt: string;   // ISO date string
}
