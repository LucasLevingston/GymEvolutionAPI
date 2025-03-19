import { prisma } from '../../lib/prisma';
import { createHistoryEntry } from '../history/create-history-entry';
import { ClientError } from '../../errors/client-error';

interface UpdateTrainingWeekParams {
  weekNumber?: number;
  information?: string;
  done?: boolean;
}

export async function updateTrainingWeek(id: string, data: UpdateTrainingWeekParams) {
  const trainingWeek = await prisma.trainingWeek.findUnique({
    where: { id },
  });

  if (!trainingWeek) {
    throw new ClientError('Training week not found');
  }

  // Update the training week
  const updatedTrainingWeek = await prisma.trainingWeek.update({
    where: { id },
    data,
  });

  // Create history entry
  await createHistoryEntry(
    trainingWeek.userId,
    `Training week ${trainingWeek.weekNumber} updated`
  );

  return updatedTrainingWeek;
}
