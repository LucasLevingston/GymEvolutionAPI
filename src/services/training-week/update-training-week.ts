import { Exercise, TrainingDay } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { getTrainingWeekById } from './get-training-week-by-id'

interface UpdateTrainingWeekParams {
  weekNumber?: number
  information?: string
  done?: boolean
  startDate?: Date | string
  endDate?: Date | string
  isCompleted?: boolean
  userId?: string
  trainingDays?: TrainingDay[]
}

export async function updateTrainingWeek(id: string, data: UpdateTrainingWeekParams) {
  const existingTrainingWeek = await getTrainingWeekById(id)

  if (!existingTrainingWeek) {
    throw new Error(`Training week with id ${id} not found`)
  }

  // Prepare the update data
  const updateData: any = {
    weekNumber: data.weekNumber,
    information: data.information,
    isCompleted: data.isCompleted ?? data.done,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  }

  // Handle training days updates
  if (data.trainingDays !== undefined) {
    // Get IDs of training days in the update data
    const updatedTrainingDayIds = data.trainingDays
      .filter((day) => day.id)
      .map((day) => day.id)

    // Get IDs of existing training days
    const existingTrainingDayIds = existingTrainingWeek.trainingDays.map((day) => day.id)

    // Find training days to delete (exist in DB but not in update data)
    const trainingDaysToDelete = existingTrainingDayIds.filter(
      (id) => !updatedTrainingDayIds.includes(id)
    )

    // Add delete operation for training days that are no longer present
    if (trainingDaysToDelete.length > 0) {
      updateData.trainingDays = {
        ...(updateData.trainingDays || {}),
        deleteMany: {
          id: { in: trainingDaysToDelete },
        },
      }
    }

    // Process each training day in the update data
    const upsertOperations = data.trainingDays
      .filter((day) => day) // Filter out null/undefined
      .map((trainingDay) => {
        // If this is an existing training day
        if (trainingDay.id) {
          // Find the existing training day to compare exercises
          const existingDay = existingTrainingWeek.trainingDays.find(
            (day) => day.id === trainingDay.id
          )

          // Handle exercises for this training day
          let exercisesOperation = {}

          if (existingDay && trainingDay.exercises) {
            // Get IDs of exercises in the update data
            const updatedExerciseIds = trainingDay.exercises
              .filter((ex) => ex.id)
              .map((ex) => ex.id)

            // Get IDs of existing exercises
            const existingExerciseIds = existingDay.exercises.map((ex) => ex.id)

            // Find exercises to delete (exist in DB but not in update data)
            const exercisesToDelete = existingExerciseIds.filter(
              (id) => !updatedExerciseIds.includes(id)
            )

            // Add delete operation for exercises that are no longer present
            if (exercisesToDelete.length > 0) {
              exercisesOperation = {
                deleteMany: {
                  id: { in: exercisesToDelete },
                },
              }
            }

            // Add upsert operations for exercises
            if (trainingDay.exercises.length > 0) {
              exercisesOperation = {
                ...exercisesOperation,
                upsert: trainingDay.exercises
                  .filter((ex) => ex) // Filter out null/undefined
                  .map((exercise: Exercise) => ({
                    where: { id: exercise.id || 'new-id-' + Math.random() }, // Use a random ID for new exercises
                    create: {
                      name: exercise.name || '',
                      group: exercise.name || '',
                      variation: exercise.variation || '',
                      repetitions: exercise.repetitions || 0,
                      sets: exercise.sets || 0,
                      isCompleted: exercise.isCompleted || false,
                      seriesResults: exercise.seriesResults
                        ? {
                            create: exercise.seriesResults,
                          }
                        : undefined,
                    },
                    update: {
                      name: exercise.name,
                      group: exercise.name || '',
                      variation: exercise.variation,
                      repetitions: exercise.repetitions,
                      sets: exercise.sets,
                      isCompleted: exercise.isCompleted,
                      seriesResults: exercise.seriesResults
                        ? {
                            deleteMany: {},
                            create: exercise.seriesResults,
                          }
                        : undefined,
                    },
                  })),
              }
            }
          }

          // Return the upsert operation for this training day
          return {
            where: { id: trainingDay.id },
            update: {
              dayOfWeek: trainingDay.dayOfWeek,
              isCompleted: trainingDay.isCompleted,
              comments: trainingDay.comments,
              muscleGroups: trainingDay.muscleGroups || [],
              exercises: exercisesOperation,
            },
            create: {
              dayOfWeek: trainingDay.dayOfWeek,
              isCompleted: trainingDay.isCompleted,
              comments: trainingDay.comments,
              muscleGroups: trainingDay.muscleGroups || [],
              exercises:
                trainingDay.exercises && trainingDay.exercises.length > 0
                  ? {
                      create: trainingDay.exercises.map((exercise: Exercise) => ({
                        name: exercise.name || '',
                        variation: exercise.variation || '',
                        repetitions: exercise.repetitions || 0,
                        sets: exercise.sets || 0,
                        isCompleted: exercise.isCompleted || false,
                        group: exercise.group,
                        seriesResults: exercise.seriesResults
                          ? {
                              create: exercise.seriesResults,
                            }
                          : undefined,
                      })),
                    }
                  : undefined,
            },
          }
        }
        // This is a new training day
        return {
          where: { id: 'new-id-' + Math.random() }, // Use a random ID that won't match anything
          create: {
            dayOfWeek: trainingDay.dayOfWeek || '',
            isCompleted: trainingDay.isCompleted || false,
            comments: trainingDay.comments || '',
            muscleGroups: trainingDay.muscleGroups || [],
            exercises:
              trainingDay.exercises && trainingDay.exercises.length > 0
                ? {
                    create: trainingDay.exercises.map((exercise: Exercise) => ({
                      name: exercise.name || '',
                      variation: exercise.variation || '',
                      repetitions: exercise.repetitions || 0,
                      sets: exercise.sets || 0,
                      isCompleted: exercise.isCompleted || false,
                      group: exercise.group,
                      seriesResults: exercise.seriesResults
                        ? {
                            create: exercise.seriesResults,
                          }
                        : undefined,
                    })),
                  }
                : undefined,
          },
          update: {},
        }
      })

    if (upsertOperations && upsertOperations.length > 0) {
      updateData.trainingDays = {
        ...(updateData.trainingDays || {}),
        upsert: upsertOperations,
      }
    }
  }

  const updatedTrainingWeek = await prisma.trainingWeek.update({
    where: { id },
    data: updateData,
    include: {
      trainingDays: {
        include: {
          exercises: {
            include: {
              seriesResults: true,
            },
          },
        },
      },
    },
  })

  await createHistoryEntry(
    updatedTrainingWeek.userId,
    `Training week ${updatedTrainingWeek.weekNumber} updated`
  )

  return updatedTrainingWeek
}
