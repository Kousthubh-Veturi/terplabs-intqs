/**
 * Amazon Orders — API contract and types
 *
 * Use these interfaces as the source of truth for request/response shapes.
 * Implement your Flask API to return data matching these types.
 */

/** A single line item within an order. */
export interface OrderItem {
  item_id: string;
  name: string;
  category: string;
  quantity: number;
  unit_price: number; // in cents or smallest currency unit
  returned: boolean;
}

/** A single order from the provider. */
export interface Order {
  order_id: string;
  user_id: string;
  order_date: string; // ISO 8601 date or datetime
  total_amount: number;
  subtotal: number;
  tax: number;
  discount: number;   // positive number representing discount applied
  status: string;    // e.g. "delivered", "shipped", "cancelled"
  items: OrderItem[];
}

/** Response for GET /api/orders/:userId/summary */
export interface OrderSummary {
  user_id: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  first_order_date: string | null;
  last_order_date: string | null;
}

/** Spending aggregated by product category. */
export interface CategorySpend {
  category: string;
  total_spent: number;
  order_count: number;
  item_count: number;
}

/** Response for GET /api/orders/:userId/spending-by-category */
export interface SpendingByCategory {
  user_id: string;
  categories: CategorySpend[];
}

/** Item that appears frequently in the user's orders. */
export interface FrequentItem {
  item_id: string;
  name: string;
  category: string;
  times_ordered: number;
  total_quantity: number;
}

/** Response for GET /api/orders/:userId/returns */
export interface ReturnRecord {
  order_id: string;
  order_date: string;
  item_id: string;
  item_name: string;
  category: string;
  quantity_returned: number;
  unit_price: number;
}
