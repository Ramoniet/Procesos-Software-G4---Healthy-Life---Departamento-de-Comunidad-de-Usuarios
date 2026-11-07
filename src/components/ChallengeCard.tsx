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
  
  // HU-08: Obtención del progreso acumulado y cálculo del porcentaje respecto al objetivo total
  const countedTrainings = getCountedTrainings(challenge, challengeParticipations, trainings);
  const progress = Math.min(countedTrainings.length, challenge.target);
  const percentage = Math.round((progress / challenge.target) * 100);
  
  const participantIds = new Set(
    challengeParticipations.filter((item) => item.challengeId === challenge.id).map((item) => item.userId),
  );
  const hasJoined = participantIds.has(currentUser.id);
  const isCompleted = challenge.status === 'completed' || progress >= challenge.target;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-secondary">{challenge.title}</h3>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
          isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
        }`}>{isCompleted ? 'Finalizado' : 'Activo'}</span>
      </div>
      
      <p className="text-sm text-gray-600 leading-relaxed">{challenge.description}</p>
      
      {challenge.deadline && (
        <p className="text-sm text-gray-500 font-medium">
          📅 Límite: <time dateTime={challenge.deadline}>{new Date(`${challenge.deadline}T00:00:00`).toLocaleDateString('es-ES')}</time>
        </p>
      )}
      
      {showCommunityLink && community && (
        <Link className="text-sm font-semibold text-primary hover:underline" to={`/comunidad/${community.id}`}>
          👥 Comunidad: {community.name}
        </Link>
      )}
      
      {/* HU-08: Visualizar el progreso compartido del reto */}
      <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <span className="flex items-center gap-1.5 font-bold text-secondary">
              <svg className="h-5 w-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Progreso colectivo
            </span>
            <p className="mt-1 text-xs font-medium text-gray-500">
              {challenge.activityTypes.map((type) => ACTIVITY_LABELS[type]).join(', ')} · {participantIds.size} participantes
            </p>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-black text-tertiary leading-none">{percentage}%</span>
            <span className="text-xs font-bold text-gray-400" aria-label={`${progress} de ${challenge.target} sesiones completadas`}>
              {progress} / {challenge.target} sesiones
            </span>
          </div>
        </div>
        
        <div
          role="progressbar"
          aria-label={`Barra de progreso de ${challenge.title}`}
          aria-valuemin={0}
          aria-valuemax={challenge.target}
          aria-valuenow={progress}
          className="h-3 overflow-hidden rounded-full bg-gray-200 shadow-inner"
          title={`${percentage}% completado`}
        >
          <div 
            className="relative h-full rounded-full bg-tertiary transition-all duration-700 ease-out" 
            style={{ width: `${percentage}%` }} 
          >
            {/* Efecto de brillo sutil en la barra */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
      {/* Fin HU-08 */}

      <button
        type="button"
        onClick={() => joinChallenge(challenge.id)}
        disabled={hasJoined || isCompleted || !isCommunityMember}
        className="mt-1 self-start cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
      >
        {hasJoined ? '✓ Ya participas' : isCompleted ? '🔒 Inscripción cerrada' : !isCommunityMember ? '🔒 Solo miembros' : 'Unirme al reto'}
      </button>
    </article>
  );
}