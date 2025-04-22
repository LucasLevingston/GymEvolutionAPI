import { prisma } from 'lib/prisma'

export async function getTasksByProfessionalIdService(professionalId: string) {
  const activePurchases = await prisma.purchase.findMany({
    where: {
      professionalId,
      status: 'ACTIVE',
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      Plan: {
        include: {
          features: true,
        },
      },
    },
  })

  const tasks = []

  // Process each purchase to extract tasks from features
  for (const purchase of activePurchases) {
    const { Plan, buyer } = purchase

    if (!Plan || !Plan.features || !buyer) continue

    // Process each feature to create a task
    for (const feature of Plan.features) {
      // Skip features that don't represent tasks
      if (!feature) continue

      let taskType = ''
      let taskStatus = 'PENDING'
      let taskTitle = ''
      let taskDescription = ''
      let dueDate = null

      if (feature.isTrainingWeek) {
        taskType = 'TRAINING'
        taskTitle = 'Create Training Plan'
        taskDescription = 'Create a training plan for the client'

        if (feature.trainingWeekId) {
          taskStatus = 'COMPLETED'
        }
      } else if (feature.isDiet) {
        taskType = 'DIET'
        taskTitle = 'Create Diet Plan'
        taskDescription = 'Create a diet plan for the client'

        if (feature.dietId) {
          taskStatus = 'COMPLETED'
        }
      } else if (feature.isFeedback) {
        taskType = 'FEEDBACK'
        taskTitle = 'Provide Feedback'
        taskDescription = feature.feedback || 'Provide feedback to the client'
        taskStatus = 'PENDING'
      } else if (feature.isConsultation && !feature.consultationMeetingId) {
        taskType = 'CONSULTATION'
        taskTitle = 'Initial Consultation'
        taskDescription = 'Schedule or conduct initial consultation with client'

        if (feature.consultationMeetingId) {
          const meeting = await prisma.meeting.findUnique({
            where: { id: feature.consultationMeetingId },
          })

          if (meeting) {
            taskStatus = meeting.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'

            if (meeting.startTime) {
              dueDate = meeting.startTime.toISOString()
            }
          }
        }
      } else if (feature.isReturn && !feature.returnMeetingId) {
        taskType = 'RETURN'
        taskTitle = 'Follow-up Meeting'
        taskDescription = 'Schedule or conduct follow-up meeting with client'

        // Check if there's a meeting for this return
        if (feature.returnMeetingId) {
          const meeting = await prisma.meeting.findUnique({
            where: { id: feature.returnMeetingId },
          })

          if (meeting) {
            taskStatus = meeting.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'

            // Set due date if meeting is scheduled
            if (meeting.startTime) {
              dueDate = meeting.startTime.toISOString()
            }
          }
        }
      } else {
        continue
      }
      tasks.push({
        id: feature.id,
        type: taskType,
        title: taskTitle,
        description: taskDescription,
        clientName: buyer.name || buyer.email,
        clientId: buyer.id,
        status: taskStatus,
        purchaseId: purchase.id,
        featureId: feature.id,
        linkToResolve: feature.linkToResolve,
        dueDate: dueDate,
      })
    }
  }

  // Sort tasks by status (pending first) and then by due date if available
  return tasks.sort((a, b) => {
    // Sort by status priority: PENDING > IN_PROGRESS > COMPLETED
    const statusPriority = { PENDING: 0, IN_PROGRESS: 1, COMPLETED: 2 }
    const statusDiff = statusPriority[a.status] - statusPriority[b.status]

    if (statusDiff !== 0) return statusDiff

    // If same status, sort by due date (if available)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }

    // Put tasks with due dates before those without
    if (a.dueDate) return -1
    if (b.dueDate) return 1

    return 0
  })
}
