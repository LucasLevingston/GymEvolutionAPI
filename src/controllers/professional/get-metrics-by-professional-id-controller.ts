import { FastifyRequest } from 'fastify'
import {
  calculateDateRanges,
  generateChartData,
} from '@/services/professional/get-metrics-by-professional-id-service'

export async function getMetricsByProfessionalIdController(
  request: FastifyRequest<{
    Params: { professionalId: string }
    Querystring: { timeRange?: string; chartType?: string }
  }>
) {
  try {
    const { professionalId } = request.params
    const timeRange = request.query.timeRange || 'month'
    const chartType = request.query.chartType || 'revenue'

    const { currentPeriodStart, currentPeriodEnd } = calculateDateRanges(timeRange)

    const chartData = await generateChartData(
      professionalId,
      chartType,
      currentPeriodStart,
      currentPeriodEnd,
      timeRange
    )
    return chartData
  } catch (error) {
    throw error
  }
}
