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
            features: {
              select: {
                id: true,
                name: true,
                isTrainingWeek: true,
                isDiet: true,
                isFeedback: true,
                isConsultation: true,
                isReturn: true,
                feedback: true,
                linkToResolve: true,
              },
            },
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

    // Map to store client data
    const clientMap = new Map()

    // Process purchases to build client data
    for (const purchase of purchases) {
      const { buyer } = purchase

      if (!buyer) continue

      // If client doesn't exist in map or this purchase is more recent than the stored one
      if (
        !clientMap.has(buyer.id) ||
        purchase.createdAt > clientMap.get(buyer.id).latestPurchaseDate
      ) {
        const isActive = purchase.status === 'ACTIVE'

        // Initialize client with data from most recent purchase
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
          tasks: [], // Initialize empty tasks array
        })
      }
    }

    // Calculate total spent and purchase count for each client
    // And add tasks from plan features
    for (const purchase of purchases) {
      const { buyer } = purchase
      if (!buyer) continue

      const clientData = clientMap.get(buyer.id)
      if (clientData) {
        clientData.totalSpent += purchase.amount || 0
        clientData.purchaseCount += 1

        // Only add tasks from active purchases
        if (purchase.status === 'ACTIVE' && purchase.Plan?.features) {
          // Convert plan features to tasks
          for (const feature of purchase.Plan.features) {
            const taskStatus = 'PENDING'
            let taskTitle = feature.name
            let taskDescription = ''

            // Determine task type and status based on feature type
            if (feature.isTrainingWeek) {
              taskTitle = `Treino: ${feature.name}`
              taskDescription = 'Plano de treino a ser realizado'
            } else if (feature.isDiet) {
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

            // Add task to client's tasks array
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
              dueDate: null, // Features don't have due dates in the schema
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

    return clients
  } catch (error) {
    console.error('Error in getClientsByProfessionalIdService:', error)
    throw error
  }
}
