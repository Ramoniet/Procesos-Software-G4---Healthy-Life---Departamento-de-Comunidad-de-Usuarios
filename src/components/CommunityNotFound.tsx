import { useNavigate } from 'react-router-dom';

export function CommunityNotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 py-24 text-center px-6">
      <span className="text-5xl">🏚️</span>
      <h1 className="text-2xl font-bold text-secondary">Comunidad no encontrada</h1>
      <p className="text-gray-400 text-sm">
        Es posible que haya sido eliminada o que el enlace no sea correcto.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/85 transition-colors cursor-pointer"
      >
        ← Volver a comunidades
      </button>
    </main>
  );
}
