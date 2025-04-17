import { z } from 'zod'

// Define the feature types for different professional roles
const nutritionistFeatures = [
  'initial_consultation',
  'follow_up',
  'diet_plan',
  'nutritional_monitoring',
  'whatsapp_support',
  'meal_planning',
  'body_composition_analysis',
  'nutritional_education',
] as const

const trainerFeatures = [
  'initial_assessment',
  'training_plan',
  'follow_up_session',
  'physical_monitoring',
  'whatsapp_support',
  'exercise_technique',
  'personalized_training',
  'performance_evaluation',
] as const

// Create a schema for plan creation
export const createPlanSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  features: z.array(z.any()),
  professionalId: z.string().uuid(),
  isCustom: z.boolean().default(false),
  // Optional fields for workflow management
  requiresInitialMeeting: z.boolean().default(true),
  requiresFollowUp: z.boolean().default(false),
  maxFollowUps: z.number().int().nonnegative().default(0),
})

// Create a schema for plan update
export const updatePlanSchema = createPlanSchema.partial()

// Export types
export type CreatePlanInput = z.infer<typeof createPlanSchema>
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>

// Helper function to get predefined features based on professional type
export function getPredefinedFeatures(professionalType: 'NUTRITIONIST' | 'TRAINER') {
  if (professionalType === 'NUTRITIONIST') {
    return nutritionistFeatures.map((feature) => ({
      id: feature,
      label: getFeatureLabel(feature, 'NUTRITIONIST'),
    }))
  } else {
    return trainerFeatures.map((feature) => ({
      id: feature,
      label: getFeatureLabel(feature, 'TRAINER'),
    }))
  }
}

// Helper function to get feature labels
function getFeatureLabel(
  featureId: string,
  professionalType: 'NUTRITIONIST' | 'TRAINER'
) {
  const labels: Record<string, string> = {
    // Nutritionist features
    initial_consultation: 'Consulta Inicial',
    follow_up: 'Consulta de Retorno',
    diet_plan: 'Plano Alimentar',
    nutritional_monitoring: 'Acompanhamento Nutricional',
    whatsapp_support: 'Suporte via WhatsApp',
    meal_planning: 'Planejamento de Refeições',
    body_composition_analysis: 'Análise de Composição Corporal',
    nutritional_education: 'Educação Nutricional',

    // Trainer features
    initial_assessment: 'Avaliação Física Inicial',
    training_plan: 'Planilha de Treino',
    follow_up_session: 'Sessão de Acompanhamento',
    physical_monitoring: 'Monitoramento de Progresso',
    exercise_technique: 'Correção de Técnica de Exercícios',
    personalized_training: 'Treino Personalizado',
    performance_evaluation: 'Avaliação de Desempenho',
  }

  return labels[featureId] || featureId
}
