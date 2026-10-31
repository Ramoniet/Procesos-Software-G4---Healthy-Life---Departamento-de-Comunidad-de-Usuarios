import { useState, type FormEvent } from 'react';
import type { ActivityType, NewChallenge } from '../types/index.ts';
import { ACTIVITY_LABELS } from './ChallengeCard.tsx';

interface CreateChallengeFormProps {
  onCreate: (challenge: NewChallenge) => boolean;
  onClose: () => void;
}

export function CreateChallengeForm({ onCreate, onClose }: CreateChallengeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('running');
  const [target, setTarget] = useState(10);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (title.trim().length < 3 || description.trim().length < 10 || !Number.isInteger(target) || target < 1 || target > 500) {
      setError('Comprueba el título (mínimo 3 caracteres), la descripción (mínimo 10) y la meta (entre 1 y 500).');
      return;
    }
    const created = onCreate({
      title: title.trim(),
      description: description.trim(),
      activityTypes: [activityType],
      target,
    });
    if (created) onClose();
    else setError('No se ha podido crear el reto. Comprueba que sigues siendo miembro de esta comunidad.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="new-challenge-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="new-challenge-title" className="text-xl font-bold text-secondary">Crear reto colectivo</h2>
            <p className="mt-1 text-sm text-gray-500">Los miembros podrán unirse y sumar sus entrenamientos.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar formulario" className="cursor-pointer rounded-lg px-2 py-1 text-xl text-gray-500 hover:bg-gray-100">×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-secondary">
            Nombre del reto
            <input required minLength={3} maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: 20 carreras entre todos" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold text-secondary">
            Descripción
            <textarea required minLength={10} maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Explica la meta que queréis conseguir..." className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-secondary">
              Actividad compatible
              <select value={activityType} onChange={(e) => setActivityType(e.target.value as ActivityType)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal">
                {Object.entries(ACTIVITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-secondary">
              Meta (n.º de sesiones)
              <input required type="number" min={1} max={500} step={1} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
            </label>
          </div>
          <p className="text-xs text-gray-500">El creador quedará inscrito automáticamente. Cada entrenamiento compatible cuenta como una sesión.</p>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-secondary">Cancelar</button>
            <button type="submit" className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/85">Crear reto</button>
          </div>
        </form>
      </section>
    </div>
  );
}
