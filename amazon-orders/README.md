# Challenge 2: Amazon Orders

## 1. Overview

Build a Flask API that integrates Amazon-style order history from mock data and returns order listing, spending summary, spending by category, frequent items, and returns. All monetary values use a consistent unit (e.g. cents).

## 2. Problem Statement

You are building an API that exposes a user's order history and analytics. The data is supplied in `mock-data/orders.json`. Your API must expose five endpoints that return orders, summary stats, category-level spending, frequently ordered items, and return records.

## 3. Requirements

- Read order data from `mock-data/orders.json`.
- Implement the five required endpoints (see below).
- Orders for `/api/orders/:userId` should be ordered by `order_date` descending.
- Summary total_spent is the sum of `total_amount` for all orders for that user.
- Spending-by-category aggregates item-level spend (quantity * unit_price) by category; only count non-returned items (or define and document your rule for returns).
- Frequent items: count how many orders contain each item and total quantity; order by times_ordered descending (then by total_quantity if tied).
- Returns: list all items where `returned` is true, with order context.
- If `userId` has no orders, return an appropriate response (e.g. empty list and/or 404 for summary).

## 4. Expected Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/orders/:userId` | All orders for the user, most recent first. |
| GET | `/api/orders/:userId/summary` | Order count, total spent, average order value, first/last order dates. |
| GET | `/api/orders/:userId/spending-by-category` | Per-category total spent, order count, item count. |
| GET | `/api/orders/:userId/frequent-items` | Items ordered more than once (or all items), with times_ordered and total_quantity. |
| GET | `/api/orders/:userId/returns` | All returned items with order and item details. |

## 5. Data Models

See `task.ts` for the canonical types:

- **Order:** order_id, user_id, order_date, total_amount, subtotal, tax, discount, status, items
- **OrderItem:** item_id, name, category, quantity, unit_price, returned
- **OrderSummary:** user_id, total_orders, total_spent, average_order_value, first_order_date, last_order_date
- **CategorySpend:** category, total_spent, order_count, item_count
- **FrequentItem:** item_id, name, category, times_ordered, total_quantity
- **ReturnRecord:** order_id, order_date, item_id, item_name, category, quantity_returned, unit_price

## 6. Expected Behavior

- **Orders:** Full order objects including items, sorted by order_date descending.
- **Summary:** total_spent = sum of order total_amount; average = total_spent / total_orders.
- **Spending by category:** Sum (quantity * unit_price) for each category. Specify in your README whether returned items are excluded (recommended: exclude).
- **Frequent items:** One row per distinct item_id; times_ordered = number of orders containing that item; total_quantity = sum of quantity across those orders.
- **Returns:** One record per returned line item (order_id, item details, quantity_returned).

## 7. Suggested Flask Project Structure

```
amazon-orders/
  app.py
  requirements.txt
  mock-data/          # (provided)
  services/
    order_service.py
  routes/
    order_routes.py
  tests/
    test_order_api.py
```

## 8. Evaluation Criteria

- Correctness of totals, averages, and category aggregation.
- Consistent handling of returned items across endpoints.
- Response shape matches `task.ts` and `example-response.json`.
- Handling of user with no orders.
- Code structure and tests.

## 9. Example Response

See `example-response.json` for sample responses for `user-a`.

---

## 10. Follow-Up Interview Questions

*For the interviewer: use after the base implementation is complete. Not part of the required task. Ordered from easier to harder; probe backend judgment, API design, data modeling, reliability, and scale.*

1. How would you handle very large order histories (e.g. millions of orders per user)?
2. How would you support incremental sync if orders are pushed from an external system?
3. How would you deal with currency conversion for international orders?
4. How would you design this for multi-tenant users (multiple marketplaces or tenants)?
5. How would you expose filtering by date range or status without overcomplicating the API?
6. How would you handle idempotency if the same order is ingested twice?
7. How would you model refunds and partial refunds in the data model?
8. How would you secure user-scoped endpoints so one user cannot see another's orders?
9. How would you design the database schema and indexes for these queries?
10. How would you support analytics across all users (admin/reporting) without duplicating logic?
11. How would you handle eventual consistency between order service and inventory/returns?
12. How would you version the API when adding new fields (e.g. shipment tracking)?

---

## 11. Edge Cases to Discuss After Implementation

*For the interviewer: discussion only. Not required in the base implementation. Ordered from easier to harder.*

1. **Refunded items but completed order:** Some items are refunded but order status remains "delivered". How do you represent and aggregate?
2. **Missing category names:** An item has category null or empty. How do you bucket it?
3. **Duplicated order IDs from source:** Same order_id appears twice. How do you deduplicate?
4. **Item quantity of zero:** How do you handle or reject?
5. **Negative discount values or malformed money fields:** How do you validate and respond?
6. **Empty orders array:** Order has no items. How does spending-by-category and summary behave?
7. **Orders spanning multiple years:** How do you support year-over-year or date-range analytics?
8. **Returned item with no refund amount:** How do you track refund amount if not on the item?
9. **Status transitions:** Order moves from shipped to delivered. How do you handle history and idempotency?
10. **Very long item names or huge item lists:** How do you paginate or truncate?
11. **Concurrent updates:** Two processes update the same user's orders. How do you avoid race conditions?
12. **Timezone for order_date:** How do you interpret and filter by date when timestamps are in different zones?
