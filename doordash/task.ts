/**
 * DoorDash — API contract and types
 *
 * Use these interfaces as the source of truth for request/response shapes.
 * Implement your Flask API to return data matching these types.
 */

/** Restaurant record from the provider. */
export interface Restaurant {
  restaurant_id: string;
  name: string;
  cuisine: string;
  address: string;
}

/** A single delivery order. */
export interface DeliveryOrder {
  order_id: string;
  user_id: string;
  restaurant_id: string;
  order_placed_at: string;   // ISO 8601
  delivered_at: string | null; // null if not yet delivered (e.g. in progress, cancelled)
  estimated_delivery_minutes: number;
  distance_km: number;
  status: string; // e.g. "delivered", "in_progress", "cancelled"
}

/** Response for GET /api/doordash/users/:userId/summary */
export interface UserSummary {
  user_id: string;
  total_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  average_delivery_time_minutes: number | null; // only over delivered orders
}

/** Restaurant with order count for favorite list. */
export interface FavoriteRestaurant {
  restaurant_id: string;
  name: string;
  cuisine: string;
  order_count: number;
}

/** Cuisine-level breakdown. */
export interface CuisineBreakdownItem {
  cuisine: string;
  order_count: number;
  total_spent_estimate?: number; // optional if not in scope
}

/** Response for GET /api/doordash/users/:userId/cuisine-breakdown */
export interface CuisineBreakdown {
  user_id: string;
  cuisines: CuisineBreakdownItem[];
}

/** Response for GET /api/doordash/users/:userId/delivery-metrics */
export interface DeliveryMetrics {
  user_id: string;
  average_delivery_time_minutes: number | null;
  late_delivery_rate: number; // 0-1, fraction of delivered orders that were late
  average_distance_km: number | null;
  delivered_count: number;
}
