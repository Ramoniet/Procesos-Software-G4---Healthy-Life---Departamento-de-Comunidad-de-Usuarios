import { useNavigate } from 'react-router-dom';

interface CommunityToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  canCreateCommunity: boolean;
  onCreateCommunityClick: () => void;
}

export function CommunityToolbar({
  search,
  onSearchChange,
  canCreateCommunity,
  onCreateCommunityClick,
}: CommunityToolbarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <h1 className="text-2xl font-semibold text-secondary">
        Todas las comunidades
      </h1>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Buscar comunidad..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 w-full sm:w-64"
        />
        <button
          onClick={() => navigate('/retos')}
          className="border border-primary text-primary hover:bg-primary/10 font-medium rounded-lg px-5 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          Retos colectivos
        </button>
        {canCreateCommunity && (
          <button
            onClick={onCreateCommunityClick}
            className="bg-primary hover:bg-primary/85 text-white font-medium rounded-lg px-5 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            + Crear comunidad
          </button>
        )}
      </div>
    </div>
  );
}
