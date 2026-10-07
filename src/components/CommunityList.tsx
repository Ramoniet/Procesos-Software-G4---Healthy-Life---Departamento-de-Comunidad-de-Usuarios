import { useState } from "react";
import { ComunityCard, type ComunityCardProps } from "./ComunityCard.tsx";
import { CreateCommunityForm } from "./CreateCommunityForm.tsx";

export function CommunityList() {
  const MOCK_COMMUNITIES: ComunityCardProps[] = [];

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [comunity, setComunity] = useState<ComunityCardProps[]>(MOCK_COMMUNITIES);
  const handleCreate = (community: ComunityCardProps) => {
    setComunity([...comunity, community]);
    setShowForm(false);
  };
  const filtered = comunity.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="p-6">
      {/* Toolbar: búsqueda + botón crear */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-secondary">
          Todas las comunidades
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar comunidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 w-full sm:w-64"
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/85 text-white font-medium rounded-lg px-5 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            + Crear comunidad
          </button>
        </div>
      </div>

      {/* Grid de tarjetas */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((community) => (
            <ComunityCard
              key={community.name}
              name={community.name}
              description={community.description}
              members={community.members}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12">
          No se encontraron comunidades.
        </p>
      )}
      {
        showForm && (
          <CreateCommunityForm
            onSubmit={handleCreate}
            onClose={() => setShowForm(false)}
          />
        )
      }
    </section>
  );
}
