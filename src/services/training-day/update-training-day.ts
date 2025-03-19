import { prisma } from '../../lib/prisma';
import { createHistoryEntry } from '../history/create-history-entry';
import { ClientError } from '../../errors/client-error';

interface UpdateTrainingDayParams {
  group?: string;
  dayOfWeek?: string;
  comments?: string;
}

export async function updateTrainingDay(id: string, data: UpdateTrainingDayParams) {
  const trainingDay = await prisma.trainingDay.findUnique({
    where: { id },
    include: {
      trainingWeek: true,
    },
  });

  if (!trainingDay || !trainingDay.trainingWeek) {
    throw new ClientError('Training day not found');
  }

  const updatedTrainingDay = await prisma.trainingDay.update({
    where: { id },
    data,
  });

  await createHistoryEntry(
    trainingDay.trainingWeek.userId!,
    `Training day for ${trainingDay.group} updated`
  );

  return updatedTrainingDay;
}
