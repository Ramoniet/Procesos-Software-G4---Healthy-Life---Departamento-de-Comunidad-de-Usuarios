import { Link } from 'react-router-dom';
import { useApp } from '../app/AppContext.tsx';
import { ChallengeCard } from '../components/ChallengeCard.tsx';
import { TrainingSimulator } from '../components/TrainingSimulator.tsx';

/** Vista global opcional; los retos se crean desde la pestaña Retos de cada comunidad. */
export function ChallengesPage() {
  const { challenges, currentUser } = useApp();
  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-7">
      <div>
        <Link to="/" className="text-sm text-primary hover:underline">← Volver a comunidades</Link>
        <h1 className="mt-2 text-3xl font-bold text-secondary">Retos colectivos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Consulta los retos del proyecto. Para crear uno, entra en una comunidad y abre su pestaña «Retos».
        </p>
        <p className="mt-2 text-xs text-gray-500">Usuario seleccionado: {currentUser.name}</p>
      </div>
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2" aria-label="Retos disponibles">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} showCommunityLink />
        ))}
      </section>
      <TrainingSimulator />
    </main>
  );
}
