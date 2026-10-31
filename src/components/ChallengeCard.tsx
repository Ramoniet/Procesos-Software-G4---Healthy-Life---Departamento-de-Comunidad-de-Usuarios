import { Link } from 'react-router-dom';
import { useApp } from '../app/AppContext.tsx';
import type { ActivityType, Challenge } from '../types/index.ts';
import { getCountedTrainings } from '../utils/challengeProgress.ts';

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  running: 'Carrera',
  cycling: 'Ciclismo',
  walking: 'Caminata',
  strength: 'Fuerza',
};

interface ChallengeCardProps {
  challenge: Challenge;
  showCommunityLink?: boolean;
}

export function ChallengeCard({ challenge, showCommunityLink = false }: ChallengeCardProps) {
  const { communities, currentUser, challengeParticipations, trainings, joinChallenge } = useApp();
  const community = communities.find((item) => item.id === challenge.communityId);
  const isCommunityMember = community?.memberIds.includes(currentUser.id) ?? false;
  const countedTrainings = getCountedTrainings(challenge, challengeParticipations, trainings);
  const progress = Math.min(countedTrainings.length, challenge.target);
  const percentage = Math.round((progress / challenge.target) * 100);
  const participantIds = new Set(
    challengeParticipations.filter((item) => item.challengeId === challenge.id).map((item) => item.userId),
  );
  const hasJoined = participantIds.has(currentUser.id);
  const isCompleted = challenge.status === 'completed' || progress >= challenge.target;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-secondary">{challenge.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isCompleted ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
        }`}>{isCompleted ? 'Finalizado' : 'Activo'}</span>
      </div>
      <p className="text-sm text-gray-600">{challenge.description}</p>
      {showCommunityLink && community && (
        <Link className="text-sm text-primary hover:underline" to={`/comunidad/${community.id}`}>
          Comunidad: {community.name}
        </Link>
      )}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-secondary">Progreso colectivo</span>
          <span>{progress} / {challenge.target} sesiones</span>
        </div>
        <div
          role="progressbar"
          aria-label={`Progreso de ${challenge.title}`}
          aria-valuemin={0}
          aria-valuemax={challenge.target}
          aria-valuenow={progress}
          className="h-3 overflow-hidden rounded-full bg-gray-100"
        >
          <div className="h-full rounded-full bg-tertiary transition-all" style={{ width: `${percentage}%` }} />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Actividad: {challenge.activityTypes.map((type) => ACTIVITY_LABELS[type]).join(', ')} · {participantIds.size} participantes
        </p>
      </div>
      <button
        type="button"
        onClick={() => joinChallenge(challenge.id)}
        disabled={hasJoined || isCompleted || !isCommunityMember}
        className="self-start cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/85 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        {hasJoined ? 'Ya participas' : isCompleted ? 'Inscripción cerrada' : !isCommunityMember ? 'Solo miembros' : 'Unirme al reto'}
      </button>
    </article>
  );
}
