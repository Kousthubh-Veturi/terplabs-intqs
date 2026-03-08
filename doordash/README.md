# Challenge 3: DoorDash

## 1. Overview

Build a Flask API that analyzes food delivery orders. Data is supplied in `mock-data/orders.json` and `mock-data/restaurants.json`. The API exposes user orders, summary, favorite restaurants, cuisine breakdown, and delivery metrics (average delivery time, late delivery rate, average distance).

## 2. Problem Statement

You are building an API for delivery order analytics. Orders reference restaurants by `restaurant_id`; enrich order responses with restaurant name and cuisine from `restaurants.json`. Compute delivery metrics only over delivered orders (where `delivered_at` is set and status is "delivered"). An order is "late" if actual delivery time exceeds `estimated_delivery_minutes`.

## 3. Requirements

- Read from `mock-data/orders.json` and `mock-data/restaurants.json`.
- Implement the five required endpoints (see below).
- Orders list: order by `order_placed_at` descending; optionally enrich with restaurant name/cuisine.
- Summary: total_orders, delivered_orders, cancelled_orders, average_delivery_time_minutes (only over delivered orders).
- Favorite restaurants: restaurants the user has ordered from, with order_count; sort by order_count descending.
- Cuisine breakdown: count orders per cuisine (from restaurant); only count delivered orders if you need a consistent rule.
- Delivery metrics: average_delivery_time_minutes (actual, from order_placed_at to delivered_at), late_delivery_rate (fraction of delivered orders that were late), average_distance_km, delivered_count.
- Actual delivery time = (delivered_at - order_placed_at) in minutes. Late = actual > estimated_delivery_minutes.
- If user has no orders, return appropriate empty/404 responses.

## 4. Expected Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/doordash/users/:userId/orders` | All orders for the user, most recent first. |
| GET | `/api/doordash/users/:userId/summary` | Total, delivered, cancelled counts; average delivery time. |
| GET | `/api/doordash/users/:userId/favorite-restaurants` | Restaurants ordered from, with order count. |
| GET | `/api/doordash/users/:userId/cuisine-breakdown` | Order count per cuisine. |
| GET | `/api/doordash/users/:userId/delivery-metrics` | Average delivery time, late rate, average distance. |

## 5. Data Models

See `task.ts` for the canonical types:

- **DeliveryOrder:** order_id, user_id, restaurant_id, order_placed_at, delivered_at, estimated_delivery_minutes, distance_km, status
- **Restaurant:** restaurant_id, name, cuisine, address
- **UserSummary:** user_id, total_orders, delivered_orders, cancelled_orders, average_delivery_time_minutes
- **FavoriteRestaurant:** restaurant_id, name, cuisine, order_count
- **CuisineBreakdown:** user_id, cuisines (array of cuisine + order_count)
- **DeliveryMetrics:** user_id, average_delivery_time_minutes, late_delivery_rate, average_distance_km, delivered_count

## 6. Expected Behavior

- **Orders:** Return order objects; optionally include restaurant name/cuisine for convenience.
- **Summary:** Count all orders; count by status (delivered vs cancelled); average delivery time only over delivered orders.
- **Favorite restaurants:** One row per distinct restaurant the user ordered from; order_count = number of orders; sort by order_count descending.
- **Cuisine breakdown:** From restaurant cuisine; count orders per cuisine (all orders or delivered-only—document your choice).
- **Delivery metrics:** Actual delivery time in minutes from order_placed_at to delivered_at. Late = actual > estimated_delivery_minutes. late_delivery_rate = (late count / delivered count).

## 7. Suggested Flask Project Structure

```
doordash/
  app.py
  requirements.txt
  mock-data/          # (provided)
  services/
    delivery_service.py
  routes/
    doordash_routes.py
  tests/
    test_doordash_api.py
```

## 8. Evaluation Criteria

- Correctness of delivery time and late rate.
- Correct join/lookup of restaurant data.
- Handling of cancelled orders and null delivered_at.
- Response shape matches `task.ts` and `example-response.json`.
- Code organization and tests.

## 9. Example Response

See `example-response.json` for sample responses for user `u1`. Delivery times: d1 38 min (late), d2 52 min (late), d3 35 min (on time), d5 55 min (late). Average = 45; late rate = 3/4 = 0.75.

---

## 10. Follow-Up Interview Questions

*For the interviewer: use after the base implementation is complete. Not part of the required task. Ordered from easier to harder; probe backend judgment, API design, data modeling, reliability, and scale.*

1. How would you model live delivery tracking (real-time status and ETA updates)?
2. How would you detect suspicious delivery delays (e.g. fraud or data quality issues)?
3. How would you support restaurant-level analytics (orders per restaurant across all users)?
4. How would you partition this data at scale (by user, by time, by region)?
5. How would you handle orders that are updated after delivery (e.g. tip or rating)?
6. How would you design an idempotent ingestion pipeline for order events?
7. How would you support filtering orders by date range or status without overloading the API?
8. How would you cache favorite-restaurants and cuisine-breakdown for heavy users?
9. How would you ensure user isolation (one user cannot see another's orders)?
10. How would you model multiple delivery attempts or failed deliveries?
11. How would you design the schema for time-series delivery metrics (e.g. daily rollups)?
12. How would you handle restaurant renames or cuisine changes over time?

---

## 11. Edge Cases to Discuss After Implementation

*For the interviewer: discussion only. Not required in the base implementation. Ordered from easier to harder.*

1. **Canceled orders:** Should they appear in orders list? In cuisine breakdown? In summary counts only?
2. **delivered_at missing for in-progress orders:** How do you compute metrics without delivered_at?
3. **Negative or impossible delivery durations:** delivered_at before order_placed_at or negative minutes. How do you validate?
4. **Missing restaurant records:** Order references restaurant_id not in restaurants.json. How do you respond?
5. **Same restaurant under slightly different names:** Two restaurant_ids for the same business. How do you handle favorites and cuisine?
6. **Zero-distance pickup-like orders:** distance_km is 0. How do you treat them in average_distance?
7. **Timezone inconsistencies:** order_placed_at and delivered_at in different zones. How do you compute duration?
8. **Duplicate delivery events:** Same order_id ingested twice with different delivered_at. How do you deduplicate?
9. **Status delivered but delivered_at null:** How do you compute delivery time?
10. **Very old orders:** How do you handle retention and performance for users with years of history?
11. **Restaurant deleted:** Restaurant removed from catalog but orders remain. How do you display history?
12. **Fractional late_delivery_rate:** How do you round and present (e.g. 2 decimal places)?
