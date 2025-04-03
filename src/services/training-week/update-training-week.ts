import { Exercise, TrainingDay } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { getTrainingWeekById } from './get-training-week-by-id'

interface UpdateTrainingWeekParams {
  weekNumber?: number
  information?: string
  done?: boolean
  startDate?: Date
  endDate?: Date
  isCompleted?: boolean
  userId?: string
  trainingDays?: TrainingDay[]
}

export async function updateTrainingWeek(id: string, data: UpdateTrainingWeekParams) {
  const existingTrainingWeek = await getTrainingWeekById(id)

  const updatedTrainingWeek = await prisma.trainingWeek.update({
    where: { id },
    data: {
      weekNumber: data.weekNumber,
      information: data.information,
      isCompleted: data.isCompleted ?? data.done,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      trainingDays: {
        upsert:
          data.trainingDays?.map((trainingDay) => ({
            where: { id: trainingDay.id },
            create: {
              group: trainingDay.group,
              dayOfWeek: trainingDay.dayOfWeek,
              isCompleted: trainingDay.isCompleted,
              comments: trainingDay.comments,
              exercises: {
                create:
                  trainingDay.exercises?.map((exercise: Exercise) => ({
                    name: exercise.name,
                    variation: exercise.variation,
                    repetitions: exercise.repetitions,
                    sets: exercise.sets,
                    isCompleted: exercise.isCompleted,
                  })) || [],
              },
            },
            update: {
              group: trainingDay.group,
              dayOfWeek: trainingDay.dayOfWeek,
              isCompleted: trainingDay.isCompleted,
              comments: trainingDay.comments,
              exercises: {
                upsert:
                  trainingDay.exercises?.map((exercise: Exercise) => ({
                    where: { id: exercise.id },
                    create: {
                      name: exercise.name,
                      variation: exercise.variation,
                      repetitions: exercise.repetitions,
                      sets: exercise.sets,
                      isCompleted: exercise.isCompleted,
                    },
                    update: {
                      name: exercise.name,
                      variation: exercise.variation,
                      repetitions: exercise.repetitions,
                      sets: exercise.sets,
                      isCompleted: exercise.isCompleted,
                    },
                  })) || [],
              },
            },
          })) || [],
      },
    },
  })

  // Criação do histórico
  if (existingTrainingWeek) {
    await createHistoryEntry(
      existingTrainingWeek.userId,
      `Training week ${existingTrainingWeek.weekNumber} updated`
    )
  }

  await createHistoryEntry(
    updatedTrainingWeek.userId,
    `Training week ${updatedTrainingWeek.weekNumber} updated`
  )

  return updatedTrainingWeek
}
