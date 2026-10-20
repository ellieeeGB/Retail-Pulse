import api from '../api'
import type { Product } from '../../types'

export interface ProductPayload {
  product_id: number
  product_name: string
  category: string
  supplier: string
  cost_mxn: number
  price_mxn: number
  price_delivery?: number | null
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get('/products/')
  return response.data
}

export async function getProduct(productId: number): Promise<Product> {
  const response = await api.get(`/products/${productId}`)
  return response.data
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const response = await api.post('/products/', payload)
  return response.data
}

export async function updateProduct(
  productId: number,
  payload: Partial<ProductPayload>
): Promise<Product> {
  const response = await api.put(`/products/${productId}`, payload)
  return response.data
}

export async function deleteProduct(productId: number): Promise<void> {
  await api.delete(`/products/${productId}`)
}
