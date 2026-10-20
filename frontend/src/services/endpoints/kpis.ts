import api from '../api';
import type { KPIDaily, TopProduct } from '../../types';

export const getKPIDaily = async (date: string): Promise<KPIDaily> => {
  const response = await api.get(`/kpis/daily?kpi_date=${date}`);
  return response.data;
};

export const getKPIRange = async (startDate: string, endDate: string): Promise<KPIDaily[]> => {
  const response = await api.get(`/kpis/range?start_date=${startDate}&end_date=${endDate}`);
  return response.data;
};

export const getTopProducts = async (limit: number = 10): Promise<TopProduct[]> => {
  const response = await api.get(`/kpis/top-products?limit=${limit}`);
  return response.data;
};
