import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ComunityCard } from "./ComunityCard.tsx";
import { CreateCommunityForm } from "./CreateCommunityForm.tsx";
import { CommunityToolbar } from "./CommunityToolbar.tsx";
import { TopicFilter } from "./TopicFilter.tsx";
import { Pagination } from "./Pagination.tsx";
import { useApp } from "../app/AppContext.tsx";
import type { CommunityTopic } from "../types/index.ts";

export function CommunityList() {
  const { communities, createCommunity, currentUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState<CommunityTopic | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Configuración de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Resetear a la página 1 cuando el usuario escribe o cambia de filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTopic]);

  const handleCreate = (name: string, description: string, topic: CommunityTopic) => {
    if (currentUser.role !== 'admin') return;
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

  // Lógica de recorte de array para la paginación
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedCommunities = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="p-6">
      {/* Toolbar: búsqueda + botón crear */}
      <CommunityToolbar
        search={search}
        onSearchChange={setSearch}
        canCreateCommunity={currentUser.role === 'admin'}
        onCreateCommunityClick={() => setShowForm(true)}
      />

      {/* Filtros por temática */}
      <TopicFilter
        activeTopic={activeTopic}
        onSelectTopic={setActiveTopic}
      />

      {/* Grid de tarjetas paginado */}
      {paginatedCommunities.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedCommunities.map((community) => (
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

          {/* Controles de Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12">
          No se encontraron comunidades.
        </p>
      )}

      {/* Modal: formulario de creación */}
      {showForm && currentUser.role === 'admin' && (
        <CreateCommunityForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </section>
  );
}
