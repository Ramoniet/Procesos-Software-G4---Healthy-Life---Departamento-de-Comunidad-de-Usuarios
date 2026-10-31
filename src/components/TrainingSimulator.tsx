import { useState, type FormEvent } from 'react';
import { useApp } from '../app/AppContext.tsx';
import type { ActivityType } from '../types/index.ts';
import { ACTIVITY_LABELS } from './ChallengeCard.tsx';

export function TrainingSimulator() {
  const { registerTraining } = useApp();
  const [activityType, setActivityType] = useState<ActivityType>('running');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) return;
    registerTraining({ activityType, durationMinutes, activityDate: new Date().toISOString() });
    setMessage('Entrenamiento registrado. Se ha actualizado el progreso de los retos compatibles en los que participas.');
  };

  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <h3 className="text-lg font-bold text-secondary">Probar entrenamientos (simulador)</h3>
      <p className="mb-4 mt-1 text-sm text-gray-600">
        Mientras se conecta el módulo real de entrenamientos, puedes registrar uno de prueba y comprobar cómo suma al reto.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-semibold text-secondary">
          Actividad
          <select value={activityType} onChange={(e) => { setActivityType(e.target.value as ActivityType); setMessage(''); }} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal">
            {Object.entries(ACTIVITY_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <label className="flex-1 text-sm font-semibold text-secondary">
          Duración (minutos)
          <input required type="number" min={1} step={1} value={durationMinutes} onChange={(e) => { setDurationMinutes(Number(e.target.value)); setMessage(''); }} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal" />
        </label>
        <button type="submit" className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/85">Registrar prueba</button>
      </form>
      {message && <p role="status" className="mt-3 text-sm text-tertiary">{message}</p>}
      <p className="mt-3 text-xs text-gray-500">Datos de demostración guardados solo en este navegador. No son entrenamientos reales ni se comparten con otros usuarios.</p>
    </section>
  );
}
