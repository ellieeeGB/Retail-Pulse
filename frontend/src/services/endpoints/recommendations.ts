import api from '../api'
import type {
  RecommendationItem,
  RecommendationRequest,
  RecommendationSummary,
} from '../../types'

export async function getRecommendations(
  payload: RecommendationRequest = { product_ids: [] }
): Promise<RecommendationItem[]> {
  const response = await api.post('/recommendations', payload)
  return response.data
}

export async function getRecommendationSummary(): Promise<RecommendationSummary> {
  const response = await api.get('/recommendations/summary')
  return response.data
}
