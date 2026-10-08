import type { CommunityTopic } from '../types/index.ts';
import { TOPICS } from '../utils/topics.ts';

export interface ComunityCardProps {
  name: string;
  description: string;
  topic: CommunityTopic;
  members: number;
  isAdmin?: boolean;
  isMember?: boolean;
  onViewDetails?: () => void;
}

export function ComunityCard({
  name,
  description,
  topic,
  members,
  isAdmin = false,
  isMember = false,
  onViewDetails,
}: ComunityCardProps) {
  const topicMeta = TOPICS[topic];

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col gap-3">
      {/* Cabecera: nombre + badges de rol */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold text-secondary leading-tight">{name}</h2>
        <div className="flex items-center gap-1.5 shrink-0">
          {isAdmin && (
            <span className="text-xs font-semibold bg-primary/15 text-primary rounded-full px-2 py-0.5">
              Admin
            </span>
          )}
          {isMember && !isAdmin && (
            <span className="text-xs font-semibold bg-green-100 text-green-700 rounded-full px-2 py-0.5">
              Miembro
            </span>
          )}
        </div>
      </div>

      {/* Badge de temática */}
      <span className={`self-start text-xs font-semibold rounded-full px-2.5 py-0.5 ${topicMeta.badgeCls}`}>
        {topicMeta.emoji} {topicMeta.label}
      </span>

      {/* Descripción */}
      <p className="text-sm text-gray-500 flex-1 line-clamp-3">{description}</p>

      {/* Footer: miembros + botón */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="bg-primary/10 text-primary font-medium rounded-full px-3 py-1 text-xs">
          {members} miembros
        </span>
        <button
          onClick={onViewDetails}
          className="text-xs font-medium text-primary hover:text-primary/70 underline underline-offset-2 transition-colors cursor-pointer"
        >
          Ver detalles →
        </button>
      </div>
    </div>
  );
}