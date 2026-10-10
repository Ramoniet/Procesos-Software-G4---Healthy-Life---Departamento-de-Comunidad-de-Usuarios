import { useState } from 'react';

// HU-13: Formulario modal para publicar un nuevo logro en el feed
interface CreatePostFormProps {
  onSubmit: (title: string, content: string) => void;
  onClose: () => void;
}

export function CreatePostForm({ onSubmit, onClose }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit(title.trim(), content.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-1 text-secondary">
          Publicar nuevo logro 🏆
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Comparte tus avances y situación actual con el resto de la comunidad.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Título del logro */}
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-1">
              Título del logro
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Ej. ¡Mi primer mes entrenando sin faltar!"
              required
            />
          </div>

          {/* Contenido / Descripción */}
          <div>
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none h-28"
              placeholder="Cuéntale a la comunidad qué has conseguido y cómo te sientes..."
              required
            />
          </div>

          {/* Botones de acción */}
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
              Publicar logro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}