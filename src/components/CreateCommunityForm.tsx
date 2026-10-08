import { useState } from "react";
import type { CommunityTopic } from "../types/index.ts";
import { TOPIC_LIST } from "../utils/topics.ts";

interface CreateCommunityFormProps {
  onSubmit: (name: string, description: string, topic: CommunityTopic) => void;
  onClose: () => void;
}

export function CreateCommunityForm({ onSubmit, onClose }: CreateCommunityFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState<CommunityTopic>("nutricion");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    onSubmit(name.trim(), description.trim(), topic);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-secondary">Crear nueva comunidad</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Ej. Runners Madrid"
              required
            />
          </div>

          {/* Temática */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temática
            </label>
            <div className="flex gap-2 flex-wrap">
              {TOPIC_LIST.map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTopic(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all cursor-pointer ${
                    topic === key
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-primary/40'
                  }`}
                >
                  <span>{meta.emoji}</span>
                  {meta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none h-24"
              placeholder="¿De qué trata esta comunidad?"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/85 rounded-lg transition-colors cursor-pointer"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
