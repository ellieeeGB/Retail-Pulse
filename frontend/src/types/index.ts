export interface User {
  email: string;
  full_name: string;
  role: string;
}

export interface Client {
  id?: number;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  client: Client;
}

export interface Product {
  client_id: number;
  product_id: number;
  product_name: string;
  category: string;
  supplier: string;
  cost_mxn: number;
  price_mxn: number;
  price_delivery: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface Sale {
  transaction_id: number;
  timestamp: string;
  date: string;
  hour: number;
  product_id: number;
  product_name: string;
  quantity: number;
  total_line: number;
}

export interface KPIDaily {
  date: string;
  tickets: number;
  units_sold: number;
  revenue_mxn: number;
  gross_margin_mxn: number;
  gross_margin_pct: number;
  avg_temp_c: number | null;
}

export interface TopProduct {
  product_id: number
  product_name: string
  category: string | null
  units_sold: number
  revenue: number
}

export interface Recommendation {
  product_id: number;
  product_name: string;
  confidence: number;
  lift: number;
}

export interface InventoryAlert {
  product_id: number
  product_name: string
  current_stock: number
  reorder_point: number
}
export interface RecommendationRequest {
  product_ids: number[];
}

export interface RecommendationItem {
  product_id: number;
  product_name: string;
  confidence: number;
  lift: number;
}

export interface BusinessRecommendation {
  kind: string
  product_name: string
  confidence: number
  lift: number
  strength: string
  context: string
  support_abs: number
  significant: boolean
  opportunity_level: string
  message: string
  action: string
}

export interface WasteRiskAlert {
  kind: string
  product_name: string
  confidence: number
  lift: number
  strength: string
  context: string
  support_abs: number
  significant: boolean
  waste_total: number
  risk_level: string
  message: string
  action: string
}

export interface RecommendationSummary {
  metadata: Record<string, unknown>
  sales_recommendations: BusinessRecommendation[]
  waste_risk_alerts: WasteRiskAlert[]
}
