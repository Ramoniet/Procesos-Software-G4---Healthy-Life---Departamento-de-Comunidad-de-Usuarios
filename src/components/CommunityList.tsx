import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComunityCard } from "./ComunityCard.tsx";
import { CreateCommunityForm } from "./CreateCommunityForm.tsx";
import { useApp } from "../app/AppContext.tsx";
import type { CommunityTopic } from "../types/index.ts";
import { TOPIC_LIST } from "../utils/topics.ts";

export function CommunityList() {
  const { communities, createCommunity, currentUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState<CommunityTopic | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (name: string, description: string, topic: CommunityTopic) => {
    createCommunity(name, description, topic);
    setShowForm(false);
  };

  const filtered = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = activeTopic === null || c.topic === activeTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <section className="p-6">
      {/* Toolbar: búsqueda + botón crear */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
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

      {/* Filtros por temática */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <button
          onClick={() => setActiveTopic(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
            activeTopic === null
              ? 'bg-secondary text-white border-secondary'
              : 'border-gray-200 text-gray-500 hover:border-gray-400'
          }`}
        >
          Todas
        </button>
        {TOPIC_LIST.map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setActiveTopic(activeTopic === key ? null : key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
              activeTopic === key
                ? `${meta.badgeCls} border-transparent`
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            <span>{meta.emoji}</span>
            {meta.label}
          </button>
        ))}
      </div>

      {/* Grid de tarjetas */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((community) => (
            <ComunityCard
              key={community.id}
              name={community.name}
              description={community.description}
              topic={community.topic}
              members={community.members}
              isAdmin={community.adminId === currentUser.id}
              isMember={community.memberIds.includes(currentUser.id)}
              onViewDetails={() => navigate(`/comunidad/${community.id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12">
          No se encontraron comunidades.
        </p>
      )}

      {/* Modal: formulario de creación */}
      {showForm && (
        <CreateCommunityForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </section>
  );
}
