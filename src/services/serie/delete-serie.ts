import { prisma } from '../../lib/prisma';
import { createHistoryEntry } from '../history/create-history-entry';
import { ClientError } from '../../errors/client-error';

export async function deleteSerie(id: string) {
  const serie = await prisma.serie.findUnique({
    where: { id },
    include: {
      exercise: {
        include: {
          trainingDay: {
            include: {
              trainingWeek: true,
            },
          },
        },
      },
    },
  });

  if (!serie || !serie.exercise || !serie.exercise.trainingDay) {
    throw new ClientError('Serie not found');
  }

  await prisma.serie.delete({
    where: { id },
  });

  await createHistoryEntry(
    serie.exercise.trainingDay.trainingWeek.userId,
    `Series ${serie.seriesIndex || 0 + 1} deleted for exercise ${serie.exercise.name}`
  );

  return true;
}
