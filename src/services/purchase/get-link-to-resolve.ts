import { Feature } from '@prisma/client'
import { env } from '@/env'

const { FRONTEND_URL } = env

export const getLinkToResolve = async (feature: Feature) => {
  const baseUrls = {
    training: `${FRONTEND_URL}/training/create/${
      feature.trainingWeekId || 'new'
    }?&featureId=${feature.id}`,
    diet: `/diet/create/${feature.dietId || 'new'}?&featureId=${feature.id}`,
    feedback: `/feedback/create?&featureId=${feature.id}`,
    consultation: `/meeting/create/${feature.consultationMeetingId || 'new'}?&featureId=${
      feature.id
    }`,
    return: `/meeting/create/${feature.returnMeetingId || 'new'}?&featureId=${
      feature.id
    }`,
  }

  return (
    feature.linkToResolve ||
    (feature.isTrainingWeek && baseUrls.training) ||
    (feature.isDiet && baseUrls.diet) ||
    (feature.isFeedback && baseUrls.feedback) ||
    (feature.isConsultation && baseUrls.consultation) ||
    (feature.isReturn && baseUrls.return) ||
    `/purchases/${feature.id}`
  )
}
