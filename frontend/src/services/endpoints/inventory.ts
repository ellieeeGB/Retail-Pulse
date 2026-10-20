import api from '../api'
import type { InventoryAlert } from '../../types'

export async function getLowStockAlerts(): Promise<InventoryAlert[]> {
  const response = await api.get('/inventory/low-stock')
  return response.data
}
