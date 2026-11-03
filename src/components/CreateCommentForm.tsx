//HU-14 commentarios

import { useState } from 'react';

interface CreateCommentFormProps {
  onSubmit: (content: string) => void;
}

export function CreateCommentForm({
  onSubmit,
}: CreateCommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSubmit(content.trim());

    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe un comentario..."
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
      />

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-lg"
      >
        Comentar
      </button>
    </form>
  );
}