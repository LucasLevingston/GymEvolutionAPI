import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'

interface Exercise {
  name: string
  variation?: string
  repetitions: number
  sets: number
  isCompleted?: boolean
}

interface TrainingDay {
  group: string
  dayOfWeek: string
  day?: string | Date
  comments?: string
  isCompleted?: boolean
  exercises?: Exercise[]
}

interface CreateTrainingWeekParams {
  weekNumber: number
  information?: string
  userId: string
  startDate: Date
  endDate: Date
  trainingDays: TrainingDay[]
}

export async function createTrainingWeek({
  weekNumber,
  information,
  userId,
  startDate,
  endDate,
  trainingDays,
}: CreateTrainingWeekParams) {
  const trainingWeek = await prisma.trainingWeek.create({
    data: {
      weekNumber,
      information,
      userId,
      startDate,
      endDate,
      trainingDays: {
        create: trainingDays.map((trainingDay) => {
          const { day, ...trainingDayWithoutDay } = trainingDay

          return {
            ...trainingDayWithoutDay,
            exercises: {
              create: trainingDay.exercises?.map((exercise) => ({
                name: exercise.name,
                repetitions: exercise.repetitions,
                sets: exercise.sets,
                variation: exercise.variation,
              })),
            },
          }
        }),
      },
    },
    include: {
      trainingDays: {
        include: {
          exercises: true,
        },
      },
    },
  })

  await createHistoryEntry(userId, `Training week ${weekNumber} created`)

  return trainingWeek
}
