import { prisma } from 'lib/prisma'

export async function getClientsByProfessionalIdService(professionalId: string) {
  try {
    if (!professionalId) {
      throw new Error('Professional ID is required')
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        professionalId: professionalId,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            sex: true,
            birthDate: true,
            currentWeight: true,
            currentBf: true,
            height: true,
            imageUrl: true,
            createdAt: true,
          },
        },
        Plan: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            features: true,
          },
        },
        Meeting: {
          select: {
            id: true,
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const clientMap = new Map()

    for (const purchase of purchases) {
      const { buyer } = purchase

      if (!buyer) continue

      if (
        !clientMap.has(buyer.id) ||
        purchase.createdAt > clientMap.get(buyer.id).latestPurchaseDate
      ) {
        const isActive = purchase.status === 'ACTIVE'

        clientMap.set(buyer.id, {
          id: buyer.id,
          name: buyer.name || 'Cliente sem nome',
          email: buyer.email,
          phone: buyer.phone,
          sex: buyer.sex,
          birthDate: buyer.birthDate,
          currentWeight: buyer.currentWeight,
          currentBf: buyer.currentBf,
          height: buyer.height,
          imageUrl: buyer.imageUrl,
          latestPurchaseId: purchase.id,
          latestPurchaseDate: purchase.createdAt,
          latestPlanName: purchase.Plan?.name,
          purchaseStatus: purchase.status,
          isActive: isActive,
          totalSpent: 0,
          purchaseCount: 0,
          tasks: [],
        })
      }
    }

    for (const purchase of purchases) {
      const { buyer } = purchase
      if (!buyer) continue

      const clientData = clientMap.get(buyer.id)
      if (clientData) {
        clientData.totalSpent += purchase.amount || 0
        clientData.purchaseCount += 1

        if (purchase.status === 'ACTIVE' && purchase.Plan?.features) {
          for (const feature of purchase.Plan.features) {
            let taskStatus = 'PENDING'
            taskStatus = 'PENDING'
            let taskTitle = feature.name
            let taskDescription = ''
            if (feature.isTrainingWeek) {
              if (feature.trainingWeekId) taskStatus = 'COMPLETED'
              taskTitle = `Treino: ${feature.name}`
              taskDescription = 'Plano de treino a ser realizado'
            } else if (feature.isDiet) {
              if (feature.dietId) taskStatus = 'COMPLETED'
              taskTitle = `Dieta: ${feature.name}`
              taskDescription = 'Plano alimentar a ser seguido'
            } else if (feature.isFeedback) {
              taskTitle = `Feedback: ${feature.name}`
              taskDescription = feature.feedback || 'Feedback pendente'
            } else if (feature.isConsultation) {
              taskTitle = `Consulta: ${feature.name}`
              taskDescription = 'Consulta a ser agendada'
            } else if (feature.isReturn) {
              taskTitle = `Retorno: ${feature.name}`
              taskDescription = 'Consulta de retorno a ser agendada'
            }

            clientData.tasks.push({
              id: feature.id,
              type: feature.isTrainingWeek
                ? 'TRAINING'
                : feature.isDiet
                ? 'DIET'
                : feature.isFeedback
                ? 'FEEDBACK'
                : feature.isConsultation
                ? 'CONSULTATION'
                : feature.isReturn
                ? 'RETURN'
                : 'OTHER',
              title: taskTitle,
              description: taskDescription,
              status: taskStatus,
              dueDate: null,
              linkToResolve: feature.linkToResolve,
            })
          }
        }

        // Also add meetings as tasks for completeness
        if (purchase.Meeting && purchase.Meeting.length > 0) {
          for (const meeting of purchase.Meeting) {
            clientData.tasks.push({
              id: meeting.id,
              type: 'MEETING',
              title: meeting.title || 'Consulta',
              description: meeting.description || 'Consulta agendada',
              status: meeting.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
              dueDate: meeting.startTime,
            })
          }
        }
      }
    }

    // Convert map values to array
    const clients = Array.from(clientMap.values())
    console.log(clients)
    return clients
  } catch (error) {
    console.error('Error in getClientsByProfessionalIdService:', error)
    throw error
  }
}
