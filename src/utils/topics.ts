import type { CommunityTopic } from '../types/index.ts';

export interface TopicMeta {
  label: string;
  emoji: string;
  /** Clases Tailwind para el badge en la tarjeta/detalle */
  badgeCls: string;
}

export const TOPICS: Record<CommunityTopic, TopicMeta> = {
  nutricion: {
    label: 'Nutrición',
    emoji: '🥦',
    badgeCls: 'bg-emerald-100 text-emerald-700',
  },
  ejercicio: {
    label: 'Ejercicio',
    emoji: '🏋️',
    badgeCls: 'bg-orange-100 text-orange-700',
  },
  'bienestar-mental': {
    label: 'Bienestar Mental',
    emoji: '🧠',
    badgeCls: 'bg-violet-100 text-violet-700',
  },
};

/** Lista ordenada para selects / filtros */
export const TOPIC_LIST = Object.entries(TOPICS) as [CommunityTopic, TopicMeta][];
