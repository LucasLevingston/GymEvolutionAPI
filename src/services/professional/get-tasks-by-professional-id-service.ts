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

      // Determine task type and details based on feature type
      if (feature.isTrainingWeek) {
        taskType = 'TRAINING'
        taskTitle = 'Create Training Plan'
        taskDescription = 'Create a training plan for the client'

        // Check if there's already a training week for this feature
        if (feature.trainingWeekId) {
          const trainingWeek = await prisma.trainingWeek.findUnique({
            where: { id: feature.trainingWeekId },
          })

          if (trainingWeek) {
            taskStatus = trainingWeek.isCompleted ? 'COMPLETED' : 'IN_PROGRESS'
          }
        }
      } else if (feature.isDiet) {
        taskType = 'DIET'
        taskTitle = 'Create Diet Plan'
        taskDescription = 'Create a diet plan for the client'

        // Check if there's already a diet for this feature
        if (feature.dietId) {
          const diet = await prisma.diet.findUnique({
            where: { id: feature.dietId },
          })

          if (diet) {
            taskStatus = 'COMPLETED'
          } else {
            taskStatus = 'PENDING'
          }
        }
      } else if (feature.isFeedback) {
        taskType = 'FEEDBACK'
        taskTitle = 'Provide Feedback'
        taskDescription = feature.feedback || 'Provide feedback to the client'
        taskStatus = 'PENDING' // We'd need additional logic to determine if feedback was given
      } else if (feature.isConsultation) {
        taskType = 'CONSULTATION'
        taskTitle = 'Initial Consultation'
        taskDescription = 'Schedule or conduct initial consultation with client'

        // Check if there's a meeting for this consultation
        if (feature.consultationMeetingId) {
          const meeting = await prisma.meeting.findUnique({
            where: { id: feature.consultationMeetingId },
          })

          if (meeting) {
            taskStatus = meeting.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'

            // Set due date if meeting is scheduled
            if (meeting.startTime) {
              dueDate = meeting.startTime.toISOString()
            }
          }
        }
      } else if (feature.isReturn) {
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
        // Skip features that don't map to tasks
        continue
      }

      // Create the task object
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
