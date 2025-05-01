import { prisma } from 'lib/prisma'
import { getClientsByProfessionalIdService } from 'services/professional/get-clients-by-professional-id'
import { getTasksByProfessionalIdService } from 'services/professional/get-tasks-by-professional-id-service'

export async function getUserByIdService(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      history: true,
      oldWeights: true,
      trainingWeeks: {
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
      },
      plans: true,
      meetingsAsProfessional: true,
      meetingsAsStudent: true,
      nutritionistRelation: true,
      ProfessionalSettings: true,
      trainerRelation: true,
      diets: {
        include: {
          meals: {
            include: { mealItems: true },
          },
        },
      },
    },
  })
  let tasks = []
  let clients = []
  if (user?.role === 'NUTRITIONIST' || user?.role === 'TRAINER') {
    tasks = await getTasksByProfessionalIdService(id)
    clients = await getClientsByProfessionalIdService(id)
  }

  return { ...user, tasks, clients }
}
