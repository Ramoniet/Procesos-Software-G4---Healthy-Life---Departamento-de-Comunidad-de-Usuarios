import type { Challenge, ChallengeParticipation, Training } from '../types/index.ts';

/**
 * HU-07 / CHLS-60: calcula el progreso colectivo a partir de entrenamientos.
 * - Solo cuentan los entrenamientos de usuarios inscritos.
 * - Deben ser compatibles y posteriores a la inscripción.
 * - Cada entrenamiento (id) cuenta una sola vez por reto.
 * - Una sesión equivale a una unidad de progreso (no a minutos).
 */
export function getCountedTrainings(
  challenge: Challenge,
  participations: ChallengeParticipation[],
  trainings: Training[],
): Training[] {
  const joiningTimes = new Map(
    participations
      .filter((p) => p.challengeId === challenge.id)
      .map((p) => [p.userId, Date.parse(p.joinedAt)]),
  );

  const seenIds = new Set<string>();
  return trainings.filter((training) => {
    if (seenIds.has(training.id)) return false;
    if (!challenge.activityTypes.includes(training.activityType)) return false;
    if (!Number.isFinite(training.durationMinutes) || training.durationMinutes <= 0) return false;

    const joinedAt = joiningTimes.get(training.userId);
    const trainedAt = Date.parse(training.activityDate);
    if (joinedAt === undefined || !Number.isFinite(joinedAt)) return false;
    if (!Number.isFinite(trainedAt) || trainedAt < joinedAt) return false;

    seenIds.add(training.id);
    return true;
  });
}
