import { useState } from 'react';
import { useApp } from '../app/AppContext.tsx';
import type { NewChallenge } from '../types/index.ts';
import { ChallengeCard } from './ChallengeCard.tsx';
import { CreateChallengeForm } from './CreateChallengeForm.tsx';
import { TrainingSimulator } from './TrainingSimulator.tsx';

export function CommunityChallenges({ communityId }: { communityId: string }) {
  const { challenges, communities, currentUser, createChallenge } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const community = communities.find((item) => item.id === communityId);
  const isMember = community?.memberIds.includes(currentUser.id) ?? false;
  const communityChallenges = challenges.filter((item) => item.communityId === communityId);

  const handleCreate = (details: NewChallenge) => createChallenge(communityId, details);

  return (
    <section className="flex flex-col gap-5" aria-label="Retos colectivos de la comunidad">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-secondary">Retos colectivos</h2>
          <p className="text-sm text-gray-500">Cumplid objetivos de actividad física entre todos los participantes.</p>
        </div>
        {isMember && (
          <button type="button" onClick={() => setShowCreate(true)} className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/85">
            + Crear reto colectivo
          </button>
        )}
      </div>

      {!isMember && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">
          Puedes consultar los retos, pero necesitas pertenecer a esta comunidad para crear uno o inscribirte.
          Solicita unirte a la comunidad desde la parte superior de la página.
        </p>
      )}

      {communityChallenges.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {communityChallenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="font-semibold text-secondary">Todavía no hay retos en esta comunidad.</p>
          <p className="mt-1 text-sm text-gray-500">{isMember ? '¡Crea el primero para empezar a entrenar juntos!' : 'Cuando se cree un reto, aparecerá aquí.'}</p>
        </div>
      )}

      {isMember && <TrainingSimulator />}
      {showCreate && isMember && <CreateChallengeForm onCreate={handleCreate} onClose={() => setShowCreate(false)} />}
    </section>
  );
}
